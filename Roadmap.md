# 🚀 TAILORMARKET - DEVELOPMENT ROADMAP

**Version:** 1.0  
**Geschätzte Dauer:** 10-12 Wochen  
**Status:** Phase 1 - In Progress

---

## 📍 AKTUELLER STAND

- [x] Setup komplett (Next.js, Supabase, Prisma, shadcn/ui)
- [x] Datenbank Schema definiert
- [x] RLS Policies eingerichtet
- [x] Auth funktioniert (Test)
- [x] Storage konfiguriert
- [ ] **→ NÄCHSTER SCHRITT: Phase 1.1 - Header Component**

---

## PHASE 1: FOUNDATION & LAYOUT (Woche 1-2)

### ✅ 1.1 Header Component

**Status:** [ ] Todo  
**Dauer:** 2-3h  
**Dateien:** `app/components/layout/Header.tsx`, `app/components/layout/MobileNav.tsx`

**Aufgabe:**
Erstelle einen professionellen, responsive Header mit Navigation.

**Prompt für Claude Code:**

```
Erstelle einen professionellen Header-Component für TailorMarket.

Design: Modern, schlicht, minimalistisch mit viel Weißraum

Desktop Layout:
- Logo links: "TailorMarket" (text-2xl, font-bold, text-slate-900)
- Navigation mitte: Home, Schneider, Produkte, Über uns (Links mit hover:text-slate-600)
- Rechts: Login Button (outline) + Register Button (default)

Mobile Layout:
- Logo links
- Hamburger-Icon rechts (lucide-react Menu Icon)
- Mobile-Menü: Full-screen Overlay mit allen Links vertikal
- Close-Button (X Icon)

Tech:
- shadcn/ui Button
- Next.js Link
- TypeScript
- Sticky Header (sticky top-0 z-50 bg-white border-b)
- Responsive (lg: Breakpoint für Desktop)

Datei: app/components/layout/Header.tsx
```

**Test Checklist:**

- [ ] Header ist sichtbar auf allen Seiten
- [ ] Links funktionieren
- [ ] Mobile-Menü öffnet/schließt sich
- [ ] Sticky behavior beim Scrollen

---

### ✅ 1.2 Footer Component

**Status:** [ ] Todo  
**Dauer:** 1-2h  
**Dateien:** `app/components/layout/Footer.tsx`

**Prompt:**

```
Erstelle einen Footer-Component für TailorMarket.

Design: Clean, minimalistisch, 3-Spalten Layout (Desktop), gestapelt (Mobile)

Inhalt:
Spalte 1 - Über TailorMarket:
- Logo "TailorMarket"
- Kurzer Text: "Verbindet talentierte Schneider weltweit mit Kunden, die maßgeschneiderte Qualität schätzen."

Spalte 2 - Links:
- Über uns, Wie es funktioniert, AGB, Datenschutz, Impressum

Spalte 3 - Kontakt:
- Email: info@tailormarket.com

Unten:
- Copyright: "© 2025 TailorMarket. Alle Rechte vorbehalten."

Tech:
- TypeScript, Next.js Link
- Tailwind: bg-slate-50, border-t, py-12
- Responsive Grid (grid-cols-1 md:grid-cols-3)

Datei: app/components/layout/Footer.tsx
```

**Test:**

- [ ] Footer am Ende jeder Seite
- [ ] Responsive Layout

---

### ✅ 1.3 Root Layout Integration

**Status:** [ ] Todo  
**Dauer:** 1h  
**Dateien:** `app/layout.tsx` (anpassen)

**Prompt:**

```
Integriere Header und Footer in das Root Layout.

Layout-Struktur:
<body>
  <Header />
  <main className="min-h-screen">
    {children}
  </main>
  <Footer />
</body>

Datei: app/layout.tsx (editieren)
```

**Test:**

- [ ] Header oben, Footer unten auf jeder Seite
- [ ] Content hat min. Höhe eines Viewports

---

### ✅ 1.4 Homepage - Hero Section

**Status:** [ ] Todo  
**Dauer:** 2-3h  
**Dateien:** `app/(marketplace)/page.tsx` (ersetzen)

