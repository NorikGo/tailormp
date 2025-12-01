# MEASUREMENT STRATEGY - Provider Abstraction

## Philosophie

Wir bauen eine flexible Measurement-Lösung, die verschiedene Provider unterstützt.
Am Anfang nutzen wir einen Mock/Manual Provider, später wechseln wir zu 3DLOOK.

## Architektur

### Provider Interface

Jeder Provider muss diese Methoden implementieren:

interface MeasurementProvider {
name: string;
createSession(userId: string, orderId?: string): Promise<MeasurementSession>;
getSession(sessionId: string): Promise<MeasurementSession>;
getMeasurements(sessionId: string): Promise<Measurements>;
getMobileUrl(sessionId: string): Promise<string>;
validateWebhook?(signature: string, body: any): boolean;
}

### Provider Implementationen

#### 1. MockProvider (JETZT - für MVP)

Zweck: Testing & Demo ohne Kosten

Features:

- Generiert Mock Measurement Session
- Simuliert 3DLOOK Flow (QR-Code → Mobile Page)
- Mobile Page: Simple Form mit vorausgefüllten Demo-Daten
- User kann "Scan abschließen" klicken → Gibt Mock-Daten zurück
- VORTEIL: Du kannst den kompletten Flow testen ohne Kosten

Implementation Beispiel:
Datei: app/lib/measurement/providers/mock.provider.ts

export class MockProvider implements MeasurementProvider {
name = 'mock';

async createSession(userId: string, orderId?: string) {
// Erstelle Session in DB mit mock external ID
// Generiere QR-Code URL zu: /measurement/mock/[sessionId]
return session;
}

async getMobileUrl(sessionId: string) {
return `${process.env.NEXT_PUBLIC_URL}/measurement/mock/${sessionId}`;
}

async getMeasurements(sessionId: string) {
// Return realistic mock measurements
return {
shoulders: 45,
chest: 98,
waist: 85,
hips: 95,
// ... etc
};
}
}

Mobile Page: /measurement/mock/[sessionId]

- Zeigt simple Form mit vorausgefüllten Werten
- User kann anpassen (für Realismus)
- "Scan abschließen" Button
- Speichert in DB, redirect zu Checkout

#### 2. ManualProvider (JETZT - Alternative/Fallback)

Zweck: User kann manuell Maße eingeben (wie ursprüngliche Roadmap)

Features:

- Kein QR-Code Flow
- Direkt eine Form auf der Website
- Text-Anleitungen für jedes Maß
- Für User die kein Smartphone haben oder lieber selbst messen

Wann nutzen:

- Als Alternative zu Mock (beide parallel anbieten)
- Als Fallback wenn 3DLOOK mal down ist (später)

#### 3. 3DLookProvider (SPÄTER - Production)

Zweck: Echtes professionelles Body Scanning

Implementation Beispiel:
Datei: app/lib/measurement/providers/3dlook.provider.ts

export class ThreeDLookProvider implements MeasurementProvider {
name = '3dlook';

async createSession(userId: string, orderId?: string) {
// Call 3DLOOK API
const response = await fetch('https://api.3dlook.ai/sessions', {
method: 'POST',
headers: {
'Authorization': `Bearer ${process.env.MEASUREMENT_API_KEY}`,
},
body: JSON.stringify({ userId, orderId }),
});
// ... handle response
}

// ... rest der 3DLOOK Integration
}

### Provider Factory

Welcher Provider wird genutzt?

Datei: app/lib/measurement/provider.factory.ts

import { MockProvider } from './providers/mock.provider';
import { ManualProvider } from './providers/manual.provider';
import { ThreeDLookProvider } from './providers/3dlook.provider';

export function getMeasurementProvider(): MeasurementProvider {
const provider = process.env.MEASUREMENT_PROVIDER || 'mock';

switch (provider) {
case 'mock':
return new MockProvider();
case 'manual':
return new ManualProvider();
case '3dlook':
return new ThreeDLookProvider();
default:
throw new Error(`Unknown provider: ${provider}`);
}
}

In .env.local:

# JETZT für MVP

MEASUREMENT_PROVIDER=mock

# SPÄTER für Production

# MEASUREMENT_PROVIDER=3dlook

# MEASUREMENT_API_KEY=xxx

# MEASUREMENT_API_SECRET=xxx

### API Routes nutzen Factory

Datei: app/api/measurement/session/route.ts

import { getMeasurementProvider } from '@/app/lib/measurement/provider.factory';

export async function POST(req: Request) {
const provider = getMeasurementProvider(); // ← Automatisch richtiger Provider
const session = await provider.createSession(userId, orderId);
return Response.json(session);
}

## UX für verschiedene Provider

### MockProvider UX:

Desktop:
→ "Maße nehmen" Button
→ Modal: QR-Code + "Dies ist eine Demo-Version"
→ Scan → /measurement/mock/[id]
→ Form mit Demo-Daten vorausgefüllt
→ "Scan abschließen"
→ Zurück zu Checkout

Mobile:
→ "Maße nehmen" Button
→ Direkt zu /measurement/mock/[id]
→ Form mit Demo-Daten
→ "Scan abschließen"

### ManualProvider UX:

