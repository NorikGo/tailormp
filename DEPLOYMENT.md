# 🚀 TailorMarket - Deployment Guide

Dieses Dokument beschreibt den Deployment-Prozess für die refactored Suit-fokussierte Version von TailorMarket.

**Version:** 2.0 (Suit-Focused Platform)
**Letztes Update:** 2025-12-29
**Status:** Production-Ready (nach R9 Refactoring)

---

## 📊 Deployment Status

**Refactoring Fortschritt:** 80% (16/20 Steps abgeschlossen)

- ✅ R1-R7: Komplett abgeschlossen
- ✅ R8.1: E2E Tests aktualisiert
- ⏳ R8.2: Manual QA (vor Production empfohlen)
- ⏳ R9: Deployment Vorbereitung

---

## 🏗️ Architektur Überblick

**Frontend:** Next.js 16 (App Router) + React 19
**Backend:** Next.js API Routes + Supabase
**Database:** PostgreSQL (via Supabase)
**Auth:** Supabase Auth
**Storage:** Supabase Storage (für Product Images, Fabrics)
**Payment:** Stripe Connect
**Email:** Resend
**Hosting:** Vercel (empfohlen)

---

## 📦 Build Information

**Production Build:** ✅ Erfolgreich
**Build Time:** ~22s
**Routes:** 97 Total
- 32 Static Routes
- 65 Dynamic/API Routes

**Build Command:**
```bash
npm run build
```

---

## 🔐 Environment Variables

### Erforderliche Variables (Production)

Kopiere `.env.example` und fülle folgende Werte aus:

#### 1. Database
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
```
**Quelle:** Supabase → Settings → Database → Connection String (Transaction Mode)

#### 2. Supabase
```env
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbG..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbG..."
```
**Quelle:** Supabase → Settings → API

#### 3. Stripe
```env
STRIPE_SECRET_KEY="sk_live_..."  # Live Mode!
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
PLATFORM_COMMISSION_PERCENTAGE=25  # 25% Platform-Fee
```
**Quelle:**
- Keys: Stripe Dashboard → Developers → API Keys
- Webhook Secret: Stripe → Webhooks → Add Endpoint

**Webhook URL:** `https://yourdomain.com/api/webhooks/stripe`
**Events:** `checkout.session.completed`, `payment_intent.succeeded`

#### 4. Email (Resend)
```env
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@tailormarket.com"
```
**Quelle:** Resend Dashboard → API Keys

#### 5. App URLs
```env
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXT_PUBLIC_URL="https://yourdomain.com"
NODE_ENV="production"
```

#### 6. Measurement Provider (Optional)
```env
MEASUREMENT_PROVIDER="manual"  # or "3dlook" when ready
```

---

## 📝 Pre-Deployment Checklist

### Supabase Setup

- [ ] **Database Migration**
  ```bash
  npx prisma migrate deploy
  ```

- [ ] **Seed Production Data**
  ```bash
  # Admin User + Fabrics + Demo Tailors
  npx tsx prisma/seed-suits.ts
  ```

  **Wichtig:** Speichere Admin Credentials:
  - Email: `admin@tailormarket.com`
  - Password: `Admin123!` (ÄNDERN nach erstem Login!)

- [ ] **RLS Policies prüfen**
  - Gehe zu Supabase → Authentication → Policies
  - Stelle sicher, dass alle Policies aktiviert sind
  - Teste mit verschiedenen Rollen (customer, tailor, admin)

- [ ] **Storage Buckets erstellen**
  - `product-images` (Public)
  - `fabric-images` (Public)
  - `tailor-portfolios` (Public)

### Stripe Setup

- [ ] **Test Mode → Live Mode**
  - Aktualisiere alle Keys auf Live Keys
  - ⚠️ NIEMALS Live Keys committen!

- [ ] **Webhook konfigurieren**
  - URL: `https://yourdomain.com/api/webhooks/stripe`
  - Events: `checkout.session.completed`, `payment_intent.succeeded`
  - Kopiere Webhook Secret in ENV

- [ ] **Connect Settings**
  - Aktiviere Stripe Connect für Tailors
  - Setze Platform Commission: 25%

### Email Setup

