import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { updateProductSchema } from '@/app/lib/validations';
import { z } from 'zod';

/**
 * GET /api/tailor/products/[id]
 *
 * Get a single product by ID (only if owned by tailor)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Get product
    const product = await prisma.product.findFirst({
      where: {
        id: id,
        tailorId: tailor.id, // Ensure tailor owns this product
      },
      include: {
        images: {
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/tailor/products/[id]
 *
 * Update an existing product (only if owned by tailor)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Verify product ownership
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: id,
        tailorId: tailor.id,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found or you do not have permission to edit it' },
        { status: 404 }
      );
    }

    const body = await req.json();

    // Validate input (partial update)
    const validatedData = updateProductSchema.parse(body);

    // Update product
    const product = await prisma.product.update({
      where: { id: id },
      data: validatedData,
    });

    return NextResponse.json({
      success: true,
      product,
      message: 'Produkt erfolgreich aktualisiert',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tailor/products/[id]
 *
 * Delete a product (only if owned by tailor)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Verify product ownership
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: id,
        tailorId: tailor.id,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }

    // Check if product has orders
    const hasOrders = await prisma.orderItem.findFirst({
      where: { productId: id },
    });

    if (hasOrders) {
      return NextResponse.json(
        { error: 'Cannot delete product with existing orders. Consider marking it as inactive instead.' },
        { status: 400 }
      );
    }

    // Delete associated images first
    await prisma.productImage.deleteMany({
      where: { productId: id },
    });

    // Delete product
    await prisma.product.delete({
      where: { id: id },
    });

    return NextResponse.json({
      success: true,
      message: 'Produkt erfolgreich gelöscht',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
