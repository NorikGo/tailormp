/**
 * SUIT TYPES - TypeScript Definitionen für Anzug-Konfiguration (R1.3)
 */

import { SuitModelId } from '../lib/constants/suit-models';

/**
 * Komplette Anzug-Konfiguration wie vom Kunden gewählt
 */
export interface SuitConfiguration {
  // Modell & Stoff
  modelId: SuitModelId;
  fabricId: string;

  // Style-Optionen
  fitType: 'slim' | 'regular' | 'relaxed';
  lapelStyle: 'notch' | 'peak' | 'shawl';
  ventStyle: 'single' | 'double' | 'none';
  buttonCount: 1 | 2 | 3;
  pocketStyle: 'flap' | 'patch' | 'welted';

  // Maße
  measurements: SuitMeasurements;

  // Optionale Extras
  liningColor?: string;
  monoGramText?: string;
  specialNotes?: string;
}

/**
 * Anzug-Maße (von Measurement Tool)
 */
export interface SuitMeasurements {
  // Oberkörper (Jacket)
  chest: number; // Brustumfang
  waist: number; // Taillenumfang
  hips: number; // Hüftumfang
  shoulderWidth: number; // Schulterbreite
  sleeveLength: number; // Ärmellänge
  jacketLength: number; // Sakkolänge
  backLength: number; // Rückenlänge

  // Unterkörper (Pants)
  pantWaist: number; // Bundweite
  pantInseam: number; // Schrittlänge (innen)
  pantOutseam: number; // Beinlänge (außen)
  thigh: number; // Oberschenkelumfang

  // Einheit
  unit: 'cm' | 'inch';

  // Metadaten
  sessionId?: string; // Link zur MeasurementSession
  createdAt?: Date;
}

/**
 * Fit-Typen mit Beschreibungen
 */
export const FIT_TYPES = {
  slim: {
    id: 'slim',
    label: 'Slim Fit',
    description: 'Körpernah geschnitten, modern und elegant',
  },
  regular: {
    id: 'regular',
    label: 'Regular Fit',
    description: 'Klassischer Schnitt mit komfortabler Passform',
  },
  relaxed: {
    id: 'relaxed',
    label: 'Relaxed Fit',
    description: 'Bequem und locker, ideal für Bewegungsfreiheit',
  },
} as const;

/**
 * Lapel-Stile mit Beschreibungen
 */
export const LAPEL_STYLES = {
  notch: {
    id: 'notch',
    label: 'Notch Lapel',
    description: 'Klassischer Revers-Stil, zeitlos und vielseitig',
  },
  peak: {
    id: 'peak',
    label: 'Peak Lapel',
    description: 'Spitzer Revers, formell und elegant',
  },
  shawl: {
    id: 'shawl',
    label: 'Shawl Lapel',
    description: 'Runder Schalkragen, ideal für Smoking/Dinner Jacket',
  },
} as const;

/**
 * Vent-Stile mit Beschreibungen
 */
export const VENT_STYLES = {
  single: {
    id: 'single',
    label: 'Single Vent',
    description: 'Ein Schlitz in der Mitte, klassisch britisch',
  },
  double: {
    id: 'double',
    label: 'Double Vent',
    description: 'Zwei seitliche Schlitze, italienischer Stil',
  },
  none: {
    id: 'none',
    label: 'No Vent',
    description: 'Ohne Schlitz, sehr formell',
  },
} as const;

/**
 * Taschen-Stile mit Beschreibungen
 */
export const POCKET_STYLES = {
  flap: {
    id: 'flap',
    label: 'Flap Pockets',
    description: 'Mit Klappe, Business-Standard',
  },
  patch: {
    id: 'patch',
    label: 'Patch Pockets',
    description: 'Aufgesetzte Taschen, casual und sportlich',
  },
  welted: {
    id: 'welted',
    label: 'Welted Pockets',
    description: 'Paspeltaschen, sehr formell',
  },
} as const;

/**
 * Helper: Validiere ob eine Suit-Konfiguration vollständig ist
 */
export function isValidSuitConfiguration(config: Partial<SuitConfiguration>): config is SuitConfiguration {
  return !!(
    config.modelId &&
    config.fabricId &&
    config.fitType &&
    config.lapelStyle &&
    config.ventStyle &&
    config.buttonCount &&
    config.pocketStyle &&
    config.measurements
  );
}

/**
 * Helper: Berechne Preis basierend auf Konfiguration
 */
export function calculateSuitPrice(config: SuitConfiguration, fabricPrice: number): number {
  // Import hier vermeiden (circular dependency)
  // Basis-Preis wird vom Suit Model bestimmt
  // + Stoff-Aufpreis
  // TODO: In R2 (Pricing Logic) implementieren
  return 0;
}
