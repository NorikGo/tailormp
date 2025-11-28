# TAILORMARKET - TECHNISCHE SPEZIFIKATION

Version 1.0 | Stand: November 2025

---

## 1. SYSTEMÜBERBLICK

### 1.1 Konzept & Vision

**TailorMarket** ist eine Zwei-Seiten-Marketplace-Plattform, die qualifizierte Schneider aus Lohnschwachländern (primär Vietnam, Thailand, Indien, Pakistan) mit Kunden in westlichen Märkten (Deutschland, EU, USA) verbindet.

**Kernversprechen:**

- **Schneider:** Zugang zu globalem Markt mit fairen Preisen
- **Kunden:** Maßgeschneiderte Kleidung zu 40-60% günstigeren Preisen bei gleicher Qualität

### 1.2 Kernfunktionalität

- Marketplace für maßgeschneiderte Kleidung (Fokus: Anzüge)
- Integriertes Measurement-Tool für Körpermaße
- Schneider-Profile mit Portfolio und Bewertungen
- Bestellsystem mit Status-Tracking
- Review & Rating System
- Zweisprachig (Deutsch, Englisch)

---

## 2. TECHNOLOGIE-STACK

### 2.1 Frontend

- **Next.js 16.0.3** (App Router, React 19.2.0)
- **TypeScript 5.9.3** (Strict Mode aktiviert)
- **Tailwind CSS 4.1.17**
- **shadcn/ui** (Slate Theme)
  - Components: Button, Input, Card, Form, Badge, Dialog, Select, Textarea, Label, Checkbox, RadioGroup, Tabs, Avatar, DropdownMenu, Toast

### 2.2 Backend & Datenbank

- **Supabase** (PostgreSQL 15)
  - Authentication (Email/Password)
  - PostgreSQL Datenbank
  - Storage (Produkt-Bilder, Portfolio)
  - Row Level Security aktiviert
- **Prisma 6.19.0** (ORM, Type-Safe Client)
- **Next.js API Routes** (RESTful Endpoints)

### 2.3 Drittanbieter-Services

- **Stripe** (Payment Processing)
- **SendGrid** (Transactional Emails)
- **Plausible Analytics** (Privacy-friendly Analytics)
- **Sentry** (Error Tracking & Monitoring)
- **Vercel** (Hosting & Deployment)

### 2.4 Development Tools

