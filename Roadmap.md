# 🚀 TAILORMARKET - DEVELOPMENT ROADMAP

**Version:** 3.3 - Development Beta Testing Phase
**Geschätzte Dauer:** 10-12 Wochen (MVP) + Post-Launch Features
**Status:** Phase 8.7.1 - App live auf Vercel, Beta Testing mit Bekannten ✅
**Nächste Phase:** Bug Fixes + Geplantes "Umkrempeln" → Dann Production Setup
**Post-MVP:** Phase 9 - 16 Enhancement Features dokumentiert
**Letztes Update:** 2025-12-21 (Development Deployment + Beta Testing Start)

---

## 📍 AKTUELLER STAND

- [x] Setup komplett (Next.js, Supabase, Prisma, shadcn/ui)
- [x] Datenbank Schema definiert
- [x] RLS Policies eingerichtet
- [x] Auth funktioniert (Test)
- [x] Storage konfiguriert
- [x] Phase 1.1 - Header Component
- [x] Phase 1.2 - Footer Component
- [x] Phase 1.3 - Root Layout Integration
- [x] Phase 1.4 - Homepage Hero Section
- [x] Phase 1.5 - "Wie es funktioniert" Section
- [x] Phase 1.6 - Placeholder Seiten
- [x] **PHASE 1 ABGESCHLOSSEN! ✅**
- [x] Phase 2.1 - Auth Hook + Types
- [x] Phase 2.2 - Login API Route
- [x] Phase 2.3 - Register API Route
- [x] Phase 2.4 - Logout API Route
- [x] Phase 2.5 - Login Form Component
- [x] Phase 2.6 - Register Form Component
- [x] Phase 2.7 - Header Update für Auth State
- [x] **PHASE 2 ABGESCHLOSSEN! ✅**
- [x] Phase 3.1 - Tailor Types & Dummy Data
- [x] Phase 3.2 - TailorCard Component
- [x] Phase 3.3 - TailorGrid Component
- [x] Phase 3.4 - Tailors Page (Frontend Only)
- [x] Phase 3.5 - Tailors API Route
- [x] Phase 3.6 - Tailors Page (API Integration)
- [x] Phase 3.7 - Tailor Profile Page
- [x] Phase 3.8 - Product Types & Dummy Data
- [x] Phase 3.9 - ProductCard Component
- [x] Phase 3.10 - Products Page
- [x] Phase 3.11 - Product Detail Page
- [x] Phase 3.12 - Homepage Dynamic Updates
- [x] **PHASE 3 ABGESCHLOSSEN! ✅**
- [x] Phase 4.1 - Measurement Provider Architecture
- [x] Phase 4.2 - MockProvider Implementation
- [x] Phase 4.3 - ManualProvider Implementation
- [x] Phase 4.4 - API Routes & Database Schema
- [x] Phase 4.5 - Frontend Components (QR Modal, Button)
- [x] Phase 4.6 - Mobile Pages (Mock & Manual)
- [x] **PHASE 4 ABGESCHLOSSEN! ✅**
- [x] Phase 5.1 - Prisma Schema erweitern (Order Model)
- [x] Phase 5.2 - Stripe SDKs installieren
- [x] Phase 5.3 - Order Types & Validations
- [x] Phase 5.4 - Stripe Helper Functions
- [x] Phase 5.5 - Checkout API Routes
- [x] Phase 5.6 - Stripe Webhook Handler
- [x] Phase 5.7 - Order API Routes (CRUD)
- [x] Phase 5.8 - Checkout Page/Form
- [x] Phase 5.9 - Order Success Page
- [x] Phase 5.10 - Customer Dashboard
- [x] Phase 5.11 - Tailor Dashboard
- [x] Phase 5.12 - Integration Complete
- [x] **PHASE 5 ABGESCHLOSSEN! ✅**
- [x] Phase 8.1 - Code Review & Bug Fixes
- [x] Phase 8.2 - Manual Testing (Automated)
- [x] Phase 8.3 - E2E Test Setup (Playwright) - 16/16 Tests ✅
- [x] Phase 8.4 - Performance Optimization & Build Test ✅
- [x] Phase 8.4.1 - Build Test (14.4s, 0 Errors, 2MB Bundle) ✅
- [x] Phase 8.4.2 - Console Cleanup (81→3 statements, production-safe) ✅
- [x] Phase 8.4.3 - Lighthouse Audit (100/96/96/100 - Production Ready!) ✅
- [x] Phase 8.5 - Final Polish Check (6/6 Automated Tests Passed) ✅
- [x] Phase 8.6 - Email Templates & Integration (komplett integriert) ✅
- [x] Phase 8.7.0 - Vercel Setup & Production Checklist (Vorbereitung) ✅
- [x] Phase 8.7.1 - Development Deployment + Beta Testing Setup ✅
- [ ] **→ JETZT: Beta Testing mit Bekannten (laufend)**
- [ ] **→ SPÄTER: Bug Fixes + Geplantes "Umkrempeln"**
- [ ] **→ VIEL SPÄTER: Phase 8.7 - Production Setup (wenn ready für echte User)**

---

## 🎯 QUICK NAVIGATION - NÄCHSTER SCHRITT

**✅ Heute abgeschlossen (2025-12-21):**
- ✅ App ist LIVE auf Vercel: https://tailormp.vercel.app
- ✅ Development Environment deployed (Supabase Dev + Stripe Test Mode)
- ✅ Beta Testing Anleitung erstellt ([TESTING_GUIDE_FOR_FRIENDS.md](TESTING_GUIDE_FOR_FRIENDS.md))
- ✅ Vercel Deployment Status: Ready ✅ (0% Error Rate)
- ✅ WhatsApp/Email Nachricht für Bekannte vorbereitet

**🧪 JETZT LAUFEND - Beta Testing Phase**

### Was jetzt passiert:
1. **Du:** Teilst Link mit Bekannten
2. **Bekannte:** Testen die App (15-30 Min pro Person)
3. **Du:** Sammelst Bug Reports + Feedback
4. **Wir:** Fixen kritische Bugs (falls nötig)
5. **Du:** "Umkrempeln" wie geplant (große Änderungen)
6. **Später:** Production Setup (wenn ready für echte User)

### Quick Actions für JETZT:
```
📱 WhatsApp/Email verschicken:
"Hey! Bräuchte Feedback zu meiner App: https://tailormp.vercel.app
(Test-Modus, keine echten Zahlungen, Stripe Test-Karte: 4242 4242 4242 4242)"
```

**Detaillierte Anleitung:** [TESTING_GUIDE_FOR_FRIENDS.md](TESTING_GUIDE_FOR_FRIENDS.md)

### Nach Beta Testing:
- Bug Fixes (je nach Feedback)
- Geplantes "Umkrempeln" (deine Features/Änderungen)
- Iteratives Development
- **Viel später:** Production Setup (echte Zahlungen, echte User)

---

## PHASE 1: FOUNDATION & LAYOUT (Woche 1-2)

### ✅ 1.1 Header Component

**Status:** [x] Fertig
**Dauer:** 2-3h
**Dateien:** `app/components/layout/Header.tsx`, `app/lib/utils.ts`

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

- [x] Header ist sichtbar auf allen Seiten
- [x] Links funktionieren
- [x] Mobile-Menü öffnet/schließt sich
- [x] Sticky behavior beim Scrollen

---

### ✅ 1.2 Footer Component

**Status:** [x] Fertig
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

- [x] Footer am Ende jeder Seite
- [x] Responsive Layout

---

### ✅ 1.3 Root Layout Integration

**Status:** [x] Fertig
**Dauer:** 1h
**Dateien:** `app/layout.tsx` (angepasst)

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

- [x] Header oben, Footer unten auf jeder Seite
- [x] Content hat min. Höhe eines Viewports

---

### ✅ 1.4 Homepage - Hero Section

**Status:** [x] Fertig
**Dauer:** 2-3h
**Dateien:** `app/(marketplace)/page.tsx`, `app/(marketplace)/layout.tsx`

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

- [x] Hero Section sichtbar
- [x] CTA Button funktioniert

---

### ✅ 1.5 Homepage - "Wie es funktioniert"

**Status:** [x] Fertig
**Dauer:** 2h
**Dateien:** `app/(marketplace)/page.tsx` (erweitert)

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

- [x] 3 Cards sichtbar
- [x] Responsive

---

### ✅ 1.6 Placeholder Seiten

**Status:** [x] Fertig
**Dauer:** 1h
**Dateien:** 6 Seiten + 1 Layout erstellt

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

- [x] Alle Links funktionieren ohne 404

---

### ✅ MEILENSTEIN 1 ERREICHT ✨

- [x] Layout & Navigation komplett
- [x] Keine 404 Errors
- [x] Responsive Design
- [x] Homepage mit Hero + "Wie es funktioniert"
- [x] Alle Placeholder Seiten erstellt
- **✅ → Weiter zu Phase 2: Authentication**

---

## PHASE 2: AUTHENTICATION (Woche 2-3)

### ✅ 2.1 Auth Hook + Types

**Status:** [x] Fertig
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

- [x] Dateien ohne TS Errors
- [x] Import funktioniert

---

### ✅ 2.2 Login API Route

**Status:** [x] Fertig
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

- [x] POST mit korrekten Daten → 200
- [x] POST mit falschen Daten → 401

---

### ✅ 2.3 Register API Route

**Status:** [x] Fertig
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

- [x] POST → 201, Email-Verifizierung

---

### ✅ 2.4 Logout API Route

**Status:** [x] Fertig
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

**Status:** [x] Fertig
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

**Status:** [x] Fertig
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

**Status:** [x] Fertig
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

**Status:** [x] Fertig
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

**Status:** [x] Fertig
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

**Status:** [x] Fertig
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

**Status:** [x] Fertig
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

**Status:** [x] Fertig
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

**Status:** [x] Fertig
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

**Status:** [x] Fertig
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

**Status:** [x] Fertig
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

**Status:** [x] Fertig
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

**Status:** [x] Fertig
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

**Status:** [x] Fertig
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

**Status:** [x] Fertig
**Dauer:** 2h
**Dateien:** `app/(marketplace)/page.tsx` (erweitert)

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

## PHASE 4: MEASUREMENT PROVIDER ARCHITECTURE (Woche 5-6)

### ✅ 4.1 Provider Architecture & Types

**Status:** [x] Fertig
**Dauer:** 2h
**Dateien:** `app/lib/measurement/provider.interface.ts`, `app/lib/measurement/measurements.types.ts`, `app/lib/measurement/provider.factory.ts`

