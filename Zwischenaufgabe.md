# 🚀 PHASE 7.5: PRE-DEPLOYMENT ESSENTIALS

**Status:** In Progress  
**Geschätzte Dauer:** 2-3 Tage (16h Development + Testing)  
**Ziel:** MVP production-ready machen

---

## 📋 ÜBERSICHT

Diese Phase schließt kritische Lücken zwischen Phase 7 und Phase 8.
Ohne diese Features ist die App NICHT production-ready!

**Was fehlt aktuell:**

- ❌ Email-Benachrichtigungen (User bekommen keine Bestätigungen!)
- ❌ DSGVO Cookie Consent (rechtlich erforderlich)
- ❌ Custom Error Pages (unprofessionell ohne)
- ❌ Rate Limiting (Security-Risiko)
- ❌ SEO Files (Google kann nicht crawlen)
- ❌ Route-Level Loading (schlechte UX)

---

## ✅ 7.5.1 EMAIL SYSTEM (SENDGRID)

**Status:** [ ] Todo  
**Dauer:** 4h (30min Setup + 3.5h Development)  
**Priority:** 🔴 KRITISCH

### Was wird gebaut:

- Email-Versand System via SendGrid
- 4 HTML Email-Templates
- Integration in bestehende Flows

### A) DEIN PART - Account Setup (30min)

**Schritt 1: SendGrid Account**

1. Gehe zu https://sendgrid.com/free
2. Sign up (Email + Passwort)
3. Email bestätigen
4. Plan wählen: **Free Plan** (100 emails/day)

**Schritt 2: API Key generieren**

1. Dashboard → Settings → API Keys
2. "Create API Key"
3. Name: "TailorMarket Production"
4. Permissions: **Full Access**
5. Copy Key (fängt an mit `SG.`)
6. **WICHTIG:** Sofort in Notizen speichern!

**Schritt 3: Sender Email verifizieren**

1. Settings → Sender Authentication
2. "Verify Single Sender"
3. Email: `noreply@yourdomain.com` (oder deine Gmail)
4. Complete Form
5. Verifizierungs-Email bestätigen

**Schritt 4: ENV Variable eintragen**

```bash
# In .env.local hinzufügen:
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

**Schritt 5: Dev-Server neu starten**

```bash
# STRG+C zum Stoppen
npm run dev
```

### B) CLAUDE CODE PART - Implementierung

**Prompt für Claude Code:**

```
Referenziere specs.md, ROADMAP.md und Claude.md.

AUFGABE: Implementiere Email-System mit SendGrid.

Installation:
npm install @sendgrid/mail

Dateien erstellen:

1. app/lib/email.ts
- sendEmail Function
- Error Handling
- TypeScript Types

2. app/lib/emailTemplates.ts
- welcomeEmail(userName, email)
- orderConfirmationEmail(order, user, product, tailor)
- orderStatusUpdateEmail(order, newStatus, trackingNumber?)
- reviewRequestEmail(order, product, tailor)

Alle Templates:
- Responsive HTML (Inline CSS)
- Professional Design (TailorMarket Branding)
- Clear CTAs
- Footer mit Unsubscribe Link

3. Integration:
- app/api/auth/register/route.ts: Nach User-Erstellung → welcomeEmail senden
- app/api/checkout/create-payment-intent/route.ts: Nach Order → orderConfirmationEmail
- app/api/orders/[id]/route.ts: Bei Status-Update → orderStatusUpdateEmail
- (reviewRequestEmail für später via Cron Job)

Halte dich an Claude.md Richtlinien!
```

### C) TESTING CHECKLIST

Nach Implementierung teste:

- [ ] Registrierung → Welcome Email erhalten?
- [ ] Bestellung → Order Confirmation Email?
- [ ] Status Update (als Tailor) → Status Email an Customer?
- [ ] Emails sehen professionell aus (HTML rendert korrekt)?
- [ ] Links in Emails funktionieren?
- [ ] SendGrid Dashboard zeigt Emails als "delivered"?

**Test-Email Adressen:**

- Deine echte Email (Gmail, etc.)
- https://mailtrap.io (Test Inbox)

---

## ✅ 7.5.2 DSGVO COOKIE CONSENT

**Status:** [ ] Todo  
**Dauer:** 2h  
**Priority:** 🔴 KRITISCH (rechtlich erforderlich in EU)

### Was wird gebaut:

- Cookie Consent Banner
- localStorage für Consent
- Plausible Analytics nur laden wenn akzeptiert

### A) DEIN PART

**Nichts! Claude Code macht alles.**

Optional: Datenschutzerklärung vorbereiten (oder später)

### B) CLAUDE CODE PART

**Prompt:**

```
Referenziere specs.md, ROADMAP.md und Claude.md.