- [ ] **Resend Domain verifizieren**
  - Füge DNS Records hinzu (SPF, DKIM, DMARC)
  - Warte auf Verifikation

- [ ] **Email Templates testen**
  ```bash
  # Test Email senden
  curl -X POST https://yourdomain.com/api/test-email
  ```

### Build & Testing

- [ ] **Production Build testen**
  ```bash
  npm run build
  npm start
  ```

- [ ] **E2E Tests ausführen**
  ```bash
  npm run test:e2e
  ```

- [ ] **Lighthouse Score prüfen**
  - Performance: >90
  - Accessibility: >90
  - Best Practices: >90
  - SEO: >90

---

## 🌐 Vercel Deployment

### 1. Projekt verbinden

```bash
# Vercel CLI installieren
npm i -g vercel

# Projekt deployen
vercel

# Production Deployment
vercel --prod
```

### 2. Environment Variables setzen

In Vercel Dashboard → Settings → Environment Variables:

**Alle ENV Variables aus `.env.example` hinzufügen!**

**Wichtig:**
- Setze `NODE_ENV=production`
- Verwende LIVE Keys (Stripe, Supabase)
- Niemals Secrets in Git committen!

### 3. Build Settings

- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### 4. Domain konfigurieren

- Füge Custom Domain hinzu
- SSL/TLS wird automatisch konfiguriert
- Aktualisiere `NEXT_PUBLIC_APP_URL` ENV

### 5. Deploy

```bash
git push origin main
```

Vercel deployed automatisch bei jedem Push zu `main`.

---

## 🗄️ Database Migration (Production)

### Vorsichtige Migration

```bash
# 1. Backup erstellen
# Supabase → Database → Backups → Create Backup

# 2. Migration testen (Dry Run)
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datasource $(DATABASE_URL) \
  --script

# 3. Migration ausführen
npx prisma migrate deploy

# 4. Seed Data (nur einmal!)
npx tsx prisma/seed-suits.ts
```

**Ergebnis:**
- 15 Fabrics angelegt
- 5 Vietnamesische Schneider
- 1 Admin User
- 50 Tailor-Fabric Links

---

## 🧪 Post-Deployment Testing

### Functional Tests

- [ ] **Homepage**
  - Lädt korrekt
  - Zeigt "Maßanzug" statt "Produkte"
  - Vietnam-Story sichtbar
  - CTA "Anzug konfigurieren" funktioniert

- [ ] **Suit Configuration Flow**
  - Step 1: Modell wählen → 3 Modelle sichtbar
  - Step 2: Fabric wählen → 15 Fabrics laden
  - Step 3: Measurements → Form validiert
  - Step 4: Customizations → Preis aktualisiert
  - Step 5: Review → Add to Cart funktioniert

- [ ] **Checkout**
  - Cart zeigt korrekte Config
  - Stripe Checkout öffnet
  - Testbestellung durchführen
  - Success Page zeigt Order Details
  - Email wird versendet

- [ ] **Admin Dashboard**
  - Login mit Admin Credentials
  - Fabric Management: CRUD funktioniert
  - Applications Management: Liste zeigt Bewerbungen
  - Approve/Reject funktioniert

- [ ] **Tailor Flow**
  - Bewerbung via /apply
  - Admin approved → Tailor erhält Zugang
  - Tailor Login funktioniert
  - Fabric Management: Kann Fabrics markieren
  - Order View: Sieht zugewiesene Orders

### Performance Tests

```bash
# Lighthouse (Chrome DevTools)
lighthouse https://yourdomain.com --view

# Vercel Analytics
# Automatisch aktiviert - prüfe im Dashboard
```

### Security Tests

- [ ] RLS Policies funktionieren
- [ ] Unautorisierte können nicht auf /admin zugreifen
- [ ] Tailors können nur eigene Orders sehen
- [ ] Customers können nur eigene Orders sehen

---

## 📊 Monitoring & Analytics

### Vercel Analytics

**Automatisch aktiviert** bei Vercel Deployment.

Dashboard: https://vercel.com/dashboard/analytics

Metriken:
- Page Views
- Unique Visitors
- Top Pages
- Devices
- Locations

### Error Tracking (Optional)

