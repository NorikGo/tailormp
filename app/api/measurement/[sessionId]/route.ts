import { NextRequest, NextResponse } from 'next/server';
import { getMeasurementProvider } from '@/app/lib/measurement/provider.factory';

/**
 * GET /api/measurement/[sessionId]
 *
 * Holt eine spezifische Measurement Session
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    const provider = getMeasurementProvider();
    const session = await provider.getSession(sessionId);

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error('Error fetching measurement session:', error);
    return NextResponse.json(
      {
        error: 'Fehler beim Laden der Session',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 404 }
    );
  }
}

/**
 * PATCH /api/measurement/[sessionId]
 *
 * Aktualisiert eine Session (z.B. speichert Measurements)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body = await req.json();
    const { measurements } = body;

    if (!measurements) {
      return NextResponse.json(
        { error: 'measurements ist erforderlich' },
        { status: 400 }
      );
    }

    // Hole Provider
    const provider = getMeasurementProvider();

    // Provider-spezifisches Speichern
    // MockProvider und ManualProvider haben beide eine saveMeasurements Methode
    if ('saveMeasurements' in provider) {
      const session = await (provider as any).saveMeasurements(
        sessionId,
        measurements
      );

      return NextResponse.json({
        success: true,
        session,
      });
    }

    // Fallback: Direkt in DB speichern
    const prisma = (await import('@/app/lib/prisma')).default;
    const session = await prisma.measurementSession.update({
      where: { id: sessionId },
      data: {
        measurements: {
          ...measurements,
          takenAt: new Date(),
          method: provider.name,
        },
        status: 'completed',
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error('Error updating measurement session:', error);
    return NextResponse.json(
      {
        error: 'Fehler beim Speichern der Measurements',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