**Was wurde erstellt:**

✅ **Provider Interface** - Definiert Contract für alle Measurement Provider
✅ **Standardisierte Types** - `Measurements`, `MeasurementSession`, `ProviderConfig`
✅ **Provider Factory** - Automatischer Provider-Wechsel via Environment Variable

**Strategische Entscheidung:**

Statt direkt 3DLOOK zu integrieren ($500/Monat für MVP zu teuer), haben wir eine **Provider Abstraction** gebaut:
- **MockProvider** für kostenloses MVP Testing (simuliert 3DLOOK Flow)
- **ManualProvider** als Alternative/Fallback
- **3DLookProvider** Template vorbereitet für später

**Vorteil:** Provider-Wechsel durch `.env` Änderung - **kein Code-Refactoring nötig!**

---

### ✅ 4.2 MockProvider Implementation

**Status:** [x] Fertig
**Dauer:** 2h
**Dateien:** `app/lib/measurement/providers/mock.provider.ts`

**Features:**
- Simuliert kompletten 3DLOOK Flow (QR-Code → Mobile Page → Measurements)
- Generiert realistische Demo-Daten
- Session Management in Database
- Speichert Measurements in standardisiertem Format

**Verwendung:** Perfekt für MVP Testing ohne externe API Kosten!

---

### ✅ 4.3 ManualProvider Implementation

**Status:** [x] Fertig
**Dauer:** 2h
**Dateien:** `app/lib/measurement/providers/manual.provider.ts`

**Features:**
- Manuelle Eingabe von Körpermaßen
- Validierung (Plausibilitätsprüfung)
- Multi-Step Form mit Anleitungen
- Für User ohne Smartphone oder die lieber selbst messen

---

### ✅ 4.4 Database Schema & API Routes

**Status:** [x] Fertig
**Dauer:** 3h
**Dateien:** `prisma/schema.prisma`, `app/api/measurement/session/route.ts`, `app/api/measurement/[sessionId]/route.ts`

**Database:**
- ✅ `MeasurementSession` Model (provider-agnostic)
- ✅ Relations zu User & Order
- ✅ Migriert mit `prisma db push` (ohne Datenverlust!)

**API Routes:**
- ✅ `POST /api/measurement/session` - Session erstellen
- ✅ `GET /api/measurement/session?userId=xxx` - Sessions auflisten
- ✅ `GET /api/measurement/[sessionId]` - Session abrufen
- ✅ `PATCH /api/measurement/[sessionId]` - Measurements speichern

---

### ✅ 4.5 Frontend Components

**Status:** [x] Fertig
**Dauer:** 2h
**Dateien:** `app/components/measurement/MeasurementButton.tsx`, `app/components/measurement/QRCodeModal.tsx`

**Components:**
- ✅ **MeasurementButton** - Provider-agnostic Start Button
- ✅ **QRCodeModal** - QR-Code Display mit Status Polling (automatisches Close bei Completion)

**Library:** `qrcode` für QR-Code Generierung (installiert)

---

### ✅ 4.6 Mobile Measurement Pages

**Status:** [x] Fertig
**Dauer:** 3h
**Dateien:** `app/(measurement)/measurement/mock/[sessionId]/page.tsx`, `app/(measurement)/measurement/manual/[sessionId]/page.tsx`

**Pages:**
- ✅ **Mock Flow** - Simulierte Mobile Scan Page mit vorausgefüllten Demo-Daten
- ✅ **Manual Flow** - Multi-Step Form mit Mess-Anleitungen und Validierung

---

### ✅ 4.7 Documentation & Testing

**Status:** [x] Fertig
**Dauer:** 1h
**Dateien:** `MEASUREMENT_SETUP.md`, `MEASUREMENT_STRATEGY.md`, `app/test-measurement/page.tsx`

**Dokumentation:**
- ✅ Komplette Setup-Anleitung
- ✅ Provider Architecture Dokumentation
- ✅ Migration Path: Mock → 3DLOOK
- ✅ Test Page für einfaches Testing

---

### ✅ MEILENSTEIN 4 ERREICHT! 🎉

**Was funktioniert:**
- ✅ Measurement Provider Architecture komplett implementiert
- ✅ MockProvider für kostenloses MVP Testing einsatzbereit
- ✅ ManualProvider als Alternative verfügbar
- ✅ Kompletter Flow testbar (Desktop → QR-Code → Mobile → Measurements speichern)
- ✅ Database Schema erweitert (ohne Datenverlust!)
- ✅ API Routes funktionieren
- ✅ Frontend Components ready to use
- ✅ `.env` konfiguriert für Provider-Wechsel

**Migration zu 3DLOOK (später):**
1. Implementiere `3DLookProvider` (Template vorbereitet)
2. Ändere `.env`: `MEASUREMENT_PROVIDER=3dlook`
3. Fertig! Kein Code-Refactoring nötig ✅

**Environment Variables:**
```bash
MEASUREMENT_PROVIDER=mock           # Aktuell: Mock für MVP
NEXT_PUBLIC_URL=http://localhost:3000
# Für später: 3DLOOK Credentials
```

**Testing:**
```bash
npm run dev
# Öffne: http://localhost:3000/test-measurement
# Klicke "Maße nehmen" → Teste kompletten Flow
```

**File Structure:**
```
app/lib/measurement/
├── provider.interface.ts      # Interface
├── provider.factory.ts         # Factory
├── measurements.types.ts       # Types
└── providers/
    ├── mock.provider.ts        ✅
    ├── manual.provider.ts      ✅
    └── 3dlook.provider.ts      🔜 Später
```

**→ Weiter zu Phase 5: Checkout & Orders**

---

## PHASE 5: CHECKOUT & ORDERS (Woche 6-8)

### ✅ 5.1-5.12 Complete Checkout Flow

**Status:** [x] Abgeschlossen ✅
**Dauer:** 30h gesamt

**Implementierte Features:**

1. ✅ Database Schema (Order, OrderItem models)
2. ✅ Stripe Integration (SDK, Checkout Sessions)
3. ✅ Payment Webhooks (checkout.session.completed, payment_intent.succeeded/failed)
4. ✅ Order API Routes (GET, PATCH für Status Updates)
5. ✅ Checkout Page mit Form (Shipping Address, Method, Custom Notes)
6. ✅ Order Success Page mit Confirmation
7. ✅ Customer Dashboard (Orders Liste & Detail)
8. ✅ Tailor Dashboard (Orders Management & Status Updates)
9. ✅ Platform Commission (10% Fee Calculation)
10. ✅ Order Snapshots (Product Details at time of purchase)
11. ✅ Measurement Integration (Links to MeasurementSession)
12. ✅ Complete End-to-End Flow

**Dokumentation:**
- Siehe `docs/PHASE_5_IMPLEMENTATION.md` für Details
- Siehe `docs/PHASE_5_QUICKSTART.md` für Testing Guide

