import { NextRequest, NextResponse } from 'next/server';
import { getMeasurementProvider } from '@/app/lib/measurement/provider.factory';

/**
 * POST /api/measurement/session
 *
 * Erstellt eine neue Measurement Session
 * Provider wird automatisch über MEASUREMENT_PROVIDER env gewählt
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, orderId } = body;

    // Validierung
    if (!userId) {
      return NextResponse.json(
        { error: 'userId ist erforderlich' },
        { status: 400 }
      );
    }

    // Hole den konfigurierten Provider
    const provider = getMeasurementProvider();

    // Erstelle Session über Provider
    const session = await provider.createSession(userId, orderId);

    return NextResponse.json({
      success: true,
      session,
      provider: provider.name,
    });
  } catch (error) {
    // console.error('Error creating measurement session:', error);
    return NextResponse.json(
      {
        error: 'Fehler beim Erstellen der Measurement Session',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/measurement/session?userId=xxx
 *
 * Holt alle Sessions eines Users
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId ist erforderlich' },
        { status: 400 }
      );
    }

    // Hole Sessions aus DB
    const prisma = (await import('@/app/lib/prisma')).default;
    const sessions = await prisma.measurementSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      sessions,
    });
  } catch (error) {
    // console.error('Error fetching measurement sessions:', error);
    return NextResponse.json(
      {
        error: 'Fehler beim Laden der Sessions',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