AUFGABE: Implementiere DSGVO-konformen Cookie Consent Banner.

Installation:
npm install react-cookie-consent

Datei erstellen:
app/components/shared/CookieConsent.tsx

Features:
- Banner am unteren Bildschirmrand (Desktop) / Top (Mobile)
- Text: "Wir nutzen Plausible Analytics für anonyme Nutzungsstatistiken. Keine Cookies, keine Tracker, DSGVO-konform. Mit der Nutzung stimmst du der Datenverarbeitung zu."
- Buttons:
  - "Akzeptieren" (Primary)
  - "Ablehnen" (Secondary)
  - "Mehr erfahren" (Link zu /datenschutz)
- Consent speichern in localStorage: "cookie-consent"
- Nach 365 Tagen erneut fragen

Integration in app/layout.tsx:
- CookieConsent Component rendern
- Plausible Script nur laden wenn consent === "accepted"

Design:
- Clean, minimalistisch
- Nicht störend
- Mobile-optimiert

Halte dich an Claude.md Richtlinien!
```

### C) TESTING CHECKLIST

- [ ] Banner erscheint beim ersten Besuch?
- [ ] "Akzeptieren" → Banner verschwindet, Plausible lädt?
- [ ] "Ablehnen" → Banner verschwindet, Plausible lädt NICHT?
- [ ] Nach Reload: Banner erscheint nicht mehr (Consent gespeichert)?
- [ ] localStorage: "cookie-consent" vorhanden?
- [ ] "Mehr erfahren" Link funktioniert?

---

## ✅ 7.5.3 CUSTOM ERROR PAGES

**Status:** [ ] Todo  
**Dauer:** 1h  
**Priority:** 🟡 Wichtig (verbessert UX)

### Was wird gebaut:

- 404 Page (Not Found)
- Error Boundary (500 Errors)
- Global Error Handler

### A) DEIN PART

**Nichts!**

### B) CLAUDE CODE PART

**Prompt:**

```
Referenziere specs.md, ROADMAP.md und Claude.md.

AUFGABE: Erstelle Custom Error Pages.

Dateien:

1. app/not-found.tsx (404 Page)
- Icon: AlertCircle (lucide-react)
- Headline: "Seite nicht gefunden"
- Text: "Die gesuchte Seite existiert leider nicht."
- Button: "Zurück zur Startseite" (Link zu /)

2. app/error.tsx (Error Boundary)
- Props: error, reset
- Icon: AlertTriangle
- Headline: "Etwas ist schiefgelaufen"
- Text: error.message
- Button: "Erneut versuchen" (onClick: reset)
- Button: "Zur Startseite"

3. app/global-error.tsx (Global Errors)
- Wie error.tsx aber mit <html><body> Wrapper
- Fängt Errors im Root Layout

Design:
- Zentriert, max-w-md
- Clean, minimalistisch
- Slate-Theme Colors
- Friendly Tone (nicht technisch)

Alle mit TypeScript!
```

### C) TESTING CHECKLIST

- [ ] Gehe zu `/test123` → 404 Page?
- [ ] Werfe absichtlichen Error in Component → Error Boundary?
- [ ] "Zurück zur Startseite" funktioniert?
- [ ] "Erneut versuchen" triggert reset?
- [ ] Design passt zu restlicher App?

---

## ✅ 7.5.4 RATE LIMITING

**Status:** [ ] Todo  
**Dauer:** 3h (20min Setup + 2.5h Development)  
**Priority:** 🔴 KRITISCH (Security!)

### Was wird gebaut:

- Rate Limiting für API Routes
- Schutz vor Brute-Force Attacks
- IP-basiertes Limiting

### A) DEIN PART - Setup (20min)

**Option 1: Upstash Redis (Empfohlen für Production)**

1. https://upstash.com → Sign up
2. Create Database → Name: "tailormarket-ratelimit", Region: EU
3. Copy: REST URL + Token
4. .env.local:

```bash
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx
```

**Option 2: In-Memory (Einfach, nur für MVP)**

Nichts! Claude Code nutzt dann Map() im Memory.

**Wähle Option 2 für MVP, kannst später upgraden!**

### B) CLAUDE CODE PART

**Prompt:**

```
Referenziere specs.md, ROADMAP.md und Claude.md.

AUFGABE: Implementiere Rate Limiting für API Routes.

WICHTIG: Verwende In-Memory Lösung (Map), KEIN Upstash für MVP!

Dateien:

1. app/lib/rateLimit.ts
- rateLimit Function mit sliding window
- In-Memory Map für Tracking
- Config:
  - Login: 5 requests / 15min
  - Register: 3 requests / 1h
  - API (authenticated): 100 requests / 1min
  - API (anonymous): 10 requests / 1min

