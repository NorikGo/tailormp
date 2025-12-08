import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { tailorProfileSchema } from '@/app/lib/validations';
import { z } from 'zod';

/**
 * GET /api/tailor/profile
 *
 * Get Tailor Profile for logged-in tailor
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

    return NextResponse.json({ tailor });
  } catch (error) {
    // console.error('Error fetching tailor profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/tailor/profile
 *
 * Update Tailor Profile
 */
export async function PATCH(req: NextRequest) {
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

    const body = await req.json();

    // Validate input
    const validatedData = tailorProfileSchema.parse(body);

    // Check if tailor profile exists
    const existingTailor = await prisma.tailor.findUnique({
      where: { user_id: userId },
    });

    let tailor;

    if (existingTailor) {
      // Update existing profile
      tailor = await prisma.tailor.update({
        where: { user_id: userId },
        data: validatedData,
      });
    } else {
      // Create new profile
      tailor = await prisma.tailor.create({
        data: {
          user_id: userId,
          ...validatedData,
        },
      });
    }

    return NextResponse.json({
      success: true,
      tailor,
      message: 'Profil erfolgreich aktualisiert',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    // console.error('Error updating tailor profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
