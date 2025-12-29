/**
 * BRAND IDENTITY - TailorMarket (R3.1)
 *
 * Zentrale Definition der Markenidentität.
 * Diese Werte werden überall in der App verwendet.
 */

export const BRAND = {
  // Name & Tagline
  name: 'TailorMarket',
  fullName: 'TailorMarket - Maßanzüge aus Vietnam',
  tagline: 'Maßanzüge aus Vietnam. Fair. Hochwertig. Erschwinglich.',
  slogan: 'Dein Maßanzug. Fair gefertigt. Perfekt sitzend.',

  // Mission & Vision
  mission:
    'Wir verbinden talentierte Schneider aus Vietnam mit Menschen, die Qualität und Fairness schätzen.',
  vision:
    'Eine Welt, in der faire Bezahlung und erstklassige Handwerkskunst Hand in Hand gehen.',

  // Kernwerte
  values: [
    {
      id: 'fairness',
      title: 'Fairness',
      description:
        'Schneider erhalten 60% des Verkaufspreises – deutlich über dem Marktstandard von 10-20%.',
      icon: '🤝',
    },
    {
      id: 'quality',
      title: 'Qualität',
      description:
        'Jeder Anzug wird von erfahrenen Schneidern mit 10+ Jahren Erfahrung handgefertigt.',
      icon: '✨',
    },
    {
      id: 'transparency',
      title: 'Transparenz',
      description:
        'Du siehst genau, wer deinen Anzug fertigt und was er dafür verdient.',
      icon: '👁️',
    },
  ],

  // Preise (Referenz, echte Preise kommen aus Pricing Engine)
  pricing: {
    min: 550,
    max: 750,
    average: 650,
    currency: 'EUR',
    savingsVsLocal: '50-70%',
    savingsNote:
      'Im Vergleich zu Maßschneidern in Deutschland (1.200-2.500€)',
  },

  // Vietnam-Story
  vietnam: {
    title: 'Warum Vietnam?',
    why: 'Vietnam hat eine jahrhundertelange Schneidertradition und ist bekannt für erstklassige Handwerkskunst zu fairen Preisen.',
    quality:
      'Vietnamesische Schneider fertigen auch für internationale Luxusmarken wie Hugo Boss und Armani.',
    fairness:
      'Faire Bezahlung in Vietnam bedeutet: Ein Schneider verdient 3-4x das lokale Durchschnittseinkommen.',
    cities: ['Ho Chi Minh City', 'Hanoi', 'Hoi An'],
    tradition:
      'Hoi An ist weltbekannt als die "Stadt der Schneider" und zieht jährlich tausende Kunden an.',
  },

  // Garantien & Versprechen
  guarantees: [
    {
      title: '100% Maßanfertigung',
      description: 'Jeder Anzug wird individuell nach deinen Maßen gefertigt',
    },
    {
      title: 'Faire Bezahlung garantiert',
      description: '60% des Preises gehen direkt an den Schneider',
    },
    {
      title: '14 Tage Rückgaberecht',
      description: 'Nicht zufrieden? Geld zurück, ohne Wenn und Aber',
    },
    {
      title: 'Passform-Garantie',
      description:
        'Sitzt der Anzug nicht perfekt, passen wir ihn kostenlos an',
    },
  ],

  // Wie es funktioniert (3 Schritte)
  howItWorks: [
    {
      step: 1,
      title: 'Modell & Stoff wählen',
      description:
        'Wähle aus 3 Anzugmodellen und 10-20 hochwertigen Stoffen',
      icon: '🎨',
    },
    {
      step: 2,
      title: 'Maße digital erfassen',
      description: 'Unser Tool führt dich Schritt-für-Schritt durch die Messung',
      icon: '📏',
    },
    {
      step: 3,
      title: 'Fertigung & Lieferung',
      description:
        'Dein Schneider fertigt den Anzug in 3-4 Wochen und liefert direkt zu dir',
      icon: '✈️',
    },
  ],

  // Social Proof
  stats: {
    tailors: 12, // Aktuell verfügbare Schneider
    orders: 150, // Bisherige Bestellungen
    rating: 4.8, // Durchschnittsbewertung
    countries: 3, // Länder (später mehr)
  },

  // Contact & Support
  contact: {
    email: 'hello@tailormarket.com',
    supportEmail: 'support@tailormarket.com',
    phone: '+49 (0) 123 456789', // Placeholder
  },

  // Social Media (Placeholder)
  social: {
    instagram: 'https://instagram.com/tailormarket',
    facebook: 'https://facebook.com/tailormarket',
    twitter: 'https://twitter.com/tailormarket',
  },
} as const;

/**
 * Terminology - Wie wir sprechen
 */
export const TERMINOLOGY = {
  // VORHER → NACHHER
  product: 'Maßanzug',
  products: 'Maßanzüge',
  item: 'Anzug',
  items: 'Anzüge',
  category: 'Anzugmodell',
  categories: 'Anzugmodelle',
  order: 'Bestellung',
  orders: 'Bestellungen',

  // CTAs
  buyNow: 'Maßanzug konfigurieren',
  addToCart: 'Zum Warenkorb',
  viewProduct: 'Anzug ansehen',
  exploreTailors: 'Unsere Schneider',
  howItWorks: 'So funktioniert\'s',

  // Navigation
  navProducts: 'Anzüge',
  navTailors: 'Schneider',
  navAbout: 'Über uns',
  navHowItWorks: 'So funktioniert\'s',
} as const;

/**
 * Helper: Get formatted price
 */
export function getBrandPriceRange(): string {
  return `${BRAND.pricing.min}-${BRAND.pricing.max}€`;
}

/**
 * Helper: Get Vietnam selling points
 */
export function getVietnamBenefits(): string[] {
  return [
    BRAND.vietnam.why,
    BRAND.vietnam.quality,
    BRAND.vietnam.fairness,
  ];
}