2. app/lib/middleware/rateLimitMiddleware.ts
- Middleware Wrapper für API Routes
- Extrahiert IP aus Request
- Calls rateLimit()
- Response 429 wenn limit exceeded

3. Integration in API Routes:
- app/api/auth/login/route.ts
- app/api/auth/register/route.ts
- app/api/tailors/route.ts (anon)
- app/api/products/route.ts (anon)

Response bei Limit:
{
  error: "Too many requests",
  retryAfter: 900 // seconds
}

TypeScript, Error Handling, Tests!
```

### C) TESTING CHECKLIST

- [ ] Login 6x mit falschen Daten → Nach 5x blockiert (429)?
- [ ] 15min warten → Limit resetted?
- [ ] Register 4x → Nach 3x blockiert?
- [ ] API Route ohne Auth: 11x call → Nach 10x blockiert?
- [ ] Mit Auth: Höheres Limit (100/min)?
- [ ] Response enthält retryAfter?

**Test-Tool:**

```bash
# Schnell mehrere Requests (Terminal):
for i in {1..10}; do curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"wrong"}'; done
```

---

## ✅ 7.5.5 SEO FILES

**Status:** [ ] Todo  
**Dauer:** 1h  
**Priority:** 🟡 Wichtig (für Google)

### Was wird gebaut:

- Dynamic Sitemap (XML)
- Robots.txt

### A) DEIN PART

**Nichts!**

### B) CLAUDE CODE PART

**Prompt:**

```
Referenziere specs.md, ROADMAP.md und Claude.md.

AUFGABE: Erstelle SEO Files.

Dateien:

1. app/sitemap.ts (Dynamic Sitemap)
- export default async function sitemap()
- Static Pages: /, /tailors, /products, /about, /how-it-works
- Dynamic Pages:
  - Fetch alle Tailors → /tailors/[id]
  - Fetch alle Products → /products/[id]
- Return array of:
  {
    url: 'https://tailormarket.com/tailors/123',
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8
  }

2. app/robots.ts
- export default function robots()
- Allow all crawlers
- Sitemap URL: https://tailormarket.com/sitemap.xml
- Disallow: /dashboard, /api, /.env

TypeScript!
```

### C) TESTING CHECKLIST

- [ ] http://localhost:3000/sitemap.xml lädt?
- [ ] Sitemap enthält alle Tailors?
- [ ] Sitemap enthält alle Products?
- [ ] http://localhost:3000/robots.txt lädt?
- [ ] Robots.txt blockiert /dashboard?
- [ ] XML ist valide (check: https://www.xml-sitemaps.com/validate-xml-sitemap.html)

---

## ✅ 7.5.6 LOADING PAGES

**Status:** [ ] Todo  
**Dauer:** 2h  
**Priority:** 🟡 Wichtig (bessere UX)

### Was wird gebaut:

- Route-Level Loading States
- Skeleton Screens für alle Hauptrouten

### A) DEIN PART

**Nichts!**

### B) CLAUDE CODE PART

**Prompt:**

```
Referenziere specs.md, ROADMAP.md und Claude.md.

AUFGABE: Erstelle Route-Level Loading Pages.

Dateien (alle mit Skeleton Screens):

1. app/(marketplace)/loading.tsx
- Container mit Hero Skeleton
- 3x Card Skeletons

2. app/(marketplace)/tailors/loading.tsx
- Header Skeleton
- Grid mit 12x TailorCard Skeletons

3. app/(marketplace)/products/loading.tsx
- Header Skeleton
- Grid mit 12x ProductCard Skeletons

4. app/(marketplace)/tailors/[id]/loading.tsx
- Profile Header Skeleton
- Tabs Skeleton
- Content Area Skeleton

5. app/(marketplace)/products/[id]/loading.tsx
- 2-Column Grid
- Image Skeleton + Details Skeleton

6. app/(customer-dashboard)/loading.tsx
- Sidebar + Content Skeleton

7. app/(tailor-dashboard)/loading.tsx
- Sidebar + Content Skeleton

Nutze:
- Tailwind animate-pulse
- bg-slate-200 für Skeleton
- Rounded corners
- Korrekte Proportionen (wie echte Cards)