**Environment Variables:**
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PLATFORM_COMMISSION_PERCENTAGE=10
```

---

### ✅ MEILENSTEIN 5 ERREICHT! 🎉

- [x] Complete Checkout Flow
- [x] Stripe Payment Integration
- [x] Order Management System
- [x] Customer & Tailor Dashboards
- [x] Webhook Handler for Order Creation
- [x] Platform Fee Calculation
- **→ Weiter zu Phase 6: Tailor Features**

---

## PHASE 6: TAILOR FEATURES (Woche 8-9)

### ✅ 6.1-6.6 Product Management

**Status:** [x] COMPLETE ✅
**Dauer:** 15h gesamt

**Implementierte Features:**

1. ✅ Tailor Profile Completion (Profile Edit Page, API Routes)
2. ✅ Products API (CRUD) - POST, PATCH, DELETE /api/tailor/products
3. ✅ Image Upload (Supabase Storage, ImageUpload Component)
4. ✅ Product Create Form (Multi-step with validation)
5. ✅ Product Management Page (Grid View, Actions)
6. ✅ Product Edit Page (Pre-filled, Image Management)

**Neue Dateien:**
- API Routes: `/api/tailor/profile`, `/api/tailor/products`, `/api/upload/product-image`
- Pages: `/tailor/profile/edit`, `/tailor/products`, `/tailor/products/new`, `/tailor/products/[id]/edit`
- Components: `ImageUpload`, `Textarea`
- Validations: `tailorProfileSchema`, `productSchema`

**Datum:** 2025-12-02

---

### ✅ MEILENSTEIN 6 ERREICHT ✨

- [x] Schneider können Produkte erstellen/editieren/löschen
- [x] Produkt Management Dashboard komplett
- [x] Image Upload funktioniert (Drag & Drop, max 5 Bilder)
- [x] Volle CRUD-Funktionalität mit Authorization
- **✅ → Weiter zu Phase 7: Reviews & Polish**

---

## PHASE 7: REVIEWS & POLISH (Woche 9-10)

### ✅ 7.1-7.8 Core Features

**Status:** [x] COMPLETE ✅
**Dauer:** 15h gesamt

**Implementierte Features:**

1. ✅ **Review System** (Komplett)
   - API Routes: GET, POST, PATCH, DELETE `/api/reviews`
   - ReviewForm Component (interaktive 5-Sterne-Bewertung)
   - ReviewList Component (mit Statistiken & Rating-Distribution)
   - Automatische Tailor-Rating-Updates
   - Review-Lösch-Funktion (nur eigene)

2. ✅ **Advanced Product Search & Filters**
   - ProductFilters Component
   - Volltextsuche (Titel & Beschreibung)
   - Kategorie-Filter (Anzüge, Hemden, Hosen, etc.)
   - Preis-Range-Filter (Min/Max)
   - Sortierung (Neueste, Preis aufsteigend/absteigend, Name)
   - Aktive Filter-Anzeige mit Badges
   - Responsive Design mit ausklappbarem Panel

3. ✅ **Advanced Tailor Search & Filters**
   - TailorFilters Component
   - Volltextsuche (Name & Bio)
   - Land-Filter
   - Mindestbewertung-Filter
   - "Nur verifizierte"-Checkbox
   - Spezialisierungs-Filter (Mehrfachauswahl)
   - Sortierung (Bewertung, Bestellungen, Erfahrung, Name)

4. ✅ **Order Management System**
   - Order List Page (`/orders`)
   - Order Detail Page (`/orders/[id]`)
   - Dashboard mit Statistiken
   - Status-Tracking & Timeline

**Neue Dateien:**
- API: `/api/reviews/route.ts`, `/api/reviews/[id]/route.ts`
- Components: `ReviewForm.tsx`, `ReviewList.tsx`, `ProductFilters.tsx`, `TailorFilters.tsx`
- Pages: `/orders/page.tsx`, `/orders/[id]/page.tsx`
- Dashboard Updates mit Order Statistics

**Datum:** 2025-12-02

---

### ✅ MEILENSTEIN 7 ERREICHT

- [x] Review System komplett implementiert
- [x] Advanced Search & Filter für Products & Tailors
- [x] Order Management mit Detail-Ansichten
- [x] Dashboard mit Statistiken
- [x] MVP Feature-Complete ✨
- **→ Bereit für Phase 8: Testing & Deployment**

---

## PHASE 8: TESTING & DEPLOYMENT (Woche 10-12)

### 🔄 8.1 Code Review & Bug Fixes

**Status:** [~] In Progress
**Dauer:** 5h bisher
**Datum:** 2025-12-04

**Completed:**
1. ✅ Code Review durchgeführt
   - Authentication & Authorization ✅
   - API Routes ✅
   - Database Schema ✅
   - Prisma Relations ✅

2. ✅ **Issue #1 FIXED** - Price Field Inconsistency
   - Problem: Schema hatte `price` (nullable) + `basePrice` (required)
   - Lösung: `basePrice` entfernt, `price` als required
   - Migration Script erstellt und ausgeführt
   - 5 Produkte erfolgreich migriert
   - Database Schema synchronisiert
   - Alle API Tests erfolgreich

**Found Issues:**
- 🟡 Issue #2: Environment Variable Inconsistencies (NEXT_PUBLIC_URL)
- 🟡 Issue #3: Duplicate Auth Code in API Routes

**Documentation:**
- [PHASE8_CODE_REVIEW.md](PHASE8_CODE_REVIEW.md) - Vollständiger Report

---

### ✅ 8.2 Manual Testing (Automated Portion)

**Status:** [x] Complete (Automated Tests)
**Dauer:** 3h
**Datum:** 2025-12-04

**Completed Tests:**
- ✅ **API Endpoints** (8/8)
  - GET /api/products → 5 Products ✅
  - GET /api/products/[id] → Detail ✅
  - GET /api/tailors → 4 Tailors ✅
  - GET /api/tailors/[id] → Detail ✅
  - GET /api/cart → 401 Unauthorized ✅ (Auth working)

- ✅ **Frontend Routes** (5/5)
  - `/` → 200 OK ✅
  - `/products` → 200 OK ✅
  - `/tailors` → 200 OK ✅
  - `/login` → 200 OK ✅
  - `/register` → 200 OK ✅

- ✅ **Database Integrity**
  - 8 Users, 4 Tailors, 5 Products ✅
  - All products with valid prices (> 0) ✅
  - No orphaned records ✅
  - Foreign keys intact ✅

**Documentation:**
- [PHASE8_MANUAL_TESTING.md](PHASE8_MANUAL_TESTING.md) - Vollständiger Test-Report

**Pending - Browser Testing Required:**
- ⏳ Complete User Flows (Register → Cart → Checkout)
- ⏳ Stripe Payment Integration
- ⏳ Tailor Product Management
- ⏳ Review System

**Test Scripts Created:**
- [scripts/check-db-integrity.ts](scripts/check-db-integrity.ts)
- [scripts/migrate-price-field.ts](scripts/migrate-price-field.ts)

---

### ✅ 8.3 E2E Test Setup (Playwright)

**Status:** [x] Complete - 100% Pass Rate! 🎉
**Dauer:** 3h
**Datum:** 2025-12-04

**Completed:**
1. ✅ **Playwright Installation**
   - @playwright/test installed
   - Chromium browser downloaded
   - Test infrastructure ready

2. ✅ **Configuration**
   - [playwright.config.ts](playwright.config.ts) created
   - Auto dev server startup
   - Screenshots & videos on failure
   - Trace recording enabled

3. ✅ **Test Files Created** (3 files, 16 tests)
   - [tests/e2e/01-homepage.spec.ts](tests/e2e/01-homepage.spec.ts) - 5 tests
   - [tests/e2e/02-marketplace.spec.ts](tests/e2e/02-marketplace.spec.ts) - 6 tests
   - [tests/e2e/03-auth.spec.ts](tests/e2e/03-auth.spec.ts) - 5 tests

4. ✅ **Test Helpers**
   - [tests/e2e/helpers/auth.helper.ts](tests/e2e/helpers/auth.helper.ts) - Auth functions
   - [tests/e2e/helpers/db.helper.ts](tests/e2e/helpers/db.helper.ts) - DB utilities

5. ✅ **npm Scripts Added**
   - `npm run test:e2e` - Run all tests
   - `npm run test:e2e:ui` - Interactive mode
   - `npm run test:e2e:headed` - See browser
   - `npm run test:e2e:debug` - Debug mode

6. ✅ **All Tests Fixed & Passing**
   - Added data-testid to ProductCard & TailorCard
   - Fixed navigation selectors with .first()
   - Fixed card click navigation
   - **CRITICAL BUG FIXED**: Product detail page h1 (product.title vs product.name)

**Final Test Results:**
- ✅ **16/16 tests passed (100% success rate!)** 🎉
- ✅ **25.5 seconds** execution time (81.5% faster than initial)
- ✅ All homepage tests passing (5/5)
- ✅ All marketplace tests passing (6/6)
- ✅ All authentication tests passing (5/5)

**Documentation:**
- [PHASE8_E2E_SETUP.md](PHASE8_E2E_SETUP.md) - Complete setup guide
- [tests/e2e/README.md](tests/e2e/README.md) - Testing guide
- [E2E_TEST_RESULTS.md](E2E_TEST_RESULTS.md) - Initial test report
- [E2E_TEST_RESULTS_FINAL.md](E2E_TEST_RESULTS_FINAL.md) - After first fixes
- [E2E_TEST_SUCCESS.md](E2E_TEST_SUCCESS.md) - **100% SUCCESS REPORT** ✨

**Bugs Found & Fixed:**
1. Missing data-testid attributes (6 tests) ✅
2. Strict mode selector violations (2 tests) ✅
3. Card click navigation issues (2 tests) ✅
4. **CRITICAL**: Product detail page title not displaying (production bug!) ✅

---

### ✅ 8.4 Performance Optimization

**Status:** [x] Complete ✅
**Dauer:** 2-3h
**Datum:** 2025-12-11

**Durchgeführt:**
1. ✅ Database Composite Indexes (isActive+createdAt, category+price, tailorId+isActive)
2. ✅ API Query Optimizations (Select nur nötige Felder, -40-60% Datentransfer)
3. ✅ Code Splitting (Lazy Load Review Components, -25KB Bundle)
4. ✅ Next.js Config Enhancements (Package Imports, Security Headers, Image Cache)
5. ✅ Database Migration erfolgreich (`prisma db push`)
6. ✅ Build Testing (28.3s, **58% schneller** als vorher!)

**Ergebnisse:**
- ⚡ Build Time: 67s → 28.3s (**-58% faster**)
- 📦 Bundle Size: ~215KB → ~170KB (**-21%**)
- ⚡ API Response: ~280ms → ~180ms (estimated **-36%**)
- 🚀 Database Queries: ~45ms → ~28ms (estimated **-38%**)

**Dokumentation:**
- [PHASE8_PERFORMANCE_OPTIMIZATION.md](PHASE8_PERFORMANCE_OPTIMIZATION.md)

---

### [ ] 8.5 Final Polish Check

**Status:** [ ] Todo
**Dauer:** 3h
**Priority:** 🔴 KRITISCH (Quality Gate)
**Arbeitsanteil:** Du: 50% | Claude: 50%

**Beschreibung:**
Manuelle QA-Session zur Überprüfung aller Features und Behebung letzter Bugs vor dem Deployment.

---

#### **📝 TEIL 1: FORMS TESTING (30min - DU testest, CLAUDE fixt)**

**Login Form:**
- [ ] Erfolgreicher Login funktioniert
- [ ] Fehlerhafte Email zeigt Validierungsfehler
- [ ] Falsches Passwort zeigt Error Message
- [ ] "Remember me" funktioniert
- [ ] Redirect nach Login korrekt (Dashboard/Tailor Dashboard)

**Register Form:**
- [ ] Registrierung als Customer funktioniert
- [ ] Registrierung als Tailor funktioniert
- [ ] Email Validation funktioniert
- [ ] Password Strength Check funktioniert
- [ ] Welcome Email wird versendet
- [ ] Auto-Login nach Registrierung

**Measurement Forms:**
- [ ] Manual Measurement Input funktioniert
- [ ] Alle Felder validieren korrekt (nur Zahlen)
- [ ] Mock Measurement QR Code funktioniert
- [ ] Measurements werden gespeichert

**Product Form (Tailor):**
- [ ] Neues Produkt erstellen funktioniert
- [ ] Image Upload funktioniert
- [ ] Alle Felder validieren korrekt
- [ ] Produkt Edit funktioniert
- [ ] Produkt Delete funktioniert

**Review Form:**
- [ ] Review schreiben funktioniert
- [ ] Star Rating funktioniert
- [ ] Review wird sofort angezeigt

**Checkout Form:**
- [ ] Shipping Address Validation
- [ ] Stripe Checkout öffnet korrekt
- [ ] Test-Payment funktioniert
- [ ] Redirect nach Success

---

#### **🔌 TEIL 2: API ROUTES TESTING (30min - CLAUDE)**

**Auth API:**
- [ ] `/api/auth/register` - Validation, Error Handling
- [ ] `/api/auth/login` - Rate Limiting, Error Messages
- [ ] `/api/auth/logout` - Session Clear

**Products API:**
- [ ] `/api/products` - Pagination, Filtering
- [ ] `/api/products/[id]` - 404 für ungültige ID
- [ ] `/api/tailor/products` - Auth Required

**Orders API:**
- [ ] `/api/orders` - Nur eigene Orders
- [ ] `/api/orders/[id]` - Access Control (Customer vs Tailor)
- [ ] PATCH Status Update - Nur Tailor

**Checkout API:**
- [ ] `/api/checkout/session` - Stripe Session Creation
- [ ] `/api/webhooks/stripe` - Signature Verification

---

#### **🎨 TEIL 3: UI/UX POLISH (45min - DU testest, CLAUDE fixt)**

**Empty States:**
- [ ] Keine Produkte → "No products found" Message
- [ ] Keine Orders → "No orders yet" mit CTA
- [ ] Keine Reviews → "Be the first to review"
- [ ] Leerer Cart → "Your cart is empty"
- [ ] Keine Measurements → "Add measurements"

**Images:**
- [ ] Alle Bilder haben `alt` Text
- [ ] Loading States (Skeleton/Spinner)
- [ ] Broken Image Fallback
- [ ] Responsive Images (Mobile optimiert)
- [ ] next/image korrekt verwendet

**Buttons & Links:**
- [ ] Alle Buttons haben hover/active States
- [ ] Loading States bei Form Submit
- [ ] Disabled States visuell erkennbar
- [ ] Links haben underline on hover

**Typography:**
- [ ] Font Sizes auf Mobile lesbar
- [ ] Line Height ausreichend
- [ ] Kontrast ausreichend (WCAG AA)

---

#### **📱 TEIL 4: MOBILE TESTING (45min - DU)**

**Navigation:**
- [ ] Mobile Menu öffnet/schließt korrekt
- [ ] Alle Links funktionieren
- [ ] Close Button funktioniert
- [ ] Menu schließt beim Route-Wechsel

**Forms:**
- [ ] Input Fields groß genug (44x44px min)
- [ ] Keyboard öffnet korrekt
- [ ] Submit Buttons erreichbar
- [ ] Validation Messages sichtbar

**Tables & Lists:**
- [ ] Horizontal Scroll wo nötig
- [ ] Tap Targets groß genug
- [ ] Text nicht abgeschnitten

**Performance:**
- [ ] Seiten laden <3s auf 3G
- [ ] Smooth Scrolling
- [ ] No Layout Shift

---

#### **⚡ TEIL 5: PERFORMANCE & CONSOLE CHECK (30min - CLAUDE)**

**Build Check:**
- [x] TypeScript (`npm run build` - Keine TS Errors) ✅
- [ ] No Unused Imports
- [ ] No Console Logs in Production Code
- [ ] Bundle Size < 300KB initial

**Browser Console:**
- [ ] Keine Errors in Console
- [ ] Keine Warnings in Console
- [ ] Keine 404s im Network Tab
- [ ] Keine CORS Errors

**Performance:**
- [ ] Lighthouse Score > 80 (Performance)
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.5s

---

#### **🐛 TEIL 6: BUG FIXING (Restliche Zeit - CLAUDE)**

**Nach jedem Test-Teil:**
1. [ ] Bug-Liste erstellen mit Priority:
   - 🔴 Critical (App unbenutzbar)
   - 🟡 High (Feature nicht nutzbar)
   - 🟢 Medium (Kleinere Probleme)
   - ⚪ Low (Nice-to-have)

2. [ ] CLAUDE fixt alle Critical & High Bugs
3. [ ] Re-Testing nach Fixes
4. [ ] Medium Bugs nur wenn Zeit bleibt

**Bug Report Template:**
```markdown
**Priority:** 🔴/🟡/🟢/⚪
**Feature:** [z.B. Login Form]
**Issue:** [Beschreibung]
**Steps to Reproduce:**
1. ...
2. ...
**Expected:** ...
**Actual:** ...
```

---

**Deliverables:**
- [ ] Vollständige Bug-Liste mit Priorities
- [ ] Alle Critical Bugs gefixt
- [ ] Alle High Bugs gefixt
- [ ] Re-Test bestanden
- [ ] QA Sign-Off ✅

---

### [x] 8.6 Email Templates & Integration

**Status:** [x] Complete ✅
**Dauer:** 4h (2.5h Templates + 1.5h Integration)
**Priority:** 🔴 KRITISCH
**Datum:** 2025-12-14

**Beschreibung:**
Transactional Email Templates für Order Lifecycle - komplett integriert.

**Templates:**
- [x] Order Confirmation (Customer) ✅
- [x] Order Notification (Tailor) ✅
- [x] Order Status Update (measuring, production, shipping, completed) ✅
- [x] Welcome Email (nach Registrierung - Customer & Tailor) ✅

**Tech Stack:**
- ✅ React Email (Typsichere Templates mit React Components)
- ✅ Resend (DSGVO-konform, 3000 Emails/Monat Free Tier)
- ✅ Test-API Route für einfaches Testing

**Implementiert:**
1. ✅ 4 Email Templates (React Email Components)
2. ✅ Email-Sending Utility Functions in `app/lib/email.ts`
3. ✅ Helper Functions (formatCurrency, formatDate, generateOrderNumber)
4. ✅ Test-API Route `/api/test-email` (nur Development)
5. ✅ Environment Variables dokumentiert in `.env.local.example`
6. ✅ Umfassende Dokumentation in `EMAIL_SETUP.md` & `EMAIL_QUICKSTART.md`

**Integration in API Routes:**
1. ✅ Welcome Email → `/api/auth/register` (fire-and-forget)
2. ✅ Order Confirmation → `/api/webhooks/stripe` (Cart & Single Product)
3. ✅ Order Notification (Tailor) → `/api/webhooks/stripe` (Cart & Single Product)
4. ✅ Status Update Emails → `/api/orders/[id]` (PATCH)
5. ✅ Build Testing - alle TypeScript Checks bestanden

**Erfolgreich getestet:**
- ✅ Resend API Key funktioniert
- ✅ Test-Email erfolgreich versendet (ID: 8aa90b64-4299-4682-afea-ed8bc2994d43)
- ✅ Production Build erfolgreich (15.5s compile time)

---

### [ ] 8.7 Production Environment Setup

**Status:** [ ] Todo - Vorbereitung laufend ✅
**Dauer:** 2-3h (optimiert mit Step-by-Step Checklist)
**Priority:** 🔴 KRITISCH - ZWINGEND VOR LAUNCH
**Arbeitsanteil:** Du: 70% | Claude: 30%

**Beschreibung:**
Production Environment einrichten und sichern. OHNE diesen Schritt kann die App NICHT live gehen.

**Aktueller Stand (2025-12-19):**
- ✅ Vercel Account konfiguriert (Projekt "tailormp" deployed)
- ✅ Environment Variables in Vercel gesetzt (Development Config)
- ✅ Build Settings optimiert (Next.js, Node 24.x, Standard Build Machine)
- ✅ Detaillierte Checklist erstellt: [PRODUCTION_SETUP_CHECKLIST.md](PRODUCTION_SETUP_CHECKLIST.md)
- [ ] Praxis-Test der Vercel Konfiguration durchführen
- [ ] Production Credentials von Supabase & Stripe holen
- [ ] Environment Variables auf Production umstellen
- [ ] Live Testing & Launch

---

#### **🧪 TEIL 0: VERCEL PRAXIS-TEST (30min - OPTIONAL, aber empfohlen)**

**Warum:** Verifizieren, dass die aktuelle Vercel Konfiguration nicht nur "auf dem Papier" gut aussieht, sondern auch wirklich funktioniert.

**Test-Szenarien:**
1. [ ] **Build Test:** Deployment triggern und Build-Logs prüfen
   - Gehe zu Vercel → tailormp → Deployments
   - Click auf neuestes Deployment → "Redeploy"
   - Warte ~2-3min, prüfe ob Build erfolgreich
   - **Erwartung:** ✅ Build successful, keine Errors

2. [ ] **Live URL Test:** Deployed App im Browser öffnen
   - Öffne `https://tailormp.vercel.app`
   - **Check Homepage:** Lädt korrekt?
   - **Check Navigation:** Links funktionieren?
   - **Check Products Page:** Zeigt Produkte an?
   - **Erwartung:** App läuft, nutzt aber noch Development DB

