import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import prisma from "@/app/lib/prisma";
import { z } from "zod";

/**
 * GET /api/reviews
 * Fetch reviews for a product or tailor
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const productId = searchParams.get("productId");
    const tailorId = searchParams.get("tailorId");
    const userId = searchParams.get("userId");

    // Build where clause
    const where: any = {};
    if (productId) where.productId = productId;
    if (tailorId) where.tailorId = tailorId;
    if (userId) where.userId = userId;

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate statistics if filtering by product or tailor
    let stats = null;
    if (productId || tailorId) {
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;

      stats = {
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: reviews.length,
        ratingDistribution: {
          5: reviews.filter((r) => r.rating === 5).length,
          4: reviews.filter((r) => r.rating === 4).length,
          3: reviews.filter((r) => r.rating === 3).length,
          2: reviews.filter((r) => r.rating === 2).length,
          1: reviews.filter((r) => r.rating === 1).length,
        },
      };
    }

    return NextResponse.json({ reviews, stats }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reviews
 * Create a new review (authenticated)
 */
export async function POST(req: NextRequest) {
  try {
    // Auth check with Supabase
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validation
    const reviewSchema = z.object({
      productId: z.string().cuid(),
      rating: z.number().int().min(1).max(5),
      comment: z.string().max(1000).optional(),
    });

    const validatedData = reviewSchema.parse(body);

    // Get product to get tailorId
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        productId_userId: {
          productId: validatedData.productId,
          userId: user.id,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 409 }
      );
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        productId: validatedData.productId,
        tailorId: product.tailorId,
        userId: user.id,
        rating: validatedData.rating,
        comment: validatedData.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Update tailor rating (average of all reviews)
    const allTailorReviews = await prisma.review.findMany({
      where: { tailorId: product.tailorId },
    });

    const avgRating =
      allTailorReviews.reduce((sum, r) => sum + r.rating, 0) /
      allTailorReviews.length;

    await prisma.tailor.update({
      where: { id: product.tailorId },
      data: { rating: Math.round(avgRating * 10) / 10 },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 422 }
      );
    }

    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
