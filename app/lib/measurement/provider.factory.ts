import { MeasurementProvider } from './provider.interface';
import { MockProvider } from './providers/mock.provider';
import { ManualProvider } from './providers/manual.provider';
// Import für später:
// import { ThreeDLookProvider } from './providers/3dlook.provider';

/**
 * Provider Factory
 *
 * Gibt den konfigurierten Measurement Provider zurück
 * Provider wird über MEASUREMENT_PROVIDER Environment Variable gesteuert
 *
 * Usage:
 * const provider = getMeasurementProvider();
 * const session = await provider.createSession(userId);
 */
export function getMeasurementProvider(): MeasurementProvider {
  const providerName = process.env.MEASUREMENT_PROVIDER || 'mock';

  switch (providerName) {
    case 'mock':
      return new MockProvider();

    case 'manual':
      return new ManualProvider();

    // Später aktivieren:
    // case '3dlook':
    //   return new ThreeDLookProvider({
    //     apiKey: process.env.MEASUREMENT_API_KEY!,
    //     apiSecret: process.env.MEASUREMENT_API_SECRET!,
    //     webhookSecret: process.env.MEASUREMENT_WEBHOOK_SECRET,
    //   });

    default:
      console.warn(
        `Unknown measurement provider: ${providerName}, falling back to mock`
      );
      return new MockProvider();
  }
}

/**
 * Hilfsfunktion: Prüft ob ein Provider verfügbar ist
 */
export function isProviderAvailable(providerName: string): boolean {
  const availableProviders = ['mock', 'manual'];
  // Später: availableProviders.push('3dlook')
  return availableProviders.includes(providerName);
}

/**
 * Hilfsfunktion: Gibt alle verfügbaren Provider zurück
 */
export function getAvailableProviders(): string[] {
  return ['mock', 'manual'];
  // Später: return ['mock', 'manual', '3dlook'];
}
