/**
 * Standardisiertes Measurements Format
 * Alle Provider geben Measurements in diesem Format zurück
 */
export interface Measurements {
  // Alle Maße in cm
  shoulders?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  armLength?: number;
  backLength?: number;
  inseam?: number;
  outseam?: number;
  neck?: number;
  thigh?: number;

  // Metadata
  unit: 'cm' | 'inch';
  takenAt: Date;
  method: 'mock' | 'manual' | '3d-scan';
  confidence?: number; // 0-1 (für AI scans)
}

/**
 * Measurement Session Objekt
 */
export interface MeasurementSession {
  id: string;
  userId: string;
  orderId?: string;
  provider: string;
  externalId?: string;
  status: 'pending' | 'completed' | 'failed';
  qrCodeUrl?: string;
  mobileUrl: string;
  measurements?: Measurements;
  metadata?: Record<string, any>;
  createdAt: Date;
  completedAt?: Date;
  expiresAt: Date;
}

/**
 * Provider Configuration
 */
export interface ProviderConfig {
  apiKey?: string;
  apiSecret?: string;
  webhookSecret?: string;
  baseUrl?: string;
}
