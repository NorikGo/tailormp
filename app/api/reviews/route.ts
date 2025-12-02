import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { reviewSchema } from '@/app/lib/validations';
import { z } from 'zod';

/**
 * POST /api/reviews
 *
 * Create a new review for a product
 */
export async function POST(req: NextRequest) {
  try {
    // TODO: Auth Integration - Extract from session
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Login required' },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Validate input
    const validatedData = reviewSchema.parse(body);

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
      include: { tailor: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if user has purchased this product
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId: validatedData.productId,
        order: {
          userId: userId,
          status: {
            in: ['paid', 'processing', 'shipped', 'completed'],
          },
        },
      },
    });

    if (!hasPurchased) {
      return NextResponse.json(
        { error: 'You can only review products you have purchased' },
        { status: 403 }
      );
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: {
        productId_userId: {
          productId: validatedData.productId,
          userId: userId,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        rating: validatedData.rating,
        comment: validatedData.comment,
        productId: validatedData.productId,
        tailorId: product.tailorId,
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    // Update tailor's average rating
    const tailorReviews = await prisma.review.findMany({
      where: { tailorId: product.tailorId },
      select: { rating: true },
    });

    const avgRating =
      tailorReviews.reduce((sum, r) => sum + r.rating, 0) / tailorReviews.length;

    await prisma.tailor.update({
      where: { id: product.tailorId },
      data: { rating: avgRating },
    });

    return NextResponse.json({
      success: true,
      review,
      message: 'Bewertung erfolgreich erstellt',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
