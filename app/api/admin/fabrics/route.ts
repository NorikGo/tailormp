/**
 * ADMIN FABRIC API - GET & POST (R2.2)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/app/lib/prisma';
import { z } from 'zod';

// Validation Schema
const fabricSchema = z.object({
  name: z.string().min(3, 'Name muss mindestens 3 Zeichen lang sein'),
  description: z.string().optional(),
  material: z.string().min(2, 'Material ist erforderlich'),
  weight: z.string().optional(),
  pattern: z.enum(['Solid', 'Pinstripe', 'Check', 'Herringbone']).optional(),
  color: z.string().min(2, 'Farbe ist erforderlich'),
  season: z.enum(['All Season', 'Summer', 'Winter', 'Spring/Fall']).optional(),
  priceCategory: z.enum(['standard', 'premium', 'luxury']),
  priceAdd: z.number().min(0, 'Preis-Aufschlag muss >= 0 sein'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  position: z.number().int().min(0).default(0),
});

/**
 * Auth Helper: Check if user is admin
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
 * GET /api/admin/fabrics
 * Liste aller Fabrics (für Admin)
 */
export async function GET(request: NextRequest) {
  // Auth Check
  const { authorized } = await checkAdminAuth();
  if (!authorized) {
    return NextResponse.json(
      { error: 'Keine Berechtigung' },
      { status: 403 }
    );
  }

  try {
    const fabrics = await prisma.fabric.findMany({
      orderBy: [
        { position: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ fabrics }, { status: 200 });
  } catch (error) {
    console.error('[ADMIN FABRICS GET] Error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Fabrics' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/fabrics
 * Neuen Fabric erstellen
 */
export async function POST(request: NextRequest) {
  // Auth Check
  const { authorized } = await checkAdminAuth();
  if (!authorized) {
    return NextResponse.json(
      { error: 'Keine Berechtigung' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    // Validate
    const validatedData = fabricSchema.parse(body);

    // Create Fabric
    const fabric = await prisma.fabric.create({
      data: validatedData,
    });

    return NextResponse.json({ fabric }, { status: 201 });
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

    console.error('[ADMIN FABRICS POST] Error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Erstellen des Fabrics' },
      { status: 500 }
    );
  }
}