TypeScript!
```

### C) TESTING CHECKLIST

- [ ] Navigate to /tailors → Skeleton vor Daten?
- [ ] Navigate to /products → Skeleton?
- [ ] Navigate to /tailors/[id] → Skeleton?
- [ ] Skeleton Design passt zu echten Cards?
- [ ] Animation smooth (pulse)?
- [ ] Keine Layout Shifts beim Laden?

**Test mit Throttling:**

- Chrome DevTools → Network → Slow 3G
- Navigate zwischen Seiten
- Skeleton sollte sichtbar sein!

---

## ✅ 7.5.7 FINAL POLISH CHECK

**Status:** [ ] Todo  
**Dauer:** 3h  
**Priority:** 🔴 KRITISCH (Quality Gate)

### A) DEIN PART - Manuelles Testing (3h)

**Checkliste durchgehen:**

#### Forms (alle!)

- [ ] Login Form: Error Handling, Loading State, Validation?
- [ ] Register Form: Error Handling, Loading, Password Match?
- [ ] Measurement Input: Validation, Multi-Step funktioniert?
- [ ] Product Form: Image Upload, Validierung?
- [ ] Review Form: Rating, Validierung?
- [ ] Checkout Form: Alle 5 Steps, Validation?

#### API Routes (stichprobenartig)

- [ ] POST /api/auth/login mit ungültigen Daten → 422?
- [ ] POST /api/products ohne Auth → 401?
- [ ] GET /api/tailors mit ungültiger ID → 404?
- [ ] Alle Responses haben Error Messages?

#### Empty States

- [ ] Keine Schneider gefunden → Empty State?
- [ ] Keine Produkte → Empty State?
- [ ] Keine Orders → Empty State?
- [ ] Keine Reviews → Empty State?
- [ ] Keine Measurements → Empty State?

#### Images

- [ ] Alle <img> sind <Image> von next/image?
- [ ] Alle Images haben alt-Text?
- [ ] Placeholder während Loading?
- [ ] Images responsive (verschiedene Sizes)?

#### Mobile

- [ ] Header: Mobile Menu funktioniert?
- [ ] Navigation: Alle Links erreichbar?
- [ ] Forms: Inputs groß genug (touch-friendly)?
- [ ] Tables: Horizontal Scroll?
- [ ] Buttons: Groß genug (min 44px)?
- [ ] Text: Lesbar (min 16px)?

#### TypeScript

- [ ] `npm run build` → Keine TS Errors?
- [ ] VS Code: Keine roten Squiggles?

#### Console

- [ ] Browser Console (F12): Keine Errors?
- [ ] Keine Warnings (außer React DevTools)?
- [ ] Terminal (Dev Server): Keine Errors?

#### Performance (Quick Check)

- [ ] Pages laden schnell (<2s)?
- [ ] Keine unnötigen Re-Renders?
- [ ] Images lazy-loaden?

### B) BUG-LISTE ERSTELLEN

**Format:**

```markdown
# Bugs gefunden am [Datum]

## Critical

- [ ] Login Form: Error wird nicht angezeigt
- [ ] Checkout: Stripe lädt nicht

## High

- [ ] Product Images: Nicht responsive
- [ ] Mobile Menu: Schließt nicht

## Medium

- [ ] Empty State Text: Typo
- [ ] Button: Loading Spinner fehlt

## Low

- [ ] Footer Link: Falsche Farbe
```

### C) BUGS AN CLAUDE CODE

**Prompt für jeden Bug:**

```
Claude, referenziere alle Projekt-Docs.

BUG: [Beschreibung]
LOCATION: [Datei/Component]
EXPECTED: [Was soll passieren]
ACTUAL: [Was passiert]

Bitte beheben unter Einhaltung der Claude.md Richtlinien.
```

### D) RE-TEST

Nach Fixes:

- [ ] Alle Bugs erneut testen
- [ ] Neue Bugs entstanden?
- [ ] Regression Testing (alte Features noch OK?)

---

## 📊 PHASE 7.5 FORTSCHRITT

**Steps:**

- [x] 7.5.1 Email System (Resend) ✅
- [x] 7.5.2 DSGVO Cookie Consent ✅
- [x] 7.5.3 Custom Error Pages ✅
- [x] 7.5.4 Rate Limiting ✅
- [x] 7.5.5 SEO Files ✅
- [x] 7.5.6 Loading Pages ✅
- [ ] 7.5.7 Final Polish Check → **Verschoben zu Phase 8.4**

**Status:** 6/7 Complete (7.5.7 → Phase 8.4)

---

## ✅ DEFINITION OF DONE

Phase 7.5 ist fertig wenn:

- ✅ Alle 7 Steps abgehakt
- ✅ Alle Tests bestanden
- ✅ Keine Critical/High Bugs
- ✅ `npm run build` erfolgreich
- ✅ App läuft stabil auf localhost

**→ DANN: Weiter zu Phase 8 (Testing & Deployment)!**

---

## 🎯 NÄCHSTER SCHRITT

**Nach Fertigstellung von 7.5:**

1. ROADMAP.md updaten (Phase 7.5 abhaken)
2. Git Commit: `git commit -m "feat: complete Phase 7.5 - Pre-Deployment Essentials"`
3. **→ Starte Phase 8: Testing & Deployment**

---

**Version:** 1.0  
**Created:** 2025-12-04  
**Status:** Ready to Start