**Prompt:**

```
Erstelle die Hero Section für die TailorMarket Homepage.

Design:
- Volle Breite, zentrierter Content
- Headline: "Maßgeschneiderte Anzüge. Weltweit."
- Subtext: "Entdecke talentierte Schneider aus aller Welt und lass dir deinen Traumanzug maßschneidern. Fair für Handwerker, erschwinglich für dich."
- CTA Button: "Schneider entdecken" (Primary, groß)

Layout:
- Zentriert, max-w-4xl, py-20 md:py-32
- Text zentriert (text-center)
- Headline: text-5xl md:text-6xl, font-bold
- Subtext: text-xl, text-slate-600
- Button: size="lg", Link zu /tailors

Datei: app/(marketplace)/page.tsx
```

**Test:**

- [ ] Hero Section sichtbar
- [ ] CTA Button funktioniert

---

### ✅ 1.5 Homepage - "Wie es funktioniert"

**Status:** [ ] Todo  
**Dauer:** 2h  
**Dateien:** `app/(marketplace)/page.tsx` (erweitern)

**Prompt:**

```
Erstelle "Wie es funktioniert" Section unterhalb der Hero.

Design:
- Überschrift: "So funktioniert's" (h2, text-center)
- 3 Cards (Desktop nebeneinander, Mobile gestapelt)

Schritte:
1. Icon: Search, Titel: "Schneider finden", Text: "Durchsuche hunderte verifizierte Schneider..."
2. Icon: Ruler, Titel: "Maße angeben", Text: "Nutze unser Measurement-Tool..."
3. Icon: ShoppingBag, Titel: "Bestellen & genießen", Text: "Erhalte deine maßgeschneiderte Kleidung..."

Layout:
- Container py-16
- Grid (grid-cols-1 md:grid-cols-3 gap-8)
- Card Component, zentriert
- Icons: w-12 h-12, text-blue-600

Datei: app/(marketplace)/page.tsx (unter Hero)
```

**Test:**

- [ ] 3 Cards sichtbar
- [ ] Responsive

---

### ✅ 1.6 Placeholder Seiten

**Status:** [ ] Todo  
**Dauer:** 1h  
**Dateien:** Mehrere (siehe Prompt)

**Prompt:**

```
Erstelle Placeholder-Seiten für alle Hauptrouten.

Erstelle diese Dateien mit je h1 + "Coming soon...":
1. app/(marketplace)/tailors/page.tsx - "Schneider"
2. app/(marketplace)/products/page.tsx - "Produkte"
3. app/(marketplace)/about/page.tsx - "Über uns"
4. app/(marketplace)/how-it-works/page.tsx - "Wie es funktioniert"
5. app/(auth)/login/page.tsx - "Login"
6. app/(auth)/register/page.tsx - "Registrierung"

Style: Container py-20, zentriert, max-w-4xl
```

**Test:**

- [ ] Alle Links funktionieren ohne 404

---

### ✅ MEILENSTEIN 1 ERREICHT

- [x] Layout & Navigation komplett
- [x] Keine 404 Errors
- [x] Responsive Design
- **→ Weiter zu Phase 2: Authentication**

---

## PHASE 2: AUTHENTICATION (Woche 2-3)

### ✅ 2.1 Auth Hook + Types

**Status:** [ ] Todo  
**Dauer:** 1h  
**Dateien:** `app/types/auth.ts`, `app/hooks/useAuth.ts`

**Prompt:**

```
Erstelle TypeScript Types und einen Custom Hook für Authentication.

Types (app/types/auth.ts):
- User: id, email, role ("customer" | "tailor")
- AuthState: user, loading, error

Hook (app/hooks/useAuth.ts):
- useAuth() mit: user, loading, error, login, register, logout, checkAuth
- Nutzt Supabase Client
- useState + useEffect
- Error Handling

Beide Dateien erstellen.
```

**Test:**

- [ ] Dateien ohne TS Errors
- [ ] Import funktioniert

---

### ✅ 2.2 Login API Route

**Status:** [ ] Todo  
**Dauer:** 2h  
**Dateien:** `app/api/auth/login/route.ts`, `app/lib/validations.ts`

