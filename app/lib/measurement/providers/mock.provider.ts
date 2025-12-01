import { MeasurementProvider } from '../provider.interface';
import {
  Measurements,
  MeasurementSession,
} from '../measurements.types';
import prisma from '@/app/lib/prisma';

/**
 * Mock Provider
 *
 * Simuliert den 3DLOOK Flow für MVP Testing
 * - Generiert QR-Code URL zu einer Mock Mobile Page
 * - Mobile Page zeigt Form mit Demo-Daten
 * - User kann "Scan abschließen" → Gibt Mock-Daten zurück
 *
 * Perfekt für Testing ohne Kosten!
 */
export class MockProvider implements MeasurementProvider {
  name = 'mock';

  /**
   * Erstellt eine neue Mock Measurement Session
   */
  async createSession(
    userId: string,
    orderId?: string
  ): Promise<MeasurementSession> {
    // Session expires in 24 hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Externe Mock Session ID (simuliert 3DLOOK Session ID)
    const externalId = `mock_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Erstelle Session in DB
    const session = await prisma.measurementSession.create({
      data: {
        userId,
        orderId,
        provider: this.name,
        externalId,
        status: 'pending',
        expiresAt,
        metadata: {
          createdBy: 'MockProvider',
          version: '1.0',
        },
      },
    });

    // Generiere Mobile URL
    const mobileUrl = await this.getMobileUrl(session.id);

    // Update mit Mobile URL
    const updatedSession = await prisma.measurementSession.update({
      where: { id: session.id },
      data: { mobileUrl },
    });

    return this.mapToSession(updatedSession);
  }

  /**
   * Holt eine bestehende Session
   */
  async getSession(sessionId: string): Promise<MeasurementSession> {
    const session = await prisma.measurementSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    return this.mapToSession(session);
  }

  /**
   * Holt die Measurements einer Session
   */
  async getMeasurements(sessionId: string): Promise<Measurements> {
    const session = await this.getSession(sessionId);

    if (session.status !== 'completed') {
      throw new Error(
        `Session not completed: ${sessionId} (status: ${session.status})`
      );
    }

    if (!session.measurements) {
      throw new Error(`No measurements found for session: ${sessionId}`);
    }

    return session.measurements;
  }

  /**
   * Generiert die Mobile URL
   */
  async getMobileUrl(sessionId: string): Promise<string> {
    const baseUrl =
      process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    return `${baseUrl}/measurement/mock/${sessionId}`;
  }

  /**
   * Speichert Mock Measurements
   * (Wird von der Mobile Page aufgerufen)
   */
  async saveMeasurements(
    sessionId: string,
    measurements: Omit<Measurements, 'takenAt' | 'method'>
  ): Promise<MeasurementSession> {
    const fullMeasurements: Measurements = {
      ...measurements,
      takenAt: new Date(),
      method: 'mock',
    };

    const session = await prisma.measurementSession.update({
      where: { id: sessionId },
      data: {
        measurements: fullMeasurements as any,
        status: 'completed',
        completedAt: new Date(),
      },
    });

    return this.mapToSession(session);
  }

  /**
   * Generiert Demo Measurements (realistische Werte)
   */
  generateDemoMeasurements(): Omit<
    Measurements,
    'takenAt' | 'method'
  > {
    return {
      shoulders: 45,
      chest: 98,
      waist: 85,
      hips: 95,
      armLength: 60,
      backLength: 45,
      inseam: 82,
      outseam: 108,
      neck: 38,
      thigh: 58,
      unit: 'cm',
      confidence: 0.95, // Mock confidence
    };
  }

  /**
   * Helper: Map DB Model zu Interface
   */
  private mapToSession(dbSession: any): MeasurementSession {
    return {
      id: dbSession.id,
      userId: dbSession.userId,
      orderId: dbSession.orderId || undefined,
      provider: dbSession.provider,
      externalId: dbSession.externalId || undefined,
      status: dbSession.status,
      qrCodeUrl: dbSession.qrCodeUrl || undefined,
      mobileUrl: dbSession.mobileUrl,
      measurements: dbSession.measurements
        ? {
            ...dbSession.measurements,
            takenAt: new Date(dbSession.measurements.takenAt),
          }
        : undefined,
      metadata: dbSession.metadata || undefined,
      createdAt: dbSession.createdAt,
      completedAt: dbSession.completedAt || undefined,
      expiresAt: dbSession.expiresAt,
    };
  }
}
