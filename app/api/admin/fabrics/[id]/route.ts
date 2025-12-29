/**
 * ADMIN FABRIC API - PATCH & DELETE (R2.2)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/app/lib/prisma';
import { z } from 'zod';

// Validation Schema (partial for PATCH)
const fabricUpdateSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional().nullable(),
  material: z.string().min(2).optional(),
  weight: z.string().optional().nullable(),
  pattern: z.enum(['Solid', 'Pinstripe', 'Check', 'Herringbone']).optional().nullable(),
  color: z.string().min(2).optional(),
  season: z.enum(['All Season', 'Summer', 'Winter', 'Spring/Fall']).optional().nullable(),
  priceCategory: z.enum(['standard', 'premium', 'luxury']).optional(),
  priceAdd: z.number().min(0).optional(),
  imageUrl: z.string().url().optional().nullable().or(z.literal('')),
  isActive: z.boolean().optional(),
  position: z.number().int().min(0).optional(),
});

/**
 * Auth Helper
 */
async function checkAdminAuth() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { authorized: false, userId: null };
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (!dbUser || dbUser.role !== 'admin') {
    return { authorized: false, userId: user.id };
  }

  return { authorized: true, userId: user.id };
}

/**
 * PATCH /api/admin/fabrics/[id]
 * Fabric aktualisieren
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Auth Check
  const { authorized } = await checkAdminAuth();
  if (!authorized) {
    return NextResponse.json(
      { error: 'Keine Berechtigung' },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Validate
    const validatedData = fabricUpdateSchema.parse(body);

    // Check if fabric exists
    const existingFabric = await prisma.fabric.findUnique({
      where: { id },
    });

    if (!existingFabric) {
      return NextResponse.json(
        { error: 'Fabric nicht gefunden' },
        { status: 404 }
      );
    }

    // Update Fabric
    const fabric = await prisma.fabric.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({ fabric }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validierungsfehler',
          details: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 422 }
      );
    }

    console.error('[ADMIN FABRICS PATCH] Error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren des Fabrics' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/fabrics/[id]
 * Fabric löschen
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Auth Check
  const { authorized } = await checkAdminAuth();
  if (!authorized) {
    return NextResponse.json(
      { error: 'Keine Berechtigung' },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;

    // Check if fabric exists
    const existingFabric = await prisma.fabric.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!existingFabric) {
      return NextResponse.json(
        { error: 'Fabric nicht gefunden' },
        { status: 404 }
      );
    }

    // Check if fabric is in use
    if (existingFabric._count.products > 0) {
      return NextResponse.json(
        {
          error: 'Fabric kann nicht gelöscht werden',
          message: `Dieser Stoff wird noch von ${existingFabric._count.products} Produkt(en) verwendet. Bitte zuerst die Produkte entfernen oder einen anderen Stoff zuweisen.`,
        },
        { status: 409 }
      );
    }

    // Delete Fabric
    await prisma.fabric.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Fabric erfolgreich gelöscht' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[ADMIN FABRICS DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Löschen des Fabrics' },
      { status: 500 }
    );
  }
}