**Prompt:**

```
Erstelle Login API Route mit Validierung.

Validation (app/lib/validations.ts):
- loginSchema: email, password (min 8)
- Nutze Zod

API Route (app/api/auth/login/route.ts):
- POST /api/auth/login
- Body: { email, password }
- Supabase: signInWithPassword
- Response 200: { user }
- Error 401: Invalid credentials
- Error 422: Validation failed

Beide Dateien.
```

**Test:**

- [ ] POST mit korrekten Daten → 200
- [ ] POST mit falschen Daten → 401

---

### ✅ 2.3 Register API Route

**Status:** [ ] Todo  
**Dauer:** 2h  
**Dateien:** `app/api/auth/register/route.ts`

**Prompt:**

```
Erstelle Register API Route.

Validation (validations.ts erweitern):
- registerSchema: email, password, role

API Route:
- POST /api/auth/register
- Supabase: signUp
- Prisma: Create User in DB
- Response 201: { user, message }

Erstelle auch app/lib/prisma.ts wenn nötig:
import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient()

Datei: app/api/auth/register/route.ts
```

**Test:**

- [ ] POST → 201, Email-Verifizierung

---

### ✅ 2.4 Logout API Route

**Status:** [ ] Todo  
**Dauer:** 30min  
**Dateien:** `app/api/auth/logout/route.ts`

**Prompt:**

```
Erstelle Logout API Route.

- POST /api/auth/logout
- Supabase: signOut()
- Response: { message: "Logout successful" }

Datei: app/api/auth/logout/route.ts
```

---

### ✅ 2.5 Login Form

**Status:** [ ] Todo  
**Dauer:** 3h  
**Dateien:** `app/components/forms/LoginForm.tsx`, `app/(auth)/login/page.tsx`

**Prompt:**

```
Erstelle Login-Formular mit shadcn/ui.

LoginForm:
- react-hook-form + Zod
- Felder: Email, Password
- shadcn/ui: Form, Input, Button
- Submit: useAuth().login
- Loading State
- Toast bei Error
- Link zu Register

Login Page:
- Rendert LoginForm, zentriert

Beide Dateien.
```

**Test:**

- [ ] Form wird angezeigt
- [ ] Validierung
- [ ] Login funktioniert

---

### ✅ 2.6 Register Form

**Status:** [ ] Todo  
**Dauer:** 3h  
**Dateien:** `app/components/forms/RegisterForm.tsx`, `app/(auth)/register/page.tsx`

**Prompt:**

```
Erstelle Registrierungs-Formular.

RegisterForm:
- Felder: Email, Password, Password Confirm, Role (Radio)
- Validierung: Passwords match, min 8
- Submit: useAuth().register
- Success: Redirect zu /login
- Link zu Login

Register Page: Rendert RegisterForm

Beide Dateien.
```

**Test:**

- [ ] Validierung funktioniert
- [ ] Registrierung erfolgreich

---

### ✅ 2.7 Header Update (Auth State)

**Status:** [ ] Todo  
**Dauer:** 1h  
**Dateien:** `app/components/layout/Header.tsx` (anpassen)

**Prompt:**

```
Update Header für Auth State.

Wenn eingeloggt:
- DropdownMenu statt Login/Register
- Trigger: Email + User Icon
- Items: Dashboard, Profil, Divider, Logout

Wenn nicht eingeloggt:
- Login + Register Buttons

Datei: app/components/layout/Header.tsx (editieren)
```

**Test:**

- [ ] Nicht eingeloggt: Buttons
- [ ] Eingeloggt: Dropdown
- [ ] Logout funktioniert

---

### ✅ MEILENSTEIN 2 ERREICHT

- [x] User Registration
- [x] User Login/Logout
- [x] Header zeigt Auth State
- **→ Weiter zu Phase 3: Marketplace**

---

## PHASE 3: MARKETPLACE - VIEW (Woche 3-5)

### ✅ 3.1 Tailor Types & Dummy Data

**Status:** [ ] Todo  
**Dauer:** 1h  
**Dateien:** `app/types/tailor.ts`, `app/lib/dummyData.ts`

