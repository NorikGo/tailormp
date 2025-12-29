/**
 * SUIT MODELS - Die einzigen verfügbaren Anzugmodelle (R1.3)
 *
 * Diese Datei definiert die 3 Standard-Anzugmodelle für TailorMarket.
 * Keine weiteren Modelle können erstellt werden - nur diese 3!
 */

export const SUIT_MODELS = [
  {
    id: 'classic',
    name: 'Classic Suit',
    description: 'Zeitloser Business-Anzug mit Regular Fit. Perfekt für formelle Anlässe und Business-Meetings.',
    basePrice: 590, // EUR
    features: [
      'Regular Fit',
      'Notch Lapel',
      'Single Vent',
      '2 Buttons',
      'Flap Pockets',
    ],
    imageUrl: '/suits/classic.jpg', // Placeholder
    isActive: true,
  },
  {
    id: 'business',
    name: 'Business Suit',
    description: 'Moderner Business-Anzug mit Slim Fit. Elegant und zeitgemäß für den modernen Geschäftsmann.',
    basePrice: 650, // EUR
    features: [
      'Slim Fit',
      'Peak Lapel',
      'Double Vent',
      '2 Buttons',
      'Welted Pockets',
    ],
    imageUrl: '/suits/business.jpg', // Placeholder
    isActive: true,
  },
  {
    id: 'premium',
    name: 'Premium Suit',
    description: 'Exklusiver Maßanzug mit luxuriösen Details und erstklassiger Verarbeitung. Maximale Personalisierung.',
    basePrice: 750, // EUR
    features: [
      'Custom Fit (vollständig anpassbar)',
      'Wahl des Lapel-Stils',
      'Wahl des Vent-Stils',
      '1-3 Buttons (nach Wunsch)',
      'Premium Details & Futter',
    ],
    imageUrl: '/suits/premium.jpg', // Placeholder
    isActive: true,
  },
] as const;

export type SuitModelId = 'classic' | 'business' | 'premium';

/**
 * Helper: Get suit model by ID
 */
export function getSuitModelById(id: SuitModelId) {
  return SUIT_MODELS.find((model) => model.id === id);
}

/**
 * Helper: Get all active suit models
 */
export function getActiveSuitModels() {
  return SUIT_MODELS.filter((model) => model.isActive);
}

/**
 * Helper: Get base price for a suit model
 */
export function getSuitModelBasePrice(id: SuitModelId): number {
  const model = getSuitModelById(id);
  return model?.basePrice ?? 0;
}
