/**
 * SUIT PRICING ENGINE (R2.1)
 *
 * Zentrale Logik für die Preisberechnung von Maßanzügen.
 * Berechnet finale Preise basierend auf:
 * - Suit Model (Classic/Business/Premium)
 * - Fabric (Standard/Premium/Luxury)
 * - Customizations (Lining, Monogram, Extra Trousers)
 */

import { SUIT_MODELS, getSuitModelById } from '@/app/lib/constants/suit-models';
import { prisma } from '@/app/lib/prisma';

/**
 * Input für Preisberechnung
 */
export interface PriceCalculationInput {
  suitModelId: string; // "classic" | "business" | "premium"
  fabricId: string; // UUID der Fabric aus DB
  customizations?: {
    lining?: boolean; // Premium-Futter: +50€
    monogram?: boolean; // Monogramm: +30€
    extraTrousers?: boolean; // Extra-Hose: +120€
  };
}

/**
 * Detaillierte Preisaufschlüsselung
 */
export interface PriceBreakdown {
  // Kunde sieht:
  basePrice: number; // Basis-Preis des Suit Models (z.B. 650€)
  fabricAdd: number; // Aufpreis für den Stoff (z.B. +100€)
  customizationAdd: number; // Aufpreis für Extras (z.B. +80€)
  totalPrice: number; // FINALER Endpreis für Kunde

  // Interne Aufteilung (Kunde sieht das NICHT):
  tailorShare: number; // 60% - Geht an Schneider
  platformFee: number; // 25% - TailorMarket Provision
  riskBuffer: number; // 15% - Reserve für Retouren/Probleme
}

/**
 * Pricing-Konfiguration (später in DB auslagern)
 */
const PRICING_CONFIG = {
  // Aufteilung des Gesamtpreises
  TAILOR_SHARE: 0.6, // 60%
  PLATFORM_FEE: 0.25, // 25%
  RISK_BUFFER: 0.15, // 15%

  // Customization-Preise
  CUSTOMIZATIONS: {
    lining: 50, // EUR
    monogram: 30, // EUR
    extraTrousers: 120, // EUR
  },
} as const;

/**
 * Hauptfunktion: Berechne Anzug-Preis
 *
 * @throws Error wenn suitModelId oder fabricId ungültig
 */
export async function calculateSuitPrice(
  input: PriceCalculationInput
): Promise<PriceBreakdown> {
  // 1. Hole Suit Model Base Price
  const model = getSuitModelById(input.suitModelId as any);
  if (!model) {
    throw new Error(`Invalid suit model: ${input.suitModelId}`);
  }

  const basePrice = model.basePrice;

  // 2. Hole Fabric Price Add aus DB
  const fabric = await prisma.fabric.findUnique({
    where: { id: input.fabricId },
    select: { priceAdd: true, isActive: true },
  });

  if (!fabric) {
    throw new Error(`Fabric not found: ${input.fabricId}`);
  }

  if (!fabric.isActive) {
    throw new Error(`Fabric is not active: ${input.fabricId}`);
  }

  const fabricAdd = fabric.priceAdd;

  // 3. Berechne Customization-Aufpreise
  let customizationAdd = 0;
  if (input.customizations?.lining) {
    customizationAdd += PRICING_CONFIG.CUSTOMIZATIONS.lining;
  }
  if (input.customizations?.monogram) {
    customizationAdd += PRICING_CONFIG.CUSTOMIZATIONS.monogram;
  }
  if (input.customizations?.extraTrousers) {
    customizationAdd += PRICING_CONFIG.CUSTOMIZATIONS.extraTrousers;
  }

  // 4. Berechne Total Price (was Kunde zahlt)
  const totalPrice = basePrice + fabricAdd + customizationAdd;

  // 5. Interne Aufteilung (fix, nicht verhandelbar)
  const tailorShare = Math.round(totalPrice * PRICING_CONFIG.TAILOR_SHARE);
  const platformFee = Math.round(totalPrice * PRICING_CONFIG.PLATFORM_FEE);
  const riskBuffer = Math.round(totalPrice * PRICING_CONFIG.RISK_BUFFER);

  return {
    basePrice,
    fabricAdd,
    customizationAdd,
    totalPrice,
    tailorShare,
    platformFee,
    riskBuffer,
  };
}

/**
 * Helper: Berechne nur den Total Price (ohne Details)
 * Nützlich für schnelle Preisanzeigen ohne DB-Calls
 */
export function calculateQuickPrice(
  basePrice: number,
  fabricAdd: number,
  customizationAdd: number
): number {
  return basePrice + fabricAdd + customizationAdd;
}

/**
 * Helper: Formatiere Preis für Anzeige
 */
export function formatPrice(price: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
  }).format(price);
}

/**
 * Helper: Validiere Pricing Config (sollte immer 100% ergeben)
 */
export function validatePricingConfig(): boolean {
  const total =
    PRICING_CONFIG.TAILOR_SHARE +
    PRICING_CONFIG.PLATFORM_FEE +
    PRICING_CONFIG.RISK_BUFFER;

  const isValid = Math.abs(total - 1.0) < 0.001; // Floating-point tolerance

  if (!isValid) {
    console.error(
      `[PRICING] Config invalid! Total: ${total}, Expected: 1.0`
    );
  }

  return isValid;
}

/**
 * Helper: Erstelle Pricing-Übersicht für Admin-Dashboard
 */
export function getPricingOverview() {
  return {
    config: PRICING_CONFIG,
    suitModels: SUIT_MODELS.map((model) => ({
      id: model.id,
      name: model.name,
      basePrice: model.basePrice,
      basePriceFormatted: formatPrice(model.basePrice),
    })),
    customizations: Object.entries(PRICING_CONFIG.CUSTOMIZATIONS).map(
      ([key, value]) => ({
        key,
        price: value,
        priceFormatted: formatPrice(value),
      })
    ),
  };
}