**Prompt:**

```
Erstelle Tailor Types und Dummy Data.

Types (app/types/tailor.ts):
- Tailor: id, userId, name, bio, country, languages, rating, totalOrders, yearsExperience, specialties, isVerified

Dummy Data (app/lib/dummyData.ts):
- export dummyTailors (Array mit 12 Tailors)
- Realistisch: Vietnam, Thailand, Indien, etc.
- Variiere Ratings, Erfahrung, Spezialisierungen

Beide Dateien.
```

---

### ✅ 3.2 TailorCard Component

**Status:** [ ] Todo  
**Dauer:** 2h  
**Dateien:** `app/components/marketplace/TailorCard.tsx`

**Prompt:**

```
Erstelle TailorCard Component.

Props: Tailor Object

Design (shadcn/ui Card):
- Avatar (User Icon in Circle)
- Name (h3)
- Land + Flag Emoji
- Rating: Stars + Total Orders
- Specialties: Badges (max 3)
- Bio: Truncated (100 chars)
- Button: "Profil ansehen" → /tailors/[id]

Layout:
- Card mit hover:shadow-lg
- p-4, gap-3

Datei: app/components/marketplace/TailorCard.tsx
```

---

### ✅ 3.3 TailorGrid Component

**Status:** [ ] Todo  
**Dauer:** 1h  
**Dateien:** `app/components/marketplace/TailorGrid.tsx`

**Prompt:**

```
Erstelle TailorGrid Component.

Props: tailors (Array)

Layout:
- Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Rendert TailorCard für jeden

Datei: app/components/marketplace/TailorGrid.tsx
```

---

### ✅ 3.4 Tailors Page (Frontend Only)

**Status:** [ ] Todo  
**Dauer:** 2h  
**Dateien:** `app/(marketplace)/tailors/page.tsx`

**Prompt:**

```
Erstelle Schneider-Übersicht mit Dummy Data.

Layout:
- h1: "Schneider entdecken"
- Filter Placeholder (Coming soon)
- TailorGrid mit dummyTailors

Import aus app/lib/dummyData.ts
Container: max-w-7xl, py-12

Datei: app/(marketplace)/tailors/page.tsx
```

---

### ✅ 3.5 Tailors API Route

**Status:** [ ] Todo  
**Dauer:** 2h  
**Dateien:** `app/api/tailors/route.ts`

**Prompt:**

```
Erstelle Tailors API Route.

GET /api/tailors:
- Query: country, minRating, specialties, page, limit
- Prisma: Filter, include products count, pagination
- Order by: rating DESC
- Response: { tailors, total, page, pages }

Error Handling

Datei: app/api/tailors/route.ts
```

---

### ✅ 3.6 Tailors Page (API Integration)

**Status:** [ ] Todo  
**Dauer:** 2h  
**Dateien:** `app/(marketplace)/tailors/page.tsx` (ersetzen), `app/hooks/useTailors.ts`

**Prompt:**

```
API Integration für Tailors Page.

Hook (app/hooks/useTailors.ts):
- useTailors(filters)
- Fetch /api/tailors
- State: tailors, loading, error

Tailors Page Update:
- Nutze useTailors statt dummyTailors
- Loading State: Spinner
- Error State
- Empty State

Beide Dateien.
```

---

### ✅ 3.7 Tailor Profile Page

**Status:** [ ] Todo  
**Dauer:** 3h  
**Dateien:** `app/(marketplace)/tailors/[id]/page.tsx`, `app/api/tailors/[id]/route.ts`

**Prompt:**

```
Erstelle Tailor-Profil Seite.

API Route (app/api/tailors/[id]/route.ts):
- GET /api/tailors/[id]
- Prisma: findUnique with include products
- Response: { tailor, products }
- Error 404

Profile Page:
- Header: Avatar, Name, Land, Rating, Verified Badge
- Tabs: Über mich, Produkte, Bewertungen (Placeholder)
- Loading/Error States

Beide Dateien.
```

---

### ✅ 3.8 Product Types & Dummy Data

**Status:** [ ] Todo  
**Dauer:** 1h  
**Dateien:** `app/types/product.ts`, `app/lib/dummyData.ts` (erweitern)