3. [ ] **Environment Variables Test:** Verifizieren dass Secrets korrekt geladen werden
   - Login auf deployed App versuchen
   - Falls Login funktioniert → Supabase Connection works ✅
   - Falls Fehler → Environment Variables prüfen

4. [ ] **Performance Test:** Lighthouse Score auf Production URL
   - Öffne Chrome DevTools → Lighthouse
   - Run Audit auf `https://tailormp.vercel.app`
   - **Erwartung:** Ähnliche Scores wie lokal (100/96/96/100)

**Falls Probleme auftreten:**
- Screenshot von Error machen
- Build Logs kopieren
- Claude fragen: "Praxis-Test zeigt Error X, was tun?"

**Falls alles funktioniert:**
- ✅ Vercel Config ist production-ready!
- ✅ Weiter mit TEIL 1 (Supabase Production)

---

#### **📋 DETAILLIERTE CHECKLIST - Siehe separates Dokument**

Für die vollständige Step-by-Step Anleitung für Production Setup:

👉 **[PRODUCTION_SETUP_CHECKLIST.md](PRODUCTION_SETUP_CHECKLIST.md)** 👈

**Die Checklist enthält:**
- ✅ 5 Phasen mit genauen Anweisungen
- ✅ Phase 1: Supabase Production (30 min)
- ✅ Phase 2: Stripe Live Mode (45 min inkl. Wartezeit)
- ✅ Phase 3: Database Migration (20 min)
- ✅ Phase 4: Vercel Config Update (15 min)
- ✅ Phase 5: Production Testing (30 min)
- ✅ Troubleshooting Guide
- ✅ Credentials Template zum Ausfüllen
- ✅ Security Checklist

**Quick Overview der 5 Phasen:**

#### **PHASE 1: Supabase Production (30 min)**
- Neues Supabase Project "tailormarket-production" erstellen
- Region: Frankfurt (DSGVO Compliance)
- Production Credentials holen (URL, anon_key, service_role_key)
- Database Connection String erstellen

#### **PHASE 2: Stripe Live Mode (45 min)**
- Stripe Account aktivieren (Business Details, Ausweis Upload)
- Bank Account verbinden (IBAN für Payouts)
- Live API Keys holen (pk_live_..., sk_live_...)
- Production Webhook erstellen für `tailormp.vercel.app`
- ⏳ Wartezeit: 10-30min für Identity Verification

#### **PHASE 3: Database Migration (20 min)**
- Prisma Schema zu Production DB pushen
- RLS Policies verifizieren
- Optional: Seed Data für erste Produkte

#### **PHASE 4: Vercel Environment Variables Update (15 min)**
- 15 Environment Variables von Development → Production umstellen
- Supabase URLs & Keys updaten
- Stripe Test → Live Keys updaten
- App URLs localhost → tailormp.vercel.app
- Redeploy triggern (Fresh Build ohne Cache)

#### **PHASE 5: Production Testing (30 min)**
- Homepage, Login, Products testen
- **Echte Test-Zahlung** mit Stripe Live Mode (€1-5)
- Order erscheint in Dashboard?
- Email Notifications funktionieren?
- Database hat korrekte Daten?

