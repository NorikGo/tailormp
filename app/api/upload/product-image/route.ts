import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';
import prisma from '@/app/lib/prisma';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const BUCKET_NAME = 'product-images';

/**
 * POST /api/upload/product-image
 *
 * Upload a product image to Supabase Storage
 *
 * Query params:
 * - productId: (optional) If provided, creates ProductImage record
 * - position: (optional) Image position/order
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
        { error: 'Tailor profile not found' },
        { status: 404 }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const productId = formData.get('productId') as string | null;
    const position = formData.get('position') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // If productId provided, verify ownership
    if (productId) {
      const product = await prisma.product.findFirst({
        where: {
          id: productId,
          tailorId: tailor.id,
        },
      });

      if (!product) {
        return NextResponse.json(
          { error: 'Product not found or you do not have permission' },
          { status: 404 }
        );
      }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${tailor.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Convert File to ArrayBuffer then to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      // console.error('Supabase upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // If productId provided, create ProductImage record
    let productImage = null;
    if (productId) {
      productImage = await prisma.productImage.create({
        data: {
          productId,
          url: publicUrl,
          position: position ? parseInt(position) : 0,
        },
      });
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      productImage,
    });
  } catch (error) {
    // console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/upload/product-image
 *
 * Delete a product image from Supabase Storage
 *
 * Body:
 * - fileName: Path in Supabase Storage
 * - productImageId: (optional) ProductImage record ID to delete
 */
export async function DELETE(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');

    if (!userId || userRole !== 'tailor') {
      return NextResponse.json(
        { error: 'Unauthorized - Tailor only' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { fileName, productImageId } = body;

    if (!fileName) {
      return NextResponse.json(
        { error: 'fileName is required' },
        { status: 400 }
      );
    }

    // If productImageId provided, verify ownership
    if (productImageId) {
      const productImage = await prisma.productImage.findUnique({
        where: { id: productImageId },
        include: {
          product: {
            include: {
              tailor: true,
            },
          },
        },
      });

      if (!productImage || productImage.product.tailor.user_id !== userId) {
        return NextResponse.json(
          { error: 'Image not found or you do not have permission' },
          { status: 404 }
        );
      }

      // Delete from database
      await prisma.productImage.delete({
        where: { id: productImageId },
      });
    }

    // Delete from Supabase Storage
    const { error: deleteError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (deleteError) {
      // console.error('Supabase delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete image from storage' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    // console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
