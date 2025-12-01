import { Measurements, MeasurementSession } from './measurements.types';

/**
 * Measurement Provider Interface
 *
 * Jeder Provider (Mock, Manual, 3DLOOK) muss dieses Interface implementieren
 * Dies ermöglicht nahtlosen Wechsel zwischen Providern ohne Code-Änderungen
 */
export interface MeasurementProvider {
  /**
   * Name des Providers
   */
  name: string;

  /**
   * Erstellt eine neue Measurement Session
   * @param userId - ID des Users
   * @param orderId - Optional: ID der Order
   * @returns Promise mit der erstellten Session
   */
  createSession(
    userId: string,
    orderId?: string
  ): Promise<MeasurementSession>;

  /**
   * Holt eine bestehende Session
   * @param sessionId - ID der Session
   * @returns Promise mit der Session
   */
  getSession(sessionId: string): Promise<MeasurementSession>;

  /**
   * Holt die Measurements einer abgeschlossenen Session
   * @param sessionId - ID der Session
   * @returns Promise mit den Measurements
   */
  getMeasurements(sessionId: string): Promise<Measurements>;

  /**
   * Generiert die Mobile URL für den Scan/Input
   * @param sessionId - ID der Session
   * @returns Promise mit der Mobile URL
   */
  getMobileUrl(sessionId: string): Promise<string>;

  /**
   * Optional: Validiert Webhook Signaturen (für 3DLOOK)
   * @param signature - Webhook Signatur
   * @param body - Webhook Body
   * @returns true wenn valide
   */
  validateWebhook?(signature: string, body: any): boolean;

  /**
   * Optional: Verarbeitet Webhook Events (für 3DLOOK)
   * @param body - Webhook Body
   * @returns Promise mit verarbeitetem Ergebnis
   */
  handleWebhook?(body: any): Promise<void>;
}