Desktop/Mobile:
→ "Maße eingeben" Button
→ Modal oder Page öffnet sich
→ Multi-Step Form (wie in Original-Roadmap)
→ Mit Hilfe-Texten
→ Speichern → Zurück zu Checkout

### 3DLookProvider UX (später):

Desktop:
→ "Maße scannen" Button
→ Modal: QR-Code + "Professionelles 3D Scanning"
→ Scan → 3DLOOK Widget
→ 2 Fotos machen
→ AI berechnet
→ Zurück zu Checkout

Mobile:
→ "Maße scannen" Button
→ Direkt zu 3DLOOK Widget
→ 2 Fotos
→ Fertig

## Prisma Schema (Provider-agnostic)

model MeasurementSession {
id String @id @default(cuid())
userId String
user User @relation(fields: [userId], references: [id])
orderId String?
order Order? @relation(fields: [orderId], references: [id])

// Provider info
provider String // "mock" | "manual" | "3dlook"
externalId String? @unique // Provider's session ID (if any)

// Status
status String // "pending" | "completed" | "failed"

// URLs
qrCodeUrl String? // For QR-Code display (if applicable)
mobileUrl String // Where QR leads to

// Result
measurements Json? // Standardized format

// Metadata
metadata Json? // Provider-specific data

createdAt DateTime @default(now())
completedAt DateTime?
expiresAt DateTime // Auto-cleanup old sessions

@@index([userId])
@@index([orderId])
@@index([status])
}

## Standardized Measurements Format

Alle Provider geben Measurements in diesem Format zurück:

interface Measurements {
// All in cm
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
confidence?: number; // 0-1 (for AI scans)
}

## Migration Path: Mock → 3DLOOK

Schritt 1 (JETZT):

- Implementiere Provider Architecture
- Nutze MockProvider
- Teste kompletten Flow

Schritt 2 (später):

- Registriere bei 3DLOOK
- Implementiere ThreeDLookProvider
- Teste parallel zu Mock

Schritt 3 (Go Live):

- Ändere .env: MEASUREMENT_PROVIDER=3dlook
- Fertig! ✅

Wichtig: Der Rest der App (Checkout, Orders, etc.) merkt nichts davon!

## MVP Timeline

### Phase 4A (JETZT - 12h):

- Provider Architecture
- MockProvider Implementation
- ManualProvider Implementation (parallel)
- API Routes mit Factory
- Frontend Components (provider-agnostic)
- Testing

### Phase 4B (SPÄTER - 8h):

- 3DLookProvider Implementation
- 3DLOOK API Integration
- Webhook Handler
- Production Testing
- Switch Provider in .env

## Testing Strategy

Mit MockProvider kannst du testen:
✅ QR-Code Generation & Display
✅ Mobile Device Detection
✅ Mobile Measurement Page Flow
✅ Data Return & Storage
✅ Checkout Integration
✅ Error Handling
✅ User Experience komplett

Ohne Kosten! 🎉

## User Communication

Während MVP Phase:
Zeige transparenten Hinweis:

"TailorMarket befindet sich in der Beta-Phase.
Das Measurement-Tool zeigt derzeit Demo-Daten.
Bitte passe die Werte an deine echten Maße an."

Nach 3DLOOK Integration:
Entferne Hinweis, Feature läuft normal.

## Environment Variables

# .env.local (MVP)

MEASUREMENT_PROVIDER=mock
NEXT_PUBLIC_URL=http://localhost:3000

# .env.local (Production später)

MEASUREMENT_PROVIDER=3dlook
MEASUREMENT_API_KEY=your_3dlook_key
MEASUREMENT_API_SECRET=your_3dlook_secret
MEASUREMENT_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_URL=https://tailormarket.com

## Vorteile dieser Strategie

✅ Kein Vendor Lock-in: Du kannst Provider jederzeit wechseln
✅ Kostenlos MVP: Keine $500/Monat während Testing
✅ Realistische Tests: Du kannst den kompletten Flow testen
✅ Smooth Migration: Nur .env ändern, kein Code-Refactoring
✅ Fallback Option: Bei 3DLOOK Problemen → Fallback auf Manual
✅ Multi-Provider: Du könntest sogar mehrere parallel anbieten

## Code-Organisation

app/
├── lib/
│ └── measurement/
│ ├── provider.interface.ts # Interface Definition
│ ├── provider.factory.ts # Factory
│ ├── providers/
│ │ ├── mock.provider.ts ← JETZT
│ │ ├── manual.provider.ts ← JETZT
│ │ └── 3dlook.provider.ts ← SPÄTER
│ └── measurements.types.ts # Shared Types
├── api/
│ └── measurement/
│ ├── session/route.ts # Uses Factory
│ └── [sessionId]/route.ts # Uses Factory
├── (measurement)/
│ └── measurement/
│ ├── mock/[sessionId]/page.tsx # Mock Flow
│ ├── manual/page.tsx # Manual Flow
│ └── 3dlook/[sessionId]/page.tsx # 3DLOOK Flow (später)
└── components/
└── measurement/
├── MeasurementButton.tsx # Provider-agnostic
└── QRCodeModal.tsx # Provider-agnostic
