import { NextRequest, NextResponse } from 'next/server';
import { checkoutSchema } from '@/app/lib/validations';
import { createCheckoutSession } from '@/app/lib/stripe/checkout';
import prisma from '@/app/lib/prisma';
import { getAuthenticatedUser } from '@/app/lib/auth-helpers';

/**
 * POST /api/checkout
 *
 * Erstellt eine Stripe Checkout Session für ein Produkt
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validierung
    const validatedData = checkoutSchema.parse(body);

    // Hole Produkt-Daten aus DB
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
      include: {
        tailor: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produkt nicht gefunden' },
        { status: 404 }
      );
    }

    // Get authenticated user
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Bitte einloggen' },
        { status: 401 }
      );
    }
    const userId = user.id;

    // Falls MeasurementSession angegeben, prüfe ob sie existiert
    if (validatedData.measurementSessionId) {
      const measurementSession = await prisma.measurementSession.findUnique({
        where: { id: validatedData.measurementSessionId },
      });

      if (!measurementSession) {
        return NextResponse.json(
          { error: 'Measurement Session nicht gefunden' },
          { status: 404 }
        );
      }

      if (measurementSession.status !== 'completed') {
        return NextResponse.json(
          { error: 'Measurements müssen erst abgeschlossen werden' },
          { status: 400 }
        );
      }
    }

    // Erstelle Stripe Checkout Session
    const session = await createCheckoutSession({
      productId: product.id,
      productTitle: product.title,
      productPrice: product.price,
      tailorId: product.tailorId,
      customerId: userId,
      checkoutData: validatedData,
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Checkout error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validierungsfehler', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Fehler beim Erstellen der Checkout Session',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