**Prompt:**

```
Erstelle Product Types und Dummy Data.

Types (app/types/product.ts):
- Product: id, tailorId, title, description, price, currency, category, fabric, productionTime, isActive

Dummy Data (dummyData.ts erweitern):
- dummyProducts (20 Produkte)
- Verlinkt zu dummyTailors

Beide Dateien.
```

---

### ✅ 3.9 ProductCard Component

**Status:** [ ] Todo  
**Dauer:** 2h  
**Dateien:** `app/components/marketplace/ProductCard.tsx`

**Prompt:**

```
Erstelle ProductCard Component.

Props: Product + Tailor Name

Design:
- Bild (1:1, Placeholder)
- Titel (h3)
- Tailor Name (klein, Link)
- Preis (groß, prominent)
- Production Time Badge
- Button: "Details ansehen"

Layout:
- Card mit hover effect
- aspect-square für Bild

Datei: app/components/marketplace/ProductCard.tsx
```

---

### ✅ 3.10 Products Page

**Status:** [ ] Todo  
**Dauer:** 4h  
**Dateien:** `app/(marketplace)/products/page.tsx`, `app/api/products/route.ts`, `app/hooks/useProducts.ts`, `app/components/marketplace/ProductGrid.tsx`

**Prompt:**

```
Erstelle Produkt-Übersicht komplett.

API Route (app/api/products/route.ts):
- GET /api/products
- Query: category, minPrice, maxPrice, sort, page, limit
- Include tailor
- Pagination

Hook (app/hooks/useProducts.ts):
- useProducts(filters)
- Fetch, State Management

ProductGrid:
- Wie TailorGrid

Products Page:
- Filter Placeholder
- useProducts Hook
- ProductGrid
- States

Alle Dateien.
```

---

### ✅ 3.11 Product Detail Page

**Status:** [ ] Todo  
**Dauer:** 4h  
**Dateien:** `app/(marketplace)/products/[id]/page.tsx`, `app/api/products/[id]/route.ts`

**Prompt:**

```
Erstelle Product Detail Page.

API Route:
- GET /api/products/[id]
- Include images, tailor
- Error 404

Product Page:
- Grid 2 Spalten:
  Links: Bild
  Rechts: Titel, Tailor Card, Preis, Details, CTA "Jetzt bestellen"
- Tabs: Maße (Placeholder), Bewertungen

Beide Dateien.
```

---

### ✅ 3.12 Homepage Update (Dynamic)

**Status:** [ ] Todo  
**Dauer:** 2h  
**Dateien:** `app/(marketplace)/page.tsx` (erweitern)

**Prompt:**

```
Update Homepage mit echten Daten.

Sections:
- "Top Schneider": Fetch Top 6, TailorGrid, Button "Alle anzeigen"
- "Beliebte Produkte": Fetch Top 6, ProductGrid, Button

Server Component (async/await)

Datei: app/(marketplace)/page.tsx
```

---

### ✅ MEILENSTEIN 3 ERREICHT

- [x] Schneider durchsuchen
- [x] Produkte durchsuchen
- [x] Detail-Seiten
- [x] Homepage mit echten Daten
- **→ Weiter zu Phase 4: Measurement Tool**

---

## PHASE 4: MEASUREMENT TOOL (Woche 5-6)

### ✅ 4.1-4.6 Measurement System

**Status:** [ ] Todo  
**Dauer:** 12h gesamt

**Schritte:**

1. Measurement Types erstellen
2. Guide Component
3. Input Component (Multi-step)
4. Tool Page
5. API Routes (GET, POST, PUT, DELETE)
6. Management (List, Edit, Delete)

**Detaillierte Prompts siehe IMPLEMENTIERUNGSPLAN (komplettes Dokument)**

---

### ✅ MEILENSTEIN 4 ERREICHT

- [x] Measurement Tool funktioniert
- [x] Maße können gespeichert werden
- **→ Weiter zu Phase 5: Checkout**

---

## PHASE 5: CHECKOUT & ORDERS (Woche 6-8)

### ✅ 5.1-5.12 Complete Checkout Flow