- **Git** (GitHub: https://github.com/NorikGo/tailormp)
- **VS Code** (ESLint, Prettier, Tailwind IntelliSense, Prisma)
- **Claude Code** (AI-gestützte Entwicklung)
- **Playwright** (E2E Testing)
- **Jest** (Unit Testing)

---

## 3. DATENBANK-ARCHITEKTUR

### 3.1 Datenbankschema

#### User

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      String   // "customer" | "tailor"
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  orders    Order[]
  tailor    Tailor?
}
```

#### Tailor

```prisma
model Tailor {
  id               String    @id @default(cuid())
  userId           String    @unique @map("user_id")
  name             String
  bio              String?
  country          String
  languages        String[]  @default([])
  rating           Float?    @default(0)
  totalOrders      Int       @default(0)
  yearsExperience  Int
  specialties      String[]  @default([])
  isVerified       Boolean   @default(false)
  createdAt        DateTime  @default(now())
  user             User      @relation(fields: [userId], references: [id])
  products         Product[]
}
```

#### Product

```prisma
model Product {
  id                   String         @id @default(cuid())
  tailorId             String
  title                String
  description          String
  price                Float
  currency             String         @default("EUR")
  category             String         // "suit" | "shirt" | "pants" | "dress" | "traditional"
  fabric               String
  customizationOptions Json           @default("{}")
  productionTime       Int            // Tage
  isActive             Boolean        @default(true)
  createdAt            DateTime       @default(now())
  updatedAt            DateTime       @updatedAt
  tailor               Tailor         @relation(fields: [tailorId], references: [id])
  images               ProductImage[]
  orderItems           OrderItem[]
}
```

#### ProductImage

```prisma
model ProductImage {
  id        String  @id @default(cuid())
  productId String
  url       String
  position  Int     @default(0)
  alt       String  @default("")
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}
```

#### Order

```prisma
model Order {
  id              String      @id @default(cuid())
  userId          String
  status          String      @default("pending")
  // "pending" | "confirmed" | "measuring" | "production" | "shipping" | "completed" | "cancelled"
  totalAmount     Float
  currency        String      @default("EUR")
  shippingAddress Json
  measurements    Json
  notes           String?
  trackingNumber  String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  completedAt     DateTime?
  user            User        @relation(fields: [userId], references: [id])
  items           OrderItem[]
}
```

#### OrderItem

```prisma
model OrderItem {
  id              String   @id @default(cuid())
  orderId         String
  productId       String
  tailorId        String
  quantity        Int      @default(1)
  unitPrice       Float
  customizations  Json     @default("{}")
  measurements    Json
  order           Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product         Product  @relation(fields: [productId], references: [id])
}
```

#### Review

```prisma
model Review {
  id         String   @id @default(cuid())
  orderId    String   @unique
  tailorId   String
  userId     String
  rating     Int      // 1-5
  comment    String
  images     String[] @default([])
  isVerified Boolean  @default(true)
  createdAt  DateTime @default(now())
}
```

### 3.2 Row Level Security Policies

**User:**

- SELECT: `auth.uid()::text = id`
- INSERT: `auth.uid()::text = id` (authenticated)
- UPDATE: `auth.uid()::text = id` (authenticated)

**Tailor:**

- SELECT: `true` (public, anon + authenticated)
- INSERT: `auth.uid()::text = user_id` (authenticated)
- UPDATE: `auth.uid()::text = user_id` (authenticated)
- DELETE: `auth.uid()::text = user_id` (authenticated)

**Product:**

- SELECT: `true` (public)
- INSERT: `EXISTS (SELECT 1 FROM "Tailor" WHERE "Tailor".id = "Product"."tailorId" AND "Tailor".user_id = auth.uid()::text)` (authenticated)
- UPDATE: Wie INSERT
- DELETE: Wie INSERT

**ProductImage:**

- SELECT: `true` (public)
- INSERT/UPDATE/DELETE: Wie Product (via JOIN)

**Order:**

- SELECT: `auth.uid()::text = "userId"` (authenticated)
- INSERT: `auth.uid()::text = "userId"` (authenticated)
- UPDATE: `auth.uid()::text = "userId"` (authenticated)

**OrderItem:**

- SELECT: `EXISTS (SELECT 1 FROM "Order" WHERE "Order".id = "OrderItem"."orderId" AND "Order"."userId" = auth.uid()::text)` (authenticated)
- INSERT/UPDATE/DELETE: Wie SELECT

**Review:**

- SELECT: `true` (public)
- INSERT: `auth.uid()::text = "userId" AND EXISTS (SELECT 1 FROM "Order" WHERE "Order".id = "Review"."orderId" AND "Order".status = 'completed')` (authenticated)
- UPDATE: `auth.uid()::text = "userId"` (authenticated)
- DELETE: `auth.uid()::text = "userId"` (authenticated)

---

## 4. ANWENDUNGSARCHITEKTUR

### 4.1 Ordnerstruktur

```
my-marketplace/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── layout.tsx
│   │
│   ├── (marketplace)/
│   │   ├── page.tsx
│   │   ├── tailors/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── about/page.tsx
│   │   ├── how-it-works/page.tsx
│   │   └── layout.tsx
│   │
│   ├── (customer-dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── measurements/page.tsx
│   │   ├── profile/page.tsx
│   │   └── layout.tsx
│   │
│   ├── (tailor-dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── profile/page.tsx
│   │   └── layout.tsx
│   │
│   ├── checkout/
│   │   ├── page.tsx
│   │   └── success/page.tsx
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── reset-password/route.ts
│   │   ├── tailors/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── products/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── orders/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── reviews/route.ts
│   │   ├── upload/route.ts
│   │   ├── measurements/route.ts
│   │   └── webhooks/
│   │       └── stripe/route.ts
│   │
│   ├── components/
│   │   ├── ui/ (shadcn/ui components)
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── marketplace/
│   │   │   ├── TailorCard.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── TailorGrid.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── FilterPanel.tsx
│   │   ├── order/
│   │   │   ├── OrderCard.tsx
│   │   │   ├── OrderTimeline.tsx
│   │   │   └── OrderDetails.tsx
│   │   ├── measurement/
│   │   │   ├── MeasurementTool.tsx
│   │   │   ├── MeasurementGuide.tsx
│   │   │   ├── MeasurementInput.tsx
│   │   │   └── MeasurementPreview.tsx
│   │   ├── forms/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── OrderForm.tsx
│   │   │   └── ReviewForm.tsx
│   │   └── shared/
│   │       ├── ImageUpload.tsx
│   │       ├── RatingStars.tsx
│   │       ├── StatusBadge.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorMessage.tsx
│   │
│   ├── lib/
│   │   ├── supabaseClient.ts
│   │   ├── prisma.ts
│   │   ├── stripe.ts
│   │   ├── utils.ts
│   │   ├── validations.ts
│   │   ├── constants.ts
│   │   ├── formatters.ts
│   │   └── email.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTailor.ts
│   │   ├── useProducts.ts
│   │   ├── useOrders.ts
│   │   └── useToast.ts
│   │
│   ├── types/
│   │   ├── database.ts
│   │   ├── api.ts
│   │   └── components.ts
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── error.tsx
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── public/
│   ├── images/
│   ├── icons/
│   └── illustrations/
│
├── specs.md
├── .env.local
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 5. FUNKTIONALE ANFORDERUNGEN

### 5.1 Authentication & User Management

#### Registrierung

**Customer:**

- Email + Passwort (min. 8 Zeichen)
- Email-Verifizierung (Link per Email)
- Automatische Erstellung User-Profil mit role="customer"

**Tailor:**

- Wie Customer + zusätzlich:
- Formular: Name, Land, Sprachen, Erfahrung (Jahre), Spezialisierungen, Bio
- Portfolio-Upload (min. 3 Bilder)
- isVerified = false (manuell vom Admin freigegeben)

#### Login

- Email + Passwort
- "Remember Me" Checkbox (7 Tage Session, sonst 24h)
- Redirect zu vorheriger Seite oder Dashboard

#### Passwort vergessen

- Email-Eingabe
- Reset-Link per Email (gültig 1h)
- Neues Passwort setzen

#### Session Management

- JWT Tokens via Supabase Auth
- httpOnly Cookies
- Automatischer Refresh

### 5.2 Marketplace

#### Homepage

**Sections:**

1. Hero: Headline "Maßgeschneiderte Anzüge. Weltweit." + Subtext + CTA "Schneider entdecken"
2. Wie es funktioniert (3 Schritte: Schneider wählen → Maße angeben → Bestellen)
3. Top Schneider (Grid, 8 Cards, sortiert nach Rating)
4. Beliebte Produkte (Grid, 8 Cards, sortiert nach Bestellungen)
5. Testimonials (3 Reviews)
6. Newsletter-Anmeldung

#### Schneider-Übersicht

**Filter:**

- Land (Dropdown)
- Rating (5★, 4★+, 3★+)
- Spezialisierung (Checkboxen)
- Preisspanne (Slider: €0-€500)

**Sortierung:**

- Rating (hoch → niedrig)
- Anzahl Bestellungen (hoch → niedrig)
- Preis (niedrig → hoch)

**Layout:** Grid (Desktop: 3 Spalten, Tablet: 2, Mobile: 1)
**Pagination:** 24 pro Seite

#### Schneider-Profil

**Header:**

- Avatar (rund, 120px)
- Name
- Land + Flagge
- Rating (Stars + Anzahl)
- "Verifiziert" Badge (wenn isVerified)

**Tabs:**

1. **Über mich:** Bio-Text, Spezialisierungen (Badges), Sprachen, Erfahrung
2. **Portfolio:** Bild-Galerie (Lightbox)
3. **Produkte:** Produkt-Grid (nur aktive)
4. **Bewertungen:** Review-Liste (paginiert, 10 pro Seite)

**Sticky Sidebar:**

- Quick Stats (Anzahl Produkte, Durchschnittspreis, Produktionszeit)
- CTA "Produkte ansehen"

#### Produkt-Übersicht

**Filter:**

- Kategorie (Radio: Anzug, Hemd, Hose, Kleid, Traditionell)
- Stoff (Checkboxen: Wolle, Baumwolle, Leinen, Seide)
- Preis (Slider)
- Produktionszeit (Slider: 0-60 Tage)

**Sortierung:**

- Preis (niedrig → hoch, hoch → niedrig)
- Produktionszeit (schnell → langsam)
- Neueste

**Layout:** Grid (3/2/1)
**Pagination:** 24 pro Seite

#### Produkt-Detailseite

**Layout:**

Links: Bild-Galerie (Hauptbild + Thumbnails)

- Zoom on hover
- Lightbox bei Klick

Rechts:

- Titel (h1)
- Tailor (Link + Avatar, klein)
- Rating (Stars + Anzahl Reviews)
- Preis (groß, prominent)
- Produktionszeit (Badge)
- Stoff (Text)
- Kategorie (Badge)
- Beschreibung (Markdown)
- Anpassungsoptionen:
  - JSON-basiert, dynamisch gerendert
  - Beispiel: Knöpfe (Dropdown), Taschen (Checkboxen), Futter (Radio)
- CTAs:
  - "Jetzt bestellen" (Primary Button)
  - "Schneider kontaktieren" (Secondary, später)

Unten: Tabs

1. **Maße:** Welche Maße benötigt
2. **Bewertungen:** Review-Liste für dieses Produkt

### 5.3 Measurement Tool

**Implementierung:** Eigenes Tool (UI)

**Flow:**

1. **Intro:** Erklärung warum Maße wichtig sind
2. **Guide:** Schritt-für-Schritt mit Illustrationen
3. **Input:** Pro Maß:
   - Name (z.B. "Schulterbreite")
   - Illustration (Bild zeigt wo gemessen wird)
   - Input (Number, cm)
   - Tooltip "Wie messe ich?"
4. **Validation:** Realistische Werte (z.B. Schulterbreite: 35-60cm)
5. **Preview:** Zusammenfassung aller Maße
6. **Speichern:** Als "Measurement Set" (Name, z.B. "Meine Maße 2024")

**Maße (Anzug):**

- Schulterbreite
- Brustumfang
- Taillenumfang
- Hüftumfang
- Ärmellänge
- Rückenlänge
- Sakkolänge

**Maße (Hose):**

- Bundweite
- Hüftumfang
- Oberschenkelumfang
- Beinlänge (außen)
- Schrittlänge

**Persistenz:**

- Speichern in User-Profil (JSON)
- Wiederverwendbar bei neuen Bestellungen
- Editierbar
- Mehrere Sets möglich (z.B. "Sommer", "Winter")

### 5.4 Checkout & Bestellung

**Flow:**

#### Schritt 1: Maße

- Auswahl: Gespeicherte Maße (Dropdown) ODER "Neue Maße eingeben" → Measurement Tool
- Preview der gewählten Maße

#### Schritt 2: Anpassungen

- Dynamisches Formular basierend auf Product.customizationOptions (JSON)
- Beispiel:
  ```json
  {
    "buttons": ["2-Knopf", "3-Knopf"],
    "pockets": ["Mit Brusttasche", "Ohne Brusttasche"],
    "lining": ["Standard", "Premium Seide"]
  }
  ```
- Visual Feedback (wenn möglich: Bilder)

#### Schritt 3: Lieferadresse

- Formular:
  - Vorname, Nachname
  - Straße, Hausnummer
  - PLZ, Stadt
  - Land (Dropdown)
  - Telefon (optional)
- Checkbox "Als Standardadresse speichern"

#### Schritt 4: Spezialwünsche

- Textarea (optional, max. 500 Zeichen)
- Info: "Besondere Wünsche? Der Schneider wird sich bemühen!"

#### Schritt 5: Bezahlung

- Stripe Checkout Integration
- Unterstützte Methoden:
  - Kreditkarte (Visa, Mastercard, Amex)
  - SEPA Lastschrift
  - Sofortüberweisung
  - iDEAL (NL)
- 3D Secure aktiviert

#### Schritt 6: Bestätigung

- Übersicht aller Daten
- Gesamtpreis:
  - Produktpreis
  - - Anpassungen (falls Aufpreis)
  - - Versand (später)
  - = Gesamt
- Checkbox "AGB akzeptieren"
- Button "Jetzt kostenpflichtig bestellen"

**Nach Bestellung:**

- Stripe Payment Intent
- Bei erfolgreicher Zahlung:
  - Order-Eintrag in DB (status="confirmed")
  - Email an Kunden (Bestellbestätigung)
  - Email an Schneider (Neue Bestellung)
  - Redirect zu `/orders/[id]`

### 5.5 Order Management

#### Status-Flow

```
confirmed → measuring → production → shipping → completed
          ↘ cancelled
```

**Status-Bedeutung:**

- **confirmed:** Zahlung eingegangen, Schneider informiert
- **measuring:** Schneider prüft Maße, ggf. Rückfragen
- **production:** Anzug wird produziert
- **shipping:** Versandt, Tracking-Nummer vorhanden
- **completed:** Zugestellt, Kunde bestätigt
- **cancelled:** Storniert (nur von Kunde möglich wenn confirmed)

#### Order-Detailseite (Kunde)

**Anzeige:**

- Order-Nummer, Datum
- Timeline (visuell, mit Status-Icons)
- Produkt (Bild, Titel, Tailor)
- Maße (Tabelle)
- Anpassungen (Liste)
- Lieferadresse
- Spezialwünsche
- Gesamtpreis
- Tracking-Nummer (wenn shipping)
- CTA "Stornieren" (nur wenn confirmed)
- CTA "Bewertung schreiben" (nur wenn completed, noch nicht reviewed)

**Email-Benachrichtigungen:**

- Bei jedem Status-Wechsel
- Template: Status + Timeline + Link zur Order

#### Order-Detailseite (Schneider)

**Anzeige:**

- Order-Nummer, Datum
- Kunde (Name, Email, Adresse, Telefon)
- Produkt
- Maße (Tabelle, downloadbar als PDF)
- Anpassungen
- Spezialwünsche
- Buttons:
  - "Maße bestätigen" (measuring → production)
  - "In Produktion" (confirmed → production)
  - "Versandt" (production → shipping) → Input: Tracking-Nummer
  - "Problem melden" (öffnet Support-Form, später)
- Notizen (Textarea, nur Schneider sieht das)

### 5.6 Reviews & Ratings

**Voraussetzung:** Order.status = "completed"

**Review erstellen:**

- Rating: 1-5 Stars (required)
- Kommentar: Textarea (required, min. 20 Zeichen)
- Bilder: Upload (optional, max. 3)

**Validierung:**

- Nur 1 Review pro Order
- isVerified = true (da Order nachweisbar abgeschlossen)

**Review-Anzeige:**

- Auf Tailor-Profil: Alle Reviews, sortiert nach Datum (neueste zuerst)
- Auf Produkt-Seite: Reviews nur für dieses Produkt
- Layout: Card mit Avatar, Name (Kunde), Rating, Datum, Kommentar, Bilder (Galerie)

**Rating-Berechnung:**

- Tailor.rating = Durchschnitt aller Reviews
- Update bei neuem Review (trigger oder cron)

### 5.7 Dashboards

#### Customer Dashboard

**Übersicht:**

- Stats:
  - Anzahl Bestellungen (gesamt)
  - Aktive Bestellungen
  - Abgeschlossene Bestellungen
- Aktive Bestellungen (Liste, max. 5, Link zu "Alle anzeigen")
- Quick-Links:
  - "Schneider durchsuchen"
  - "Meine Maße verwalten"

**Meine Bestellungen:**

- Liste aller Orders
- Filter: Status (Dropdown)
- Sortierung: Datum (neueste zuerst)
- OrderCard (kompakt): Datum, Produkt, Tailor, Status, Preis, Button "Details"

**Gespeicherte Maße:**

- Liste aller Measurement Sets
- Card pro Set: Name, Datum, Button "Bearbeiten", Button "Löschen"
- Button "Neue Maße eingeben"

**Mein Profil:**

- Email ändern (mit Bestätigung)
- Passwort ändern
- Standardadresse speichern
- Account löschen (mit Warnung)

#### Tailor Dashboard

**Übersicht:**

- KPIs (Cards):
  - Offene Bestellungen
  - Abgeschlossene Bestellungen (gesamt)
  - Durchschnittliche Bewertung (Stars)
  - Umsatz (gesamt, in EUR)
- Offene Bestellungen (Liste, max. 5)
- Neueste Bewertungen (max. 3)

**Meine Produkte:**

- Liste aller Produkte
- Filter: Aktiv/Inaktiv
- ProductCard: Bild, Titel, Preis, Status (Badge), Buttons (Bearbeiten, Löschen, Aktivieren/Deaktivieren)
- Button "Neues Produkt erstellen"

**Produkt erstellen/bearbeiten:**

- Formular (mit Validierung):
  - Titel (required, max. 100 Zeichen)
  - Beschreibung (required, Markdown Editor, max. 2000 Zeichen)
  - Kategorie (required, Select)
  - Preis (required, Number, min. 10)
  - Stoff (required, Text)
  - Produktionszeit (required, Number, Tage)
  - Anpassungsoptionen (JSON Editor mit UI-Builder)
  - Bilder (Upload, min. 1, max. 5, je max. 5MB)
- Preview-Button
- Speichern-Button

**Bestellungen:**

- Liste aller Orders für meine Produkte
- Filter: Status
- Sortierung: Datum
- OrderCard: Order-Nummer, Datum, Kunde, Produkt, Status, Betrag, Button "Details"

**Mein Profil:**

- Tailor-Profil bearbeiten (Name, Bio, Spezialisierungen, Sprachen, Erfahrung)
- Portfolio verwalten (Bilder upload/delete)
- User-Profil (Email, Passwort)

---

## 6. UI/UX DESIGN

### 6.1 Design-System

**Farben (Tailwind + Slate Theme):**

- Primary: Slate-700 (Buttons, Links, Header)
- Secondary: Slate-500
- Accent: Blue-600 (CTAs)
- Success: Green-600
- Warning: Orange-500
- Error: Red-600
- Background: White
- Text: Slate-900

**Typography:**

- Font: System Font Stack (Inter ähnlich)
- Headings: Font-weight 700, Line-height 1.2
- Body: Font-weight 400, Line-height 1.6
- Sizes:
  - h1: text-4xl (36px)
  - h2: text-3xl (30px)
  - h3: text-2xl (24px)
  - h4: text-xl (20px)
  - body: text-base (16px)
  - small: text-sm (14px)

**Spacing:**

- Container Max-Width: 1280px
- Section Padding: py-16 (Desktop), py-10 (Mobile)
- Card Padding: p-6
- Gap zwischen Cards: gap-6

**Shadows:**

- Card: shadow-md
- Card Hover: shadow-lg
- Dropdown: shadow-xl

**Border Radius:**

- Standard: rounded-lg (8px)
- Buttons: rounded-md (6px)
- Images: rounded-lg

**Transitions:**

- Standard: transition-all duration-200
- Hover: scale-[1.02]

### 6.2 Components

#### shadcn/ui Components verwendet:

- Button (default, secondary, outline, ghost, destructive)
- Card, CardHeader, CardTitle, CardContent, CardFooter
- Input, Textarea, Select, Checkbox, RadioGroup
- Form, FormField, FormItem, FormLabel, FormControl, FormMessage
- Badge (default, secondary, success, warning, destructive)
- Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle
- DropdownMenu
- Tabs, TabsList, TabsTrigger, TabsContent
- Avatar, AvatarImage, AvatarFallback
- Toast, useToast
- Label

#### Custom Components:

**TailorCard:**

```tsx
<Card>
  <Avatar src={tailor.avatar} />
  <CardContent>
    <h3>{tailor.name}</h3>
    <div>
      {tailor.country} <FlagIcon />
    </div>
    <RatingStars rating={tailor.rating} count={tailor.totalOrders} />
    <div>
      {tailor.specialties.map((s) => (
        <Badge>{s}</Badge>
      ))}
    </div>
    <p>{truncate(tailor.bio, 100)}</p>
  </CardContent>
  <CardFooter>
    <Button>Profil ansehen</Button>
  </CardFooter>
</Card>
```

**ProductCard:**

```tsx
<Card>
  <div className="aspect-square">
    <Image src={product.images[0]} />
  </div>
  <CardContent>
    <h3>{product.title}</h3>
    <Link to={`/tailors/${product.tailorId}`}>
      <small>{product.tailor.name}</small>
    </Link>
    <div className="flex items-center justify-between">
      <span className="text-2xl font-bold">€{product.price}</span>
      <Badge>{product.productionTime} Tage</Badge>
    </div>
  </CardContent>
  <CardFooter>
    <Button>Details ansehen</Button>
  </CardFooter>
</Card>
```

**OrderTimeline:**

```tsx
<div className="flex items-start">
  {statuses.map((status, i) => (
    <>
      <div
        className={`flex flex-col items-center ${
          status.active ? "text-blue-600" : "text-gray-400"
        }`}
      >
        <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center">
          {status.icon}
        </div>
        <span className="text-sm mt-2">{status.label}</span>
      </div>
      {i < statuses.length - 1 && (
        <div className="flex-1 h-0.5 bg-gray-300 mt-5" />
      )}
    </>
  ))}
</div>
```

### 6.3 Layouts

**Header (Desktop):**

```
┌──────────────────────────────────────────────────────────────┐
│ LOGO     Home  Schneider  Produkte  Über uns      [User-Menu]│
│                                                     [Dashboard]│
└──────────────────────────────────────────────────────────────┘
```

**Header (Mobile):**

```
┌──────────────────────────────────┐
│ ☰  LOGO              [User-Menu] │
└──────────────────────────────────┘
```

**Footer:**

```
┌──────────────────────────────────────────────────────────────┐
│  LOGO                                                         │
│                                                               │
│  Über uns    AGB    Datenschutz    Impressum    Kontakt      │
│                                                               │
│  © 2025 TailorMarket. Alle Rechte vorbehalten.               │
└──────────────────────────────────────────────────────────────┘
```

**Dashboard (Sidebar):**

```
┌────────┬──────────────────────────────────────────────────┐
│        │ HEADER (Breadcrumbs, User)                       │
│ SIDE   ├──────────────────────────────────────────────────┤
│ BAR    │                                                  │
│        │                                                  │
│ - Home │         MAIN CONTENT AREA                        │
│ - Menu │                                                  │
│ - Item │                                                  │
│        │                                                  │
└────────┴──────────────────────────────────────────────────┘
```

### 6.4 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## 7. API-SPEZIFIKATION

### 7.1 Authentifizierung

**POST /api/auth/register**

```json
Request:
{
  "email": "user@example.com",
  "password": "password123",
  "role": "customer"
}

Response (200):
{
  "user": { "id": "...", "email": "...", "role": "..." },
  "message": "Bitte bestätige deine Email"
}

Errors:
400: Email bereits registriert
422: Validierungsfehler
```

**POST /api/auth/login**

```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "user": { "id": "...", "email": "...", "role": "..." },
  "token": "jwt..."
}

Errors:
401: Falsche Credentials
403: Email nicht verifiziert
```

**POST /api/auth/logout**

```json
Response (200):
{ "message": "Logout erfolgreich" }
```

### 7.2 Tailors

**GET /api/tailors**

```
Query Params:
- country (optional)
- rating (optional, min: 1-5)
- specialties (optional, comma-separated)
- minPrice, maxPrice (optional)
- sort (rating|orders|price)
- page (default: 1)
- limit (default: 24)

Response (200):
{
  "tailors": [...],
  "total": 100,
  "page": 1,
  "pages": 5
}
```

**GET /api/tailors/[id]**

```
Response (200):
{
  "tailor": { ... },
  "products": [...],
  "reviews": [...]
}

Errors:
404: Tailor nicht gefunden
```

**POST /api/tailors** (authenticated, tailor role)

```json
Request:
{
  "name": "...",
  "country": "...",
  "bio": "...",
  ...
}

Response (201):
{ "tailor": { ... } }
```

**PUT /api/tailors/[id]** (authenticated, owner only)

```json
Request: Partial<Tailor>
Response (200): { "tailor": { ... } }
```

### 7.3 Products

**GET /api/products**

```
Query Params: category, fabric, minPrice, maxPrice, sort, page, limit

Response (200):
{
  "products": [...],
  "total": 200,
  "page": 1,
  "pages": 9
}
```

**GET /api/products/[id]**

```
Response (200):
{
  "product": { ... },
  "tailor": { ... },
  "reviews": [...]
}
```

**POST /api/products** (authenticated, tailor role)

```json
Request:
{
  "title": "...",
  "description": "...",
  "price": 299.99,
  ...
}

Response (201):
{ "product": { ... } }
```

**PUT /api/products/[id]** (authenticated, owner only)

```json
Request: Partial<Product>
Response (200): { "product": { ... } }
```

**DELETE /api/products/[id]** (authenticated, owner only)

```
Response (204): No Content
```

### 7.4 Orders

**GET /api/orders** (authenticated)

```
Response (200):
{
  "orders": [...]
}
```

**GET /api/orders/[id]** (authenticated, owner or tailor)

```
Response (200):
{
  "order": { ... },
  "items": [...]
}
```

**POST /api/orders** (authenticated)

```json
Request:
{
  "productId": "...",
  "measurements": { ... },
  "customizations": { ... },
  "shippingAddress": { ... },
  "notes": "..."
}

Response (201):
{
  "order": { ... },
  "paymentIntent": { ... } // Stripe
}
```

**PUT /api/orders/[id]** (authenticated, owner or tailor)

```json
Request:
{
  "status": "production", // tailor only
  "trackingNumber": "..." // tailor only
}

Response (200):
{ "order": { ... } }
```

### 7.5 Reviews

**POST /api/reviews** (authenticated, customer, order completed)

```json
Request:
{
  "orderId": "...",
  "rating": 5,
  "comment": "...",
  "images": [...]
}

Response (201):
{ "review": { ... } }
```

### 7.6 Upload

**POST /api/upload** (authenticated)

```
Content-Type: multipart/form-data
Body: file (max 5MB, types: image/jpeg, image/png, image/webp)

Response (200):
{
  "url": "https://supabase.co/storage/..."
}

Errors:
400: Ungültiger Dateityp
413: Datei zu groß
```

---

## 8. SICHERHEIT

### 8.1 Authentication & Authorization

- Passwords: bcrypt (via Supabase)
- Sessions: JWT (httpOnly Cookies, Secure, SameSite=Lax)
- Token Expiry: 7 Tage
- Row Level Security: Alle Tabellen
- Middleware: Protected Routes checken auth.uid()

### 8.2 Input Validation

- Frontend: Zod Schemas
- Backend: Duplicate Validation in API Routes
- SQL Injection: Prisma (Prepared Statements)
- XSS: React (Auto-Escaping), Content Security Policy

### 8.3 File Uploads

- Allowed Types: image/jpeg, image/png, image/webp
- Max Size: 5MB
- Storage: Supabase Storage (public bucket für Product Images)
- Filenames: UUID + Extension
- Validation: File Magic Number Check

### 8.4 Rate Limiting

- Login: 5 Versuche pro 15min
- Register: 3 Versuche pro 1h
- API Calls: 100 pro Minute (logged-in), 10 pro Minute (anon)

### 8.5 DSGVO

- Cookie Consent Banner (Plausible Analytics)
- Datenschutzerklärung + Impressum
- Recht auf Datenlöschung (Account löschen → alle Orders, Reviews bleiben anonym)
- SSL/TLS (via Vercel)

---

## 9. PERFORMANCE

### 9.1 Frontend Optimization

- Images: next/image (Lazy Loading, WebP, Responsive)
- Code Splitting: Dynamic Imports für große Components
- Prefetching: <Link prefetch> für wichtige Seiten
- Bundle Size: < 200KB (first load JS)

### 9.2 Backend Optimization

- Database Indexing:
  - User: email
  - Tailor: userId, rating
  - Product: tailorId, isActive, category
  - Order: userId, status
- Query Optimization: Prisma include (vermeidet N+1)
- Caching: Keine (vorerst), später Redis

### 9.3 Performance Ziele

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Lighthouse Score: > 90

---

## 10. TESTING

### 10.1 Unit Tests (Jest)

**Zu testen:**

- Utility Functions (formatters, validators)
- Custom Hooks (useAuth, useTailor)
- Pure Components

**Coverage Ziel:** > 80%

### 10.2 Integration Tests

- API Routes (mit Mocking)
- Prisma Queries
- Supabase Auth Flow

### 10.3 E2E Tests (Playwright)

**Critical Paths:**

1. Registration → Login → Logout
2. Browse Tailors → View Profile → View Product → Order → Checkout
3. Tailor: Create Product → View Orders → Update Status

**Tests:**

- Authentifizierung
- Produkt-Erstellung
- Bestellprozess

---

## 11. DEPLOYMENT

### 11.1 Plattform

**Vercel** (Empfohlen für Next.js)

- Auto-Deploy bei Git Push (main branch)
- Preview Deployments für PRs
- Environment Variables über Dashboard
- Edge Functions
- Analytics

### 11.2 CI/CD Pipeline (GitHub Actions)

```yaml
name: CI/CD
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - Checkout
      - Install Dependencies
      - Lint (ESLint)
      - Type Check (TypeScript)
      - Unit Tests (Jest)
      - Build
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - Deploy to Vercel
```

### 11.3 Environments

- **Development:** Local (localhost:3000)
- **Staging:** Vercel Preview (PR branches)
- **Production:** Vercel Production (main branch)

### 11.4 Environment Variables

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database
DATABASE_URL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# SendGrid
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=

# Sentry
SENTRY_DSN=
```

---

## 12. MONITORING & ERROR TRACKING

### 12.1 Error Tracking

**Sentry:**

- Frontend Errors (React Error Boundaries)
- Backend Errors (API Routes)
- Performance Monitoring
- Release Tracking

### 12.2 Analytics

**Plausible Analytics:**

- Privacy-friendly (DSGVO-konform)
- Page Views
- Custom Events:
  - "Product Viewed"
  - "Order Created"
  - "Review Submitted"

### 12.3 Uptime Monitoring

**UptimeRobot:**

- HTTP Checks (5min interval)
- Alert bei Downtime (Email)

### 12.4 Logging

- Structured Logging (JSON)
- Log Levels: info, warn, error
- No PII in Logs
- Retention: 30 Tage

---

## 13. INTERNATIONALISIERUNG (I18N)

### 13.1 Sprachen

1. **Deutsch** (primär, DE/AT/CH)
2. **Englisch** (international, GB/US)

### 13.2 Implementation

**next-intl:**

```tsx
import { useTranslations } from "next-intl";

const t = useTranslations("HomePage");
<h1>{t("title")}</h1>;
```

**Translations:**

```
locales/
├── de.json
└── en.json
```

**Locale Detection:**

- Browser (Accept-Language Header)
- User Preference (gespeichert in DB)
- URL Prefix (/de/..., /en/...)

### 13.3 Currency

- Primär: EUR (€)
- Display: Locale-basiert (de-DE: "299,99 €", en-US: "€299.99")
- Conversion: Nicht implementiert (alle Preise in EUR)

---

## 14. ACCESSIBILITY

### 14.1 Standards

- WCAG 2.1 AA Compliance
- Semantic HTML (nav, main, article, aside, footer)
- ARIA Labels (für Icon-Buttons, Screen Reader)
- Keyboard Navigation (Tab, Enter, Escape)
- Focus Indicators (outline)

### 14.2 Component-Spezifisch

- Forms: Label mit htmlFor
- Buttons: type="button" (wenn kein submit)
- Images: alt-Text
- Links: descriptive text (nicht "Hier klicken")
- Modals: Focus Trap, Escape to Close

### 14.3 Testing

- Lighthouse Accessibility Score: > 95
- axe DevTools (Chrome Extension)
- Keyboard Navigation Testing
- Screen Reader Testing (NVDA/JAWS)

---

## 15. ENTWICKLUNGS-ROADMAP

### MVP (Wochen 1-12)

**Woche 1-2: Foundation ✅**

- Setup komplett
- shadcn/ui installiert
- Layout (Header, Footer)
- Homepage (Hero, How It Works)

**Woche 3-4: Auth & User Management**

- Login/Register/Logout
- Email Verification
- Password Reset
- User Profile Page

**Woche 5-6: Marketplace (View)**

- Schneider-Übersicht + Filter
- Schneider-Profil
- Produkt-Übersicht + Filter
- Produkt-Detailseite

**Woche 7-8: Measurement & Checkout**

- Measurement Tool (UI)
- Checkout Flow (6 Schritte)
- Stripe Integration
- Order Creation

**Woche 9-10: Dashboards**

- Customer Dashboard (Orders, Measurements, Profile)
- Tailor Dashboard (Products, Orders, Profile)
- Order Management (Status Updates)

**Woche 11-12: Polish & Launch**

- Review System
- Email Templates (SendGrid)
- Testing (E2E)
- Bug Fixes
- Deployment
- Soft Launch (Invite Only)

### Post-MVP (Wochen 13-24)

**Features:**

- Admin Dashboard
- Advanced Search (Elasticsearch)
- Multi-Image Upload (Drag & Drop)
- Chat zwischen Kunde & Schneider
- Push Notifications
- Mobile App (React Native)
- Shipping Integration (DHL API)
- Subscription Model für Schneider (Premium Features)
- Coupon System
- Referral Program

**Optimizations:**

- Caching (Redis)
- CDN für Images (Cloudflare)
- Database Read Replicas
- Performance Monitoring (Sentry)

---

## 16. ERFOLGS-METRIKEN (KPIs)

### Business Metrics

- **Registrierungen:** Kunden + Schneider (Ziel: 100 in Monat 1)
- **GMV (Gross Merchandise Value):** Gesamtwert Bestellungen (Ziel: €10.000 in Monat 1)
- **Conversion Rate:** Besucher → Käufer (Ziel: 2%)
- **AOV (Average Order Value):** Ziel: €250
- **Customer Retention:** Wiederkaufrate (Ziel: 20% nach 3 Monaten)

### Technical Metrics

- **Page Load Time:** < 2s (FCP)
- **Uptime:** > 99.9%
- **API Response Time:** < 200ms (p95)
- **Error Rate:** < 0.1%
- **Lighthouse Score:** > 90

### User Metrics

- **Active Users:** DAU, MAU
- **Bounce Rate:** < 40%
- **Session Duration:** > 3min
- **CSAT (Customer Satisfaction):** > 4.5/5

---

## 17. RISIKEN & MITIGATIONS

### Technische Risiken

| Risiko                  | Wahrscheinlichkeit | Impact   | Mitigation                               |
| ----------------------- | ------------------ | -------- | ---------------------------------------- |
| Supabase Vendor Lock-in | Mittel             | Hoch     | Prisma abstrahiert DB, Migration möglich |
| Performance bei Scale   | Mittel             | Hoch     | Caching, CDN, DB Optimization            |
| Security Breach         | Niedrig            | Kritisch | Penetration Testing, Security Audits     |
| Payment Failures        | Mittel             | Hoch     | Stripe Robust, Webhook Retry Logic       |

### Business Risiken

| Risiko                      | Wahrscheinlichkeit | Impact   | Mitigation                                             |
| --------------------------- | ------------------ | -------- | ------------------------------------------------------ |
| Niedrige Schneider-Adoption | Hoch               | Kritisch | Marketing, Incentives, Einfacher Onboarding            |
| Niedrige Kunden-Conversion  | Mittel             | Hoch     | Trust Signals (Reviews, Verification), UX Optimization |
| Qualitätsprobleme           | Mittel             | Hoch     | Schneider-Vetting, Review System, Geld-zurück-Garantie |
| Rechtliche Probleme         | Niedrig            | Hoch     | Rechtliche Beratung, AGB, Impressum                    |

---

## 18. ANHANG

### 18.1 Glossar

- **MVP:** Minimum Viable Product
- **RLS:** Row Level Security
- **GMV:** Gross Merchandise Value
- **AOV:** Average Order Value
- **CSAT:** Customer Satisfaction Score
- **FCP:** First Contentful Paint

### 18.2 Links

- Repository: https://github.com/NorikGo/tailormp
- Supabase: https://rylmtkxxbwnbeecprill.supabase.co
- Vercel: (nach Deployment)

### 18.3 Kontakte

- Product Owner: [User]
- Developer: [User + Claude Code]

---

**Ende der Spezifikation**
