import { MeasurementProvider } from '../provider.interface';
import {
  Measurements,
  MeasurementSession,
} from '../measurements.types';
import prisma from '@/app/lib/prisma';

/**
 * Manual Provider
 *
 * Ermöglicht manuelle Eingabe von Maßen durch den User
 * - Kein QR-Code Flow
 * - Direkt eine Form auf der Website
 * - Text-Anleitungen für jedes Maß
 * - Für User ohne Smartphone oder die lieber selbst messen
 */
export class ManualProvider implements MeasurementProvider {
  name = 'manual';

  /**
   * Erstellt eine neue Manual Measurement Session
   */
  async createSession(
    userId: string,
    orderId?: string
  ): Promise<MeasurementSession> {
    // Session expires in 7 days (mehr Zeit für manuelle Eingabe)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Erstelle Session in DB
    const session = await prisma.measurementSession.create({
      data: {
        userId,
        orderId,
        provider: this.name,
        status: 'pending',
        expiresAt,
        metadata: {
          createdBy: 'ManualProvider',
          version: '1.0',
        },
      },
    });

    // Generiere Mobile URL (auch wenn nicht für QR-Code genutzt)
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
   * Generiert die Form URL
   */
  async getMobileUrl(sessionId: string): Promise<string> {
    const baseUrl =
      process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    return `${baseUrl}/measurement/manual/${sessionId}`;
  }

  /**
   * Speichert Manual Measurements
   * (Wird von der Manual Form aufgerufen)
   */
  async saveMeasurements(
    sessionId: string,
    measurements: Omit<Measurements, 'takenAt' | 'method'>
  ): Promise<MeasurementSession> {
    const fullMeasurements: Measurements = {
      ...measurements,
      takenAt: new Date(),
      method: 'manual',
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
   * Validiert Measurements
   * Stellt sicher dass alle Werte plausibel sind
   */
  validateMeasurements(
    measurements: Partial<Measurements>
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Prüfe auf negative Werte
    Object.entries(measurements).forEach(([key, value]) => {
      if (typeof value === 'number' && value < 0) {
        errors.push(`${key} kann nicht negativ sein`);
      }
    });

    // Prüfe auf unrealistische Werte (z.B. zu klein oder zu groß)
    const ranges: Record<string, { min: number; max: number }> = {
      shoulders: { min: 30, max: 60 },
      chest: { min: 70, max: 150 },
      waist: { min: 60, max: 140 },
      hips: { min: 70, max: 150 },
      armLength: { min: 40, max: 80 },
      backLength: { min: 30, max: 60 },
      inseam: { min: 60, max: 100 },
      outseam: { min: 80, max: 130 },
      neck: { min: 30, max: 50 },
      thigh: { min: 40, max: 80 },
    };

    Object.entries(ranges).forEach(([key, range]) => {
      const value = measurements[key as keyof Measurements];
      if (
        typeof value === 'number' &&
        (value < range.min || value > range.max)
      ) {
        errors.push(
          `${key} sollte zwischen ${range.min}cm und ${range.max}cm liegen`
        );
      }
    });

    return {
      valid: errors.length === 0,
      errors,
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
