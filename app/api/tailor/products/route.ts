import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { productSchema } from '@/app/lib/validations';
import { z } from 'zod';

/**
 * POST /api/tailor/products
 *
 * Create a new Product for the logged-in tailor
 */
export async function POST(req: NextRequest) {
  try {
    // TODO: Auth Integration - Extract from session
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');

    if (!userId || userRole !== 'tailor') {
      return NextResponse.json(
        { error: 'Unauthorized - Tailor only' },
        { status: 403 }
      );
    }

    // Find tailor profile
    const tailor = await prisma.tailor.findUnique({
      where: { user_id: userId },
    });

    if (!tailor) {
      return NextResponse.json(
        { error: 'Tailor profile not found. Please complete your profile first.' },
        { status: 404 }
      );
    }

    const body = await req.json();

    // Validate input
    const validatedData = productSchema.parse(body);

    // Create product
    const product = await prisma.product.create({
      data: {
        tailorId: tailor.id,
        title: validatedData.title,
        description: validatedData.description,
        price: validatedData.price,
        category: validatedData.category,
      },
    });

    return NextResponse.json({
      success: true,
      product,
      message: 'Produkt erfolgreich erstellt',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/tailor/products
 *
 * Get all products for the logged-in tailor
 */
export async function GET(req: NextRequest) {
  try {
    // TODO: Auth Integration - Extract from session
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');

    if (!userId || userRole !== 'tailor') {
      return NextResponse.json(
        { error: 'Unauthorized - Tailor only' },
        { status: 403 }
      );
    }

    // Find tailor profile
    const tailor = await prisma.tailor.findUnique({
      where: { user_id: userId },
    });

    if (!tailor) {
      return NextResponse.json(
        { error: 'Tailor profile not found' },
        { status: 404 }
      );
    }

    // Get all products for this tailor
    const products = await prisma.product.findMany({
      where: { tailorId: tailor.id },
      include: {
        images: {
          orderBy: { position: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