**Status:** [ ] Todo  
**Dauer:** 30h gesamt

**Hauptschritte:**

1. Checkout Multi-Step Form (5 Schritte)
2. Stripe Integration
3. Payment Webhooks
4. Order API Routes
5. Customer Dashboard
6. Tailor Dashboard
7. Order Management

**Detaillierte Prompts siehe IMPLEMENTIERUNGSPLAN**

---

### ✅ MEILENSTEIN 5 ERREICHT

- [x] Complete Checkout
- [x] Stripe Payment
- [x] Order System
- [x] Dashboards
- **→ Weiter zu Phase 6: Tailor Features**

---

## PHASE 6: TAILOR FEATURES (Woche 8-9)

### ✅ 6.1-6.6 Product Management

**Status:** [ ] Todo  
**Dauer:** 15h gesamt

**Schritte:**

1. Tailor Profile Completion
2. Products API (CRUD)
3. Image Upload
4. Product Form
5. Product Management Pages
6. Profile Edit

---

### ✅ MEILENSTEIN 6 ERREICHT

- [x] Schneider können Produkte erstellen
- [x] Produkt Management
- [x] Image Upload
- **→ Weiter zu Phase 7: Reviews & Polish**

---

## PHASE 7: REVIEWS & POLISH (Woche 9-10)

### ✅ 7.1-7.12 Final Features

**Status:** [ ] Todo  
**Dauer:** 25h gesamt

**Hauptfeatures:**

1. Review System
2. Search & Filter (Advanced)
3. Content Pages
4. Loading States
5. Error Handling
6. Responsive Polish
7. SEO
8. Legal Pages

---

### ✅ MEILENSTEIN 7 ERREICHT

- [x] MVP Feature-Complete
- [x] Polish komplett
- **→ Weiter zu Phase 8: Testing & Deployment**

---

## PHASE 8: TESTING & DEPLOYMENT (Woche 10-12)

### ✅ 8.1-8.11 Launch Preparation

**Status:** [ ] Todo  
**Dauer:** 35h gesamt

**Schritte:**

1. E2E Tests (Playwright)
2. Manual Testing
3. Performance Optimization
4. Email Templates
5. Production Environment Setup
6. Database Seeding
7. Monitoring (Sentry)
8. Analytics (Plausible)
9. Documentation
10. Final Testing
11. Soft Launch

---

### ✅ MEILENSTEIN 8 ERREICHT

- [x] **MVP DEPLOYED & LIVE! 🎉**
- **→ Post-MVP Features & Iteration**

---

## 📊 FORTSCHRITT TRACKING

**Phasen Übersicht:**

- [ ] Phase 1: Foundation (0/6 Steps)
- [ ] Phase 2: Authentication (0/7 Steps)
- [ ] Phase 3: Marketplace View (0/12 Steps)
- [ ] Phase 4: Measurement Tool (0/6 Steps)
- [ ] Phase 5: Checkout & Orders (0/12 Steps)
- [ ] Phase 6: Tailor Features (0/6 Steps)
- [ ] Phase 7: Reviews & Polish (0/12 Steps)
- [ ] Phase 8: Testing & Deployment (0/11 Steps)

**Gesamtfortschritt:** 0/72 Steps (0%)

---

## 💡 TIPPS FÜR CLAUDE CODE

**Bei jedem neuen Feature:**

1. Referenziere diese ROADMAP.md
2. Frage: "Wo sind wir in der Roadmap?"
3. Befolge den nächsten Schritt
4. Hake ab wenn fertig
5. Commit nach jedem Feature

**Beispiel-Prompt:**

```
Wir arbeiten an TailorMarket. Referenziere ROADMAP.md.
Wir sind bei Phase 1, Schritt 1.1 - Header Component.
Erstelle den Header wie in der Roadmap beschrieben.
```

---

## 🎯 NÄCHSTER SCHRITT

**→ Phase 1.1: Header Component**

Kopiere den Prompt aus Schritt 1.1, gib ihn Claude Code, und leg los! 🚀

---

**Version:** 1.0  
**Letztes Update:** 2025-11-28  
**Status:** Ready to Start