**Sentry Integration (empfohlen):**

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

ENV:
```env
SENTRY_DSN="https://xxx@sentry.io/xxx"
```

### Conversion Funnel

Wichtige Events tracken:
1. Homepage → Config Start
2. Config Start → Model Selected
3. Model Selected → Fabric Selected
4. Fabric Selected → Measurements Entered
5. Measurements → Review
6. Review → Add to Cart
7. Cart → Checkout
8. Checkout → Success

---

## 🔄 Rollback Plan

Bei Problemen:

### 1. Schneller Rollback (Vercel)

```bash
# Liste deployments
vercel list

# Rollback zu vorheriger Version
vercel rollback [deployment-url]
```

### 2. Database Rollback

```bash
# Restore Backup in Supabase Dashboard
# Database → Backups → Restore
```

### 3. Hotfix Deployment

```bash
# Fix in neuem Branch
git checkout -b hotfix/critical-bug

# Commit + Push
git commit -m "fix: critical bug"
git push origin hotfix/critical-bug

# Merge zu main
git checkout main
git merge hotfix/critical-bug
git push origin main
```

---

## 🚦 Soft Launch Plan (R9.2)

### Tag 1-2: Internal Testing

- Team testet alle Flows
- Bugs dokumentieren
- Kritische Bugs sofort fixen

### Tag 3-4: Beta Tester (10-20 Personen)

- Invite-Links versenden
- Feedback sammeln
- Tracking aktivieren

### Tag 5-7: Erste echte Kunden

- Stripe Live Mode aktivieren
- Monitoring intensiv
- Support bereitstellen

### Tracking

- Conversion Rate: Homepage → Checkout
- Drop-Off Points identifizieren
- User Feedback sammeln

---

## 📚 Weitere Dokumentation

- **[README.md](./README.md)** - Projekt Übersicht
- **[Refactoring_Roadmap.md](./Refactoring_Roadmap.md)** - Refactoring Status
- **[CLAUDE.md](./CLAUDE.md)** - Code Richtlinien
- **[.env.example](./.env.example)** - ENV Variables Template

---

## 🆘 Support & Troubleshooting

### Häufige Probleme

**Problem:** Build schlägt fehl
**Lösung:** Prüfe `npm run build` lokal. TypeScript Errors? Prisma Client generiert?

**Problem:** Database Connection Error
**Lösung:** Prüfe `DATABASE_URL`. Transaction Mode verwenden, nicht Session Mode.

**Problem:** Stripe Webhook funktioniert nicht
**Lösung:** Prüfe Webhook Secret, Events korrekt konfiguriert? Test mit Stripe CLI.

**Problem:** Emails kommen nicht an
**Lösung:** Resend Domain verifiziert? SPF/DKIM Records gesetzt?

### Logs prüfen

**Vercel:**
```bash
vercel logs [deployment-url]
```

**Supabase:**
- Dashboard → Logs
- Filter nach Errors

**Stripe:**
- Dashboard → Developers → Events
- Filter nach Failed Webhooks

---

## ✅ Launch Checklist

Finale Checks vor Production Launch:

- [ ] Alle ENV Variables gesetzt (Production)
- [ ] Database migriert + Seed Data importiert
- [ ] Stripe Live Mode aktiviert + Webhook konfiguriert
- [ ] Resend Domain verifiziert
- [ ] Build erfolgreich (97 Routes)
- [ ] E2E Tests grün
- [ ] Performance: Lighthouse >90
- [ ] RLS Policies aktiviert
- [ ] Admin User erstellt (Password geändert!)
- [ ] Monitoring aktiviert (Vercel Analytics)
- [ ] Error Tracking setup (Sentry)
- [ ] DNS konfiguriert
- [ ] SSL/TLS aktiviert
- [ ] Backup-Strategie definiert
- [ ] Rollback-Plan dokumentiert
- [ ] Team geschult
- [ ] Support bereit

---

**Ready to launch? 🚀**

Bei Fragen oder Problemen: Referenziere dieses Dokument und [Refactoring_Roadmap.md](./Refactoring_Roadmap.md).

**Viel Erfolg mit TailorMarket 2.0!** 🎉