---

**⚠️ KRITISCHE WARNINGS:**

🔴 **NIEMALS DEV KEYS IN PRODUCTION VERWENDEN!**
- Dev Keys haben zu viele Permissions → Sicherheitsrisiko
- Development Supabase ≠ Production Supabase
- Stripe Test Mode ≠ Live Mode

🔴 **STRIPE LIVE MODE = ECHTES GELD!**
- Test-Zahlungen mit echter Kreditkarte
- Beträge niedrig halten (€1-5)
- Geld kommt auf dein Bankkonto (2-7 Tage später)

🔴 **PRODUCTION DB SEPARATION WICHTIG!**
- Development DB für lokales Testen
- Production DB für echte User
- Nie dieselbe DB für beides nutzen!

---

**Vorbereitung für Production Setup Session:**

**Bereithalten:**
- [ ] Stripe Dashboard offen: [dashboard.stripe.com](https://dashboard.stripe.com)
- [ ] Supabase Dashboard offen: [supabase.com/dashboard](https://supabase.com/dashboard)
- [ ] Vercel Dashboard offen: [vercel.com/dashboard](https://vercel.com/dashboard)
- [ ] Ausweis/Reisepass (Stripe Verification)
- [ ] Kreditkarte (Test-Zahlung)
- [ ] Bank IBAN (Stripe Payouts)
- [ ] 2-3 Stunden Zeit (mit Pausen)
- [ ] Notepad für Credentials (oder Password Manager)

**Geschätzte Zeit mit optimierter Checklist:**
- Vercel Praxis-Test: 30min (optional)
- Supabase Production: 30min
- Stripe Live Mode: 45min (inkl. Wartezeit)
- Database Migration: 20min
- Vercel Config Update: 15min
- Production Testing: 30min

**Total: ~2-3h** (statt vorher 5-6h dank vorbereiteter Checklist!)

**Parallel-Arbeit möglich:**
- Während Stripe Verification wartet → Database Migration machen
- Während DNS Propagation wartet → Andere Checks durchführen

---

### [ ] 8.8 Monitoring & Error Tracking

**Status:** [ ] Todo
**Dauer:** 2h
**Priority:** 🟡 HOCH (kann nach Launch nachgezogen werden)
**Arbeitsanteil:** Du: 40% | Claude: 60%

**Beschreibung:**
Monitoring und Error Tracking einrichten für Production. Hilft Fehler schnell zu erkennen und zu fixen.

---

#### **🔍 SENTRY SETUP (1h - DU + CLAUDE)**

**Schritt-für-Schritt:**
1. [ ] Gehe zu [sentry.io/signup](https://sentry.io/signup)
2. [ ] Erstelle Account (Free Tier: 5K Events/Monat)
3. [ ] Erstelle neues Projekt: "TailorMarket"
4. [ ] Platform: Next.js
5. [ ] **Kopiere DSN** → `NEXT_PUBLIC_SENTRY_DSN`
6. [ ] CLAUDE installiert Sentry SDK:
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```
7. [ ] CLAUDE konfiguriert:
   - Frontend Error Tracking
   - Backend Error Tracking
   - Performance Monitoring
   - Source Maps Upload
8. [ ] Test: Error provozieren und in Sentry Dashboard prüfen

**Sentry Features aktivieren:**
- [ ] Error Grouping (automatisch)
- [ ] Release Tracking (Git Integration)
- [ ] Email Alerts für Critical Errors
- [ ] Slack Integration (optional)

---

#### **📊 VERCEL ANALYTICS (15min - DU)**

**Schritt-für-Schritt:**
1. [ ] Gehe zu Vercel Dashboard → dein Projekt
2. [ ] Analytics Tab → "Enable Analytics"
3. [ ] Fertig! (automatisch aktiviert)

**Features:**
- Page Views
- Unique Visitors
- Top Pages
- Real User Monitoring (Core Web Vitals)

---

#### **⏰ UPTIME MONITORING (30min - DU)**

**Option A: UptimeRobot (Free)**
1. [ ] Gehe zu [uptimerobot.com](https://uptimerobot.com)
2. [ ] Erstelle Account
3. [ ] Klicke "Add New Monitor"
   - Monitor Type: HTTP(s)
   - URL: `https://deine-app.vercel.app`
   - Monitoring Interval: 5 minutes
4. [ ] Email Alert einrichten
5. [ ] Optional: Slack/Discord Webhook

**Option B: Vercel Built-in Monitoring**
- Already included in Vercel Dashboard!
- Zeigt Deployment Status, Errors, Performance

---

#### **🗄️ DATABASE MONITORING (15min - CLAUDE)**

**Supabase Built-in:**
- [ ] Gehe zu Supabase Dashboard → Database
- [ ] Enable "Database Webhooks" für kritische Events
- [ ] Monitor: Query Performance, Connections, Storage

**Alerts einrichten:**
- [ ] Disk Usage > 80%
- [ ] Connection Pool > 90%
- [ ] Slow Queries > 5s

---

### [ ] 8.9 Analytics & DSGVO

**Status:** [ ] Todo
**Dauer:** 1-2h
**Priority:** 🟢 MITTEL (kann nach Launch nachgezogen werden)
**Arbeitsanteil:** Du: 50% | Claude: 50%

**Beschreibung:**
Privacy-freundliche Analytics + Cookie Consent für DSGVO-Konformität.

---

#### **📈 ANALYTICS SETUP (45min - DU + CLAUDE)**

**Option A: Plausible (DSGVO-konform, empfohlen)**
1. [ ] Gehe zu [plausible.io](https://plausible.io) (€9/Monat)
2. [ ] Erstelle Account
3. [ ] Add Site: `tailormarket.com`
4. [ ] **Kopiere Script Snippet**
5. [ ] CLAUDE fügt Script in `app/layout.tsx` ein
6. [ ] Test: Eigene Besuche in Plausible Dashboard prüfen

**Option B: Vercel Analytics (bereits aktiviert)**
- Nutze nur Vercel Analytics (ausreichend für Start)

**Custom Events tracken:**
- [ ] Product View
- [ ] Add to Cart
- [ ] Checkout Started
- [ ] Order Completed
- [ ] Review Submitted

---

#### **🍪 COOKIE CONSENT (45min - CLAUDE)**

**WICHTIG für DSGVO:**
1. [ ] CLAUDE installiert Cookie Consent Library:
   ```bash
   npm install react-cookie-consent
   ```
2. [ ] CLAUDE erstellt Cookie Banner Component
3. [ ] CLAUDE integriert in `app/layout.tsx`
4. [ ] Banner Inhalt:
   - "Diese Website nutzt Cookies für Analytics"
   - "Akzeptieren" Button
   - "Ablehnen" Button
   - Link zu Datenschutzerklärung

**Cookie Categories:**
- [ ] Essentiell (immer aktiv): Auth, Session
- [ ] Analytics (optional): Plausible, Vercel
- [ ] Marketing (optional): none

---

#### **📄 DATENSCHUTZ UPDATE (30min - DU + CLAUDE)**

1. [ ] CLAUDE erstellt Cookie Policy in `/datenschutz` (falls nicht vorhanden)
2. [ ] DU prüfst Legal Requirements:
   - [ ] Cookie-Liste vollständig
   - [ ] Analytics Provider erwähnt
   - [ ] Widerrufsrecht erklärt
   - [ ] Kontakt-Email korrekt

---

### [ ] 8.10 Database Seeding (Production)

**Status:** [ ] Todo
**Dauer:** 1h
**Priority:** 🟢 NIEDRIG (optional für Launch)
**Arbeitsanteil:** Du: 20% | Claude: 80%

**Beschreibung:**
Demo-Daten in Production Database für bessere User Experience beim Launch.

---

#### **DEMO CONTENT (CLAUDE erstellt)**

**Demo Tailor Accounts:**
- [ ] 3-5 Demo Tailors mit vollständigen Profilen
  - Name, Bio, Country, Languages
  - Years Experience, Specialties
  - Portfolio Images (mindestens 3 pro Tailor)
  - Rating & Reviews (von Demo Customers)

**Demo Products:**
- [ ] 10-15 Demo Products
  - Mix: Anzüge, Hemden, Hosen, Kleider
  - Verschiedene Preisklassen (€50 - €500)
  - Hochwertige Stock Images
  - Detaillierte Descriptions
  - Verschiedene Categories

**Demo Reviews:**
- [ ] 5-10 Reviews pro Top-Product
  - Mix: 4-5 Sterne
  - Realistische deutsche Texte
  - Verschiedene Dates

---

#### **SEED SCRIPT (CLAUDE)**

```bash
# CLAUDE erstellt:
npx tsx scripts/seed-production.ts
```

**Script Features:**
- [ ] Prüft ob Production DB leer ist
- [ ] Erstellt Demo Users (Tailors + Customers)
- [ ] Erstellt Demo Products mit Images
- [ ] Erstellt Demo Reviews
- [ ] Erstellt Demo Orders (in Status "completed")
- [ ] Idempotent (kann mehrfach ausgeführt werden)

**DU musst:**
- [ ] Production Database Connection String bereitstellen
- [ ] Seed Execution bestätigen

---

### [ ] 8.11 Documentation

**Status:** [ ] Todo
**Dauer:** 2h
**Priority:** 🟢 NIEDRIG (kann schrittweise gemacht werden)
**Arbeitsanteil:** Du: 30% | Claude: 70%

**Beschreibung:**
Dokumentation für Entwickler und User erstellen.

---

#### **README.md (30min - CLAUDE)**

- [ ] Project Overview
- [ ] Tech Stack (Next.js, Supabase, Stripe, Resend)
- [ ] Features Liste
- [ ] Getting Started (Development Setup)
- [ ] Environment Variables
- [ ] Scripts (`npm run dev`, `build`, `test:e2e`)
- [ ] Project Structure
- [ ] Contributing Guidelines (optional)

---

#### **DEPLOYMENT_GUIDE.md (30min - CLAUDE)**

- [ ] Vercel Deployment Steps
- [ ] Environment Variables Setup
- [ ] Supabase Production Setup
- [ ] Stripe Live Mode Setup
- [ ] Database Migration
- [ ] Resend Domain Verification
- [ ] Testing Checklist
- [ ] Rollback Strategy

---

#### **API_DOCUMENTATION.md (45min - CLAUDE)**

**Dokumentierte Endpoints:**
- Auth: `/api/auth/*`
- Products: `/api/products/*`
- Orders: `/api/orders/*`
- Checkout: `/api/checkout/*`
- Tailor: `/api/tailor/*`

**Format:**
```markdown
## POST /api/auth/register

**Request:**
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "role": "customer"
}

**Response (201):**
{
  "user": { "id": "...", "email": "...", "role": "..." },
  "message": "Registrierung erfolgreich"
}

**Errors:**
- 400: Validation Error
- 422: Invalid Input
- 500: Server Error
```

---

#### **USER_GUIDE.md für Tailors (15min - DU + CLAUDE)**

- [ ] Wie registriere ich mich als Tailor?
- [ ] Wie erstelle ich ein Produkt?
- [ ] Wie lade ich Portfolio-Bilder hoch?
- [ ] Wie verwalte ich Bestellungen?
- [ ] Wie aktualisiere ich Order Status?
- [ ] Wie funktioniert die Auszahlung?

---

### [ ] 8.12 Final Testing & Soft Launch

**Status:** [ ] Todo
**Dauer:** 2-3h
**Priority:** 🔴 KRITISCH - LETZTER SCHRITT VOR LIVE
**Arbeitsanteil:** Du: 80% | Claude: 20%

**Beschreibung:**
Finaler Test in Production Environment. ERST nach diesem Schritt ist die App ready für echte User!

---

#### **🧪 PRODUCTION SMOKE TESTS (1h - DU)**

**Kompletter User Flow als Customer:**
1. [ ] Registrierung als Customer
   - Email erhalten? ✅
   - Login funktioniert? ✅
2. [ ] Browse Products
   - Alle Images laden? ✅
   - Filtering funktioniert? ✅
3. [ ] Product Detail
   - Reviews angezeigt? ✅
   - Add to Cart? ✅
4. [ ] Measurement
   - QR Code scannen (Mock)? ✅
   - Measurements gespeichert? ✅
5. [ ] Checkout
   - Stripe öffnet korrekt? ✅
   - **ECHTE ZAHLUNG (€1-5)**? ✅
   - Redirect zu Success? ✅
   - Confirmation Email? ✅
6. [ ] Order Dashboard
   - Order angezeigt? ✅
   - Details korrekt? ✅

**Kompletter User Flow als Tailor:**
1. [ ] Registrierung als Tailor
   - Tailor Profile erstellt? ✅
   - Email erhalten? ✅
2. [ ] Profile Setup
   - Bio + Portfolio Images? ✅
   - Speichern funktioniert? ✅
3. [ ] Product erstellen
   - Image Upload? ✅
   - Product live? ✅
4. [ ] Order Management
   - Test-Order sichtbar? ✅
   - Status Update? ✅
   - Customer Email versendet? ✅

---

#### **📱 MOBILE TESTING (30min - DU)**

**Teste auf echten Geräten:**
- [ ] iPhone/Android: Navigation
- [ ] iPhone/Android: Forms (Login, Register)
- [ ] iPhone/Android: Checkout Flow
- [ ] iPhone/Android: Image Upload (Tailor)
- [ ] iPhone/Android: Performance (< 3s Load)

---

#### **⚡ PERFORMANCE CHECK (15min - DU + CLAUDE)**

**Lighthouse Audit auf Production URL:**
1. [ ] Öffne Chrome DevTools → Lighthouse
2. [ ] Run Audit (Mobile + Desktop)
3. [ ] Ziele:
   - Performance: > 80 ✅
   - Accessibility: > 90 ✅
   - Best Practices: > 90 ✅
   - SEO: > 90 ✅

**Falls Scores niedrig:**
- [ ] CLAUDE optimiert Critical Issues
- [ ] Re-Test

---

#### **🔒 SECURITY SCAN (30min - OPTIONAL)**

**Quick Security Check:**
- [ ] HTTPS überall aktiv? ✅
- [ ] Keine Secrets in Client-Code? ✅
- [ ] CSP Headers aktiv? ✅
- [ ] Rate Limiting funktioniert? ✅
- [ ] SQL Injection geschützt (Prisma)? ✅
- [ ] XSS geschützt (React)? ✅

**Tools (optional):**
- [ ] OWASP ZAP Scan
- [ ] Snyk Security Scan
- [ ] npm audit

---

#### **🚀 SOFT LAUNCH (1-2 Tage - DU)**

**Invite-Only Beta:**
1. [ ] Invite 5-10 Test-User
   - Mix: Customers + Tailors
   - Freunde/Familie/Bekannte
2. [ ] Bitte um Feedback:
   - Bugs melden
   - UX Feedback
   - Feature Requests
3. [ ] Bug Fixes (Critical/High)
4. [ ] Re-Test

**Nach 1-2 Tagen:**
- [ ] Alle Critical Bugs gefixt? ✅
- [ ] Payments funktionieren? ✅
- [ ] Emails kommen an? ✅
- [ ] Performance OK? ✅
- [ ] **READY FOR PUBLIC LAUNCH!** 🎉

---

**GO/NO-GO Checklist:**
- [ ] ✅ Production Environment Setup komplett
- [ ] ✅ Alle Critical Bugs gefixt
- [ ] ✅ Stripe Payments funktionieren (Live Mode)
- [ ] ✅ Emails werden versendet
- [ ] ✅ Performance > 80 (Lighthouse)
- [ ] ✅ Mobile funktioniert
- [ ] ✅ Soft Launch erfolgreich (5+ Test-User)
- [ ] ✅ Monitoring aktiv (Sentry/Vercel)
- [ ] ✅ Backup Strategy vorhanden

**Wenn alle Checks ✅ → LAUNCH! 🚀**

---

### ✅ MEILENSTEIN 8 ERREICHT

- [x] **MVP DEPLOYED & LIVE! 🎉**
- **→ Post-MVP Features & Iteration**

---

## 🚀 PHASE 9: POST-MVP FEATURES & ENHANCEMENTS

Nach dem Launch - Features zur Verbesserung von UX, Trust & Business Growth.

---

## 🔥 CRITICAL FEATURES (vor/kurz nach Launch)

### [ ] 9.1 Password Reset Flow

**Status:** [ ] Todo
**Dauer:** 2-3h
**Priority:** 🔴 KRITISCH
**Arbeitsanteil:** Du: 20% | Claude: 80%

**Beschreibung:**
Users können Passwort zurücksetzen wenn sie es vergessen haben.

**Implementation:**
- [ ] "Forgot Password?" Link auf Login Page
- [ ] `/forgot-password` Page mit Email Input
- [ ] API Route: `/api/auth/forgot-password`
  - Generate Reset Token (UUID)
  - Save Token in Database (expires in 24h)
  - Send Email mit Reset Link
- [ ] `/reset-password` Page mit Token Validation
- [ ] API Route: `/api/auth/reset-password`
  - Validate Token
  - Update Password
  - Invalidate Token
- [ ] Email Template: Password Reset

**Supabase Integration:**
- [ ] Nutze Supabase Auth Reset Password Flow
- [ ] Email Template in Supabase konfigurieren

**Testing:**
- [ ] Forgot Password Flow testen
- [ ] Token Expiration testen
- [ ] Invalid Token Error Handling

---

### [ ] 9.2 Email Verification

**Status:** [ ] Todo
**Dauer:** 2h
**Priority:** 🔴 KRITISCH (Security)
**Arbeitsanteil:** Du: 20% | Claude: 80%

**Beschreibung:**
Neue User müssen Email verifizieren bevor sie bestellen können.

**Implementation:**
- [ ] Supabase Email Confirmation aktivieren
- [ ] Verification Email Template konfigurieren
- [ ] `/verify-email` Page (nach Registrierung)
- [ ] "Resend Verification Email" Button
- [ ] Middleware: Block Orders ohne verified Email
- [ ] UI: Badge "Email not verified" im Header
- [ ] Redirect zu `/verify-email` bei Order Attempt

**Supabase Config:**
- [ ] Enable Email Confirmation in Auth Settings
- [ ] Customize Email Template
- [ ] Set Redirect URL nach Verification

**Testing:**
- [ ] Registrierung → Email empfangen?
- [ ] Click Verification Link → Redirect?
- [ ] Resend Email funktioniert?
- [ ] Unverified User kann nicht bestellen?

---

### [ ] 9.3 Rate Limiting für alle API Routes

**Status:** [ ] Todo
**Dauer:** 2h
**Priority:** 🟡 HOCH (Security)
**Arbeitsanteil:** Du: 10% | Claude: 90%

**Beschreibung:**
Erweitere Rate Limiting auf alle kritischen API Routes.

**Bereits implementiert:**
- [x] `/api/auth/register` - 3 requests/hour
- [x] `/api/auth/login` - bereits implementiert

**Noch zu schützen:**
- [ ] `/api/products` - 100 requests/minute
- [ ] `/api/orders` - 30 requests/minute
- [ ] `/api/reviews` - 10 requests/minute (create)
- [ ] `/api/checkout/session` - 10 requests/minute
- [ ] `/api/tailor/products` - 20 requests/minute (create/update)
- [ ] `/api/upload/*` - 5 requests/minute

**Implementation:**
- [ ] Erweitere `rateLimitMiddleware.ts`
- [ ] Add neue Rate Limit Configs in `rateLimit.ts`
- [ ] Apply to alle API Routes
- [ ] Return 429 Too Many Requests
- [ ] Add Retry-After Header

**Testing:**
- [ ] Spam Requests → 429 Error?
- [ ] Normal Usage → kein Rate Limit?
- [ ] IP-based Limiting funktioniert?

---

## ⭐ HIGH IMPACT FEATURES (Quick Wins)

### [ ] 9.4 Product Search & Filtering

**Status:** [ ] Todo
**Dauer:** 2-3h
**Priority:** ⭐⭐⭐ HOCH (UX)
**Arbeitsanteil:** Du: 30% | Claude: 70%

**Beschreibung:**
Search Bar + Filter für bessere Product Discovery.

**Features:**
- [ ] Search Bar auf `/products` Page
  - Durchsuche: Title, Description, Tailor Name
  - Real-time Search (debounced)
- [ ] Filter Sidebar:
  - [ ] Kategorie (Anzüge, Hemden, Hosen, Kleider)
  - [ ] Preis Range (Slider €0-€1000)
  - [ ] Schneider (Multi-Select)
  - [ ] Rating (min. 4 Sterne, etc.)
- [ ] Sort Options:
  - [ ] Preis: Low to High
  - [ ] Preis: High to Low
  - [ ] Rating: High to Low
  - [ ] Neueste zuerst
- [ ] "X Results found" Counter
- [ ] "Clear Filters" Button

**Implementation:**
- [ ] Update `/api/products` Route:
  - Add query params: `search`, `category`, `minPrice`, `maxPrice`, `tailorId`, `minRating`, `sort`
  - Add WHERE clauses für Filter
  - Add ORDER BY für Sorting
- [ ] Create `ProductFilters` Component
- [ ] Create `SearchBar` Component
- [ ] Update `products/page.tsx`
- [ ] URL Query Params (sharable Filter Links)

**Testing:**
- [ ] Search funktioniert?
- [ ] Filter kombinierbar?
- [ ] Sorting funktioniert?
- [ ] URLParams persistent?

---

### [ ] 9.5 Order Tracking Timeline

**Status:** [ ] Todo
**Dauer:** 1.5-2h
**Priority:** ⭐⭐ MITTEL-HOCH (UX)
**Arbeitsanteil:** Du: 20% | Claude: 80%

**Beschreibung:**
Visual Timeline auf Order Detail Page für bessere Order Transparency.

**Features:**
- [ ] Timeline Component mit 4 Steps:
  1. Bezahlt ✅
  2. Maßprüfung (measuring)
  3. Produktion (production)
  4. Versandt (shipping) → Zugestellt (completed)
- [ ] Active Step highlighted
- [ ] Completed Steps: Green Checkmark
- [ ] Current Step: Blue Spinner/Badge
- [ ] Future Steps: Gray
- [ ] Timestamps für jeden Step
- [ ] Tracking Number anzeigen (wenn vorhanden)

**Implementation:**
- [ ] Create `OrderTimeline` Component
- [ ] Map Order Status → Timeline Steps
- [ ] Add to `/orders/[id]` Page
- [ ] Responsive Design (Mobile: Vertical Timeline)

**Testing:**
- [ ] Verschiedene Status anzeigen korrekt?
- [ ] Timestamps richtig?
- [ ] Mobile Layout gut?

---

### [ ] 9.6 Product Image Gallery

**Status:** [ ] Todo
**Dauer:** 2-3h
**Priority:** ⭐⭐ MITTEL (Conversion)
**Arbeitsanteil:** Du: 30% | Claude: 70%

**Beschreibung:**
Multiple Images pro Produkt statt nur 1 Image.

**Features:**
- [ ] Upload bis zu 5 Images pro Product (Tailor)
- [ ] Main Image + Thumbnail Gallery
- [ ] Image Carousel auf Product Detail Page
- [ ] Zoom on Hover (Desktop)
- [ ] Swipe on Mobile
- [ ] Image Order ändern (Tailor Dashboard)

**Database:**
- [ ] `ProductImage` Model bereits vorhanden!
- [ ] Relation: Product → many ProductImages

**Implementation:**
- [ ] Update `/tailor/products/new` & `/tailor/products/[id]/edit`:
  - Multi-Image Upload (bis zu 5)
  - Image Preview mit Delete Button
  - Drag & Drop Reordering
- [ ] Update `/products/[id]`:
  - Image Gallery Component
  - Thumbnail Navigation
  - Lightbox/Zoom Feature
- [ ] API Route: `/api/upload/product-images` (multi-upload)

**Testing:**
- [ ] Upload 5 Images?
- [ ] Gallery Navigation?
- [ ] Mobile Swipe?
- [ ] Image Delete?

---

### [ ] 9.7 Favorites / Wishlist

**Status:** [ ] Todo
**Dauer:** 2-3h
**Priority:** ⭐ MITTEL (Engagement)
**Arbeitsanteil:** Du: 20% | Claude: 80%

**Beschreibung:**
User können Products zu Favorites hinzufügen.

**Features:**
- [ ] Heart Icon auf ProductCard
- [ ] Toggle Favorite (filled/outlined heart)
- [ ] `/favorites` Page mit Favorite Products
- [ ] Remove from Favorites
- [ ] Empty State: "No favorites yet"
- [ ] Counter im Header: "5 Favorites"

**Database:**
- [ ] `Favorite` Model:
  ```prisma
  model Favorite {
    id        String   @id @default(cuid())
    userId    String
    productId String
    createdAt DateTime @default(now())
    user      User     @relation(fields: [userId], references: [id])
    product   Product  @relation(fields: [productId], references: [id])
    @@unique([userId, productId])
  }
  ```

**Implementation:**
- [ ] Prisma Schema Update
- [ ] Migration: `prisma db push`
- [ ] API Routes:
  - POST `/api/favorites` - Add to Favorites
  - DELETE `/api/favorites/[id]` - Remove
  - GET `/api/favorites` - Get User Favorites
- [ ] `FavoriteButton` Component (Heart Icon)
- [ ] `/favorites` Page
- [ ] Add to ProductCard
- [ ] Add to Product Detail Page

**Testing:**
- [ ] Add to Favorites?
- [ ] Remove from Favorites?
- [ ] Favorites Page angezeigt?
- [ ] Auth Required?

---

## 📊 BUSINESS FEATURES

### [ ] 9.8 Admin Dashboard

**Status:** [ ] Todo
**Dauer:** 4-5h
**Priority:** ⭐⭐⭐ HOCH (Business Insights)
**Arbeitsanteil:** Du: 30% | Claude: 70%

**Beschreibung:**
Admin Dashboard für Platform Management & Analytics.

**Features:**
- [ ] Overview Page (`/admin/dashboard`):
  - Total Revenue (letzte 30 Tage)
  - Total Orders (letzte 30 Tage)
  - Active Users (Customer + Tailors)
  - Top Tailors (by Revenue)
  - Recent Orders (letzte 10)
- [ ] Charts:
  - Revenue over Time (Line Chart)
  - Orders over Time (Bar Chart)
  - Top Products (Pie Chart)
- [ ] User Management (`/admin/users`):
  - User List (Customer + Tailors)
  - Search Users
  - Ban/Unban User
  - Delete User (+ all data)
- [ ] Product Moderation (`/admin/products`):
  - Flag inappropriate Products
  - Approve/Reject new Products
  - Delete Products

**Database:**
- [ ] Add `role` field to User: `customer | tailor | admin`
- [ ] Migration: Set your User to `admin`

**Implementation:**
- [ ] Middleware: Check Admin Role
- [ ] API Routes:
  - GET `/api/admin/stats` - Dashboard Stats
  - GET `/api/admin/users` - User List
  - PATCH `/api/admin/users/[id]` - Ban/Unban
  - DELETE `/api/admin/users/[id]` - Delete User
  - GET `/api/admin/products` - Product List
  - DELETE `/api/admin/products/[id]` - Delete Product
- [ ] Charts Library: `recharts` oder `chart.js`
- [ ] Admin Layout mit Sidebar
- [ ] Protected Routes (Admin only)

**Testing:**
- [ ] Only Admin can access?
- [ ] Stats korrekt?
- [ ] Charts angezeigt?
- [ ] User Management funktioniert?

---

### [ ] 9.9 Tailor Payout Dashboard

**Status:** [ ] Todo
**Dauer:** 4-5h
**Priority:** ⭐⭐⭐ HOCH (Tailor Satisfaction)
**Arbeitsanteil:** Du: 40% | Claude: 60%

**Beschreibung:**
Tailors sehen ihre Earnings & können Payouts anfordern.

**Features:**
- [ ] Earnings Overview (`/tailor/earnings`):
  - Total Earnings (All Time)
  - Available Balance (nicht ausgezahlt)
  - Pending Payouts
  - Last Payout Date & Amount
- [ ] Transaction History:
  - Liste aller Orders mit Earnings
  - Status: Paid, Pending, Payout Requested
  - Filter by Date Range
- [ ] Payout Request:
  - Button "Request Payout" (nur wenn Balance > €50)
  - Payout Method: Bank Transfer (IBAN)
  - Status: Pending → Processed
- [ ] Admin Approval:
  - Admin sieht Payout Requests
  - Approve/Reject
  - Mark as Paid

**Database:**
- [ ] `Payout` Model:
  ```prisma
  model Payout {
    id        String   @id @default(cuid())
    tailorId  String
    amount    Float
    status    String   @default("pending") // pending, approved, paid, rejected
    iban      String
    requestedAt DateTime @default(now())
    processedAt DateTime?
    tailor    Tailor   @relation(fields: [tailorId], references: [id])
  }
  ```

**Implementation:**
- [ ] Prisma Schema Update
- [ ] Migration
- [ ] API Routes:
  - GET `/api/tailor/earnings` - Earnings Stats
  - GET `/api/tailor/payouts` - Payout History
  - POST `/api/tailor/payouts` - Request Payout
  - GET `/api/admin/payouts` - All Payouts (Admin)
  - PATCH `/api/admin/payouts/[id]` - Approve/Reject (Admin)
- [ ] `/tailor/earnings` Page
- [ ] Payout Request Modal
- [ ] Admin Payout Management Page

**Later: Stripe Connect Integration**
- [ ] Automated Payouts via Stripe Connect
- [ ] Direct Bank Transfer

**Testing:**
- [ ] Earnings berechnet korrekt?
- [ ] Payout Request funktioniert?
- [ ] Admin Approval?
- [ ] Email Notification bei Payout?

---

### [ ] 9.10 Notifications System

**Status:** [ ] Todo
**Dauer:** 5-6h
**Priority:** ⭐⭐ MITTEL-HOCH (Engagement)
**Arbeitsanteil:** Du: 20% | Claude: 80%

**Beschreibung:**
In-App Notifications für wichtige Events.

**Features:**
- [ ] Bell Icon im Header mit Badge (Unread Count)
- [ ] Notification Dropdown:
  - Letzte 10 Notifications
  - Mark as Read
  - "See all" Link
- [ ] `/notifications` Page:
  - Alle Notifications
  - Filter: Unread, All
  - Pagination
- [ ] Notification Types:
  - New Order (Tailor)
  - Order Status Update (Customer)
  - New Review (Tailor)
  - Payout Approved (Tailor)
  - Product Approved (Tailor, wenn Moderation aktiv)

**Database:**
- [ ] `Notification` Model:
  ```prisma
  model Notification {
    id        String   @id @default(cuid())
    userId    String
    type      String   // order_new, order_status, review_new, payout_approved
    title     String
    message   String
    link      String?  // URL to related resource
    read      Boolean  @default(false)
    createdAt DateTime @default(now())
    user      User     @relation(fields: [userId], references: [id])
  }
  ```

**Implementation:**
- [ ] Prisma Schema Update
- [ ] Migration
- [ ] API Routes:
  - GET `/api/notifications` - Get User Notifications
  - PATCH `/api/notifications/[id]/read` - Mark as Read
  - PATCH `/api/notifications/mark-all-read` - Mark All
- [ ] Helper Function: `createNotification(userId, type, data)`
- [ ] Trigger Notifications:
  - Nach Order Creation
  - Nach Order Status Update
  - Nach Review Creation
  - Nach Payout Approval
- [ ] `NotificationBell` Component (Header)
- [ ] `NotificationDropdown` Component
- [ ] `/notifications` Page

**Optional: Real-time (Pusher/Socket.io):**
- [ ] Real-time Notifications via WebSocket
- [ ] Push Notifications (Browser API)

**Testing:**
- [ ] Notifications erstellt?
- [ ] Badge Count korrekt?
- [ ] Mark as Read funktioniert?
- [ ] Links korrekt?

---

## 🎨 UX ENHANCEMENTS

### [ ] 9.11 Tailor Response Time Badge

**Status:** [ ] Todo
**Dauer:** 1h
**Priority:** ⭐ NIEDRIG (Trust Signal)
**Arbeitsanteil:** Du: 10% | Claude: 90%

**Beschreibung:**
Zeige "Antwortet in < 24h" Badge auf Tailor Profilen.

**Features:**
- [ ] Berechne Average Response Time:
  - Zeit zwischen Order Creation & erstem Status Update
  - Durchschnitt der letzten 10 Orders
- [ ] Badge auf Tailor Profile:
  - "⚡ Antwortet in < 24h" (green)
  - "📧 Antwortet in 1-3 Tagen" (yellow)
  - Kein Badge wenn > 3 Tage
- [ ] Badge auch auf TailorCard (Tailor Listing)

**Implementation:**
- [ ] Add `averageResponseTime` field to Tailor (calculated)
- [ ] Function: `calculateResponseTime(tailorId)`
- [ ] Cron Job: Update alle Tailors (daily)
- [ ] Badge Component
- [ ] Add to Tailor Profile & TailorCard

**Testing:**
- [ ] Response Time korrekt berechnet?
- [ ] Badge angezeigt?

---

### [ ] 9.12 Review Reply System

**Status:** [ ] Todo
**Dauer:** 3h
**Priority:** ⭐ NIEDRIG-MITTEL (Customer Service)
**Arbeitsanteil:** Du: 20% | Claude: 80%

**Beschreibung:**
Tailors können auf Reviews antworten.

**Features:**
- [ ] "Reply" Button auf Reviews (nur Tailor der gereviewed wurde)
- [ ] Reply Form (Textarea + Submit)
- [ ] Reply angezeigt unter Review
- [ ] Edit/Delete Reply (Tailor only)
- [ ] Email an Customer: "Tailor hat geantwortet"

**Database:**
- [ ] Add `reply` field to Review:
  ```prisma
  model Review {
    ...
    reply     String?
    repliedAt DateTime?
  }
  ```

**Implementation:**
- [ ] Migration
- [ ] API Route: PATCH `/api/reviews/[id]/reply`
  - Only Tailor can reply
  - Only to Reviews of their Products
- [ ] Update Review Display Component
- [ ] Reply Form Component
- [ ] Email Notification (optional)

**Testing:**
- [ ] Nur Tailor kann replyen?
- [ ] Reply gespeichert?
- [ ] Email versendet?

---

### [ ] 9.13 Product Variants (Sizes, Colors)

**Status:** [ ] Todo
**Dauer:** 5-6h
**Priority:** ⭐⭐ MITTEL (Scalability)
**Arbeitsanteil:** Du: 30% | Claude: 70%

**Beschreibung:**
Products mit Varianten (Size, Color) statt separate Products.

**Features:**
- [ ] Variant System:
  - Size: XS, S, M, L, XL, XXL
  - Color: Red, Blue, Black, White, etc.
  - Custom Fields (z.B. "Stoffart")
- [ ] Variant Selection im Checkout
- [ ] Inventory Tracking pro Variant
- [ ] Price per Variant (optional)

**Database:**
- [ ] `ProductVariant` Model:
  ```prisma
  model ProductVariant {
    id        String  @id @default(cuid())
    productId String
    size      String?
    color     String?
    sku       String? // Stock Keeping Unit
    price     Float?  // Optional variant price
    stock     Int     @default(0)
    product   Product @relation(fields: [productId], references: [id])
  }
  ```

**Implementation:**
- [ ] Prisma Schema Update
- [ ] Migration
- [ ] Update Product Create/Edit Forms:
  - Add Variants Section
  - Add/Remove Variants
  - Set Stock per Variant
- [ ] Update Product Detail Page:
  - Variant Selector (Dropdowns/Buttons)
  - Update Price when Variant selected
  - Check Stock availability
- [ ] Update Checkout:
  - Save selected Variant
  - Reduce Stock after Order
- [ ] API Routes for Variants

**Testing:**
- [ ] Variants erstellt?
- [ ] Selection funktioniert?
- [ ] Stock Tracking?
- [ ] Checkout mit Variant?

---

## 📝 POST-LAUNCH OPTIMIZATIONS

### [ ] 9.14 SEO Optimization

**Dauer:** 2-3h | **Priority:** 🟢 MITTEL

- [ ] Dynamic Meta Tags (Title, Description per Page)
- [ ] Open Graph Tags (Social Sharing)
- [ ] Structured Data (JSON-LD für Products, Reviews)
- [ ] Sitemap.xml generieren
- [ ] Robots.txt optimieren
- [ ] Alt Tags für alle Images

---

### [ ] 9.15 Performance Optimizations

**Dauer:** 3-4h | **Priority:** 🟢 MITTEL

- [ ] Image Optimization (WebP, Lazy Loading)
- [ ] Code Splitting (weitere Components)
- [ ] Database Query Optimization (N+1 Problem lösen)
- [ ] Redis Caching (Products, Tailors)
- [ ] CDN für Static Assets

---

### [ ] 9.16 Accessibility (A11Y)

**Dauer:** 3-4h | **Priority:** 🟢 MITTEL

- [ ] Keyboard Navigation testen
- [ ] Screen Reader Support
- [ ] ARIA Labels hinzufügen
- [ ] Color Contrast prüfen (WCAG AA)
- [ ] Focus States verbessern
- [ ] Skip Links hinzufügen

---

## 📊 FORTSCHRITT TRACKING

**Phasen Übersicht:**

- [x] Phase 1: Foundation (6/6 Steps) ✅
- [x] Phase 2: Authentication (7/7 Steps) ✅
- [x] Phase 3: Marketplace View (12/12 Steps) ✅
- [x] Phase 4: Measurement Provider Architecture (7/7 Steps) ✅
- [x] Phase 5: Checkout & Orders (12/12 Steps) ✅
- [x] Phase 6: Tailor Features (6/6 Steps) ✅
- [x] Phase 7: Reviews & Polish (8/12 Steps) ✅
- [~] Phase 8: Testing & Deployment (5/12 Steps) 🔄 **E2E: 100% | Performance: ⚡ | Emails: ✅**

**Gesamtfortschritt:** 63/79 Steps (79.7%)

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

**→ Phase 8.5: Final Polish Check**

Phase 8.4 (Performance Optimization) ist abgeschlossen! ⚡

**Completed in Phase 8:**
- ✅ Phase 8.1: Code Review & Bug Fixes
- ✅ Phase 8.2: Manual Testing (Automated Portion)
- ✅ Phase 8.3: E2E Test Setup (16/16 Tests passed - 100%)
- ✅ Phase 8.4: Performance Optimization (Build -58% faster!)

**Performance Improvements:**
- ⚡ Build Time: 67s → 28.3s (**-58% faster**)
- 📦 Bundle Size: ~215KB → ~170KB (**-21%**)
- 🚀 Database Composite Indexes für schnellere Queries
- 💨 Code Splitting (Lazy Load Reviews)
- 🔒 Enhanced Security Headers

Das MVP ist **feature-complete & performance-optimized**! Alle Kern-Features:
- ✅ Authentication & Authorization
- ✅ Product & Tailor Marketplace mit Advanced Filters
- ✅ Shopping Cart & Checkout (Stripe Integration)
- ✅ Order Management System
- ✅ Review System
- ✅ Measurement Tool (Mock/Manual Provider)
- ✅ Tailor Product Management
- ✅ **Performance Optimizations (NEU!)**

**Nächster Schritt: Phase 8.5 - Final Polish Check**
- Manual Browser Testing aller Features
- Bug-Erfassung & Priorisierung
- Console Error Check
- Mobile Responsiveness Check

**Quick Start Test:**
```bash
# Dev Server starten
npm run dev

# Öffne: http://localhost:3000
# Teste alle Features im Browser
```

**Dokumentation:**
- [PHASE8_PERFORMANCE_OPTIMIZATION.md](PHASE8_PERFORMANCE_OPTIMIZATION.md) - Performance Report
- [E2E_TEST_SUCCESS.md](E2E_TEST_SUCCESS.md) - E2E Test Results
- [PHASE8_CODE_REVIEW.md](PHASE8_CODE_REVIEW.md) - Code Review Report

---

**Version:** 2.1
**Letztes Update:** 2025-12-14
**Status:** Phase 8.6 Complete - Email Templates Ready! 📧 (63/79 Steps = 79.7%)
**Nächster Schritt:** Phase 8.5 - Final Polish Check (Manual QA) ODER Phase 8.7 - Production Setup

---

## ⚠️ KRITISCHE PRE-LAUNCH CHECKLISTE

**🔒 SICHERHEIT (ZWINGEND ERFORDERLICH):**

1. **Supabase Keys austauschen**
   - [ ] Production Project erstellen
   - [ ] Neue NEXT_PUBLIC_SUPABASE_URL
   - [ ] Neue NEXT_PUBLIC_SUPABASE_ANON_KEY
   - [ ] Neue SUPABASE_SERVICE_ROLE_KEY
   - [ ] ⚠️ Dev-Keys NIEMALS in Production!

2. **Stripe Production Setup**
   - [ ] Stripe Account verifizieren
   - [ ] Live Mode aktivieren
   - [ ] Production Keys generieren (STRIPE_SECRET_KEY, PUBLISHABLE_KEY)
   - [ ] Webhook Endpoint konfigurieren
   - [ ] Test-Payment durchführen
   - [ ] ⚠️ Test-Keys NIEMALS in Production!

**📋 Details siehe Phase 8.7 - Production Environment Setup**
