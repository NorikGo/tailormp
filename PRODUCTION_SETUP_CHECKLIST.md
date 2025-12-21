# 🚀 Production Setup Checklist

**Ziel:** TailorMarket live bringen mit echten Daten & Zahlungen
**Geschätzte Zeit:** 2-3 Stunden (mit Pausen bei Wartezeiten)
**Datum:** Nächste Session

---

## ✅ Was du HEUTE schon hast

- ✅ Vercel Account + Projekt "tailormp" deployed
- ✅ Alle Environment Variables in Vercel (noch Development Config)
- ✅ Code ist production-ready (Lighthouse 100/96/96/100)
- ✅ GitHub Repo verknüpft mit Vercel (Auto-Deploy aktiv)

---

## 📋 Was beim NÄCHSTEN MAL zu tun ist

### **Phase 1: Supabase Production (30 min)**

#### Step 1.1: Neues Supabase Project erstellen
- [ ] Gehe zu [supabase.com/dashboard](https://supabase.com/dashboard)
- [ ] Click "New Project"
- [ ] **Name:** `tailormarket-production`
- [ ] **Region:** Frankfurt (eu-central-1) - WICHTIG für DSGVO!
- [ ] **Database Password:** Wähle ein STARKES Passwort
- [ ] **⚠️ SPEICHERE das Passwort sicher!** (z.B. in Notizen/Password Manager)
- [ ] Warte 2-3 Minuten bis Status "Healthy" zeigt

#### Step 1.2: Supabase Credentials kopieren
- [ ] In deinem Production Project → Settings → API
- [ ] **Kopiere diese 3 Values:**
  ```
  Project URL: https://[dein-project-ref].supabase.co
  anon/public key: eyJhbGc...
  service_role key: eyJhbGc...
  ```
- [ ] **Speichere sie temporär** (Notepad, wird gleich gebraucht)

#### Step 1.3: Database Connection String erstellen
- [ ] Settings → Database → Connection String
- [ ] Wähle **"URI"** Tab
- [ ] Kopiere den String, sieht aus wie:
  ```
  postgresql://postgres:[YOUR-PASSWORD]@db.[project-ref].supabase.co:5432/postgres
  ```
- [ ] **Ersetze `[YOUR-PASSWORD]`** mit dem Passwort aus Step 1.1
- [ ] URL-encode das Passwort falls Sonderzeichen (z.B. `#` → `%23`)

---

### **Phase 2: Stripe Live Mode (45 min - inkl. Wartezeit)**

#### Step 2.1: Stripe Account aktivieren
- [ ] Gehe zu [dashboard.stripe.com](https://dashboard.stripe.com)
- [ ] Oben rechts: **Toggle von "Test Mode" zu "Live Mode"**
- [ ] Stripe wird dich auffordern: **"Activate your account"**

#### Step 2.2: Business Details ausfüllen
- [ ] **Business Type:** Individual oder Company
- [ ] **Business Details:** Name, Adresse, etc.
- [ ] **Bank Account:** IBAN für Auszahlungen (WICHTIG!)
- [ ] **Identity Verification:** Upload Ausweis/Reisepass
- [ ] **⏳ Wartezeit:** 10-30 Minuten für Verification

**💡 TIPP:** Während du wartest, mach Phase 3 (Database Migration)!

#### Step 2.3: Live API Keys kopieren
- [ ] Nach Activation: Developers → API Keys
- [ ] **⚠️ WICHTIG:** Stelle sicher "Viewing test data" Toggle ist AUS (Live Mode)
- [ ] **Kopiere:**
  ```
  Publishable key: pk_live_...
  Secret key: sk_live_... (click "Reveal")
  ```
- [ ] **Speichere sicher!** (Diese Keys = echtes Geld!)

#### Step 2.4: Webhook für Production erstellen
- [ ] Developers → Webhooks → Add Endpoint
- [ ] **Endpoint URL:** `https://tailormp.vercel.app/api/webhooks/stripe`
- [ ] **Events to send:**
  - `checkout.session.completed`
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
- [ ] Click "Add Endpoint"
- [ ] **Kopiere den Signing Secret:** `whsec_...`

---

### **Phase 3: Database Migration (20 min)**

#### Step 3.1: Prisma Schema zu Production pushen
- [ ] Öffne Terminal in deinem Projekt
- [ ] **Temporär** die Production DATABASE_URL setzen:
  ```bash
  # Windows PowerShell:
  $env:DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[project-ref].supabase.co:5432/postgres"

  # Dann:
  npx prisma db push
  ```
- [ ] **✅ Check:** Du solltest sehen "Database is now in sync with schema"

#### Step 3.2: Seed Data (Optional)
- [ ] Falls du Test-Produkte/Users in Production haben willst:
  ```bash
  npm run db:seed
  ```
- [ ] **ODER:** Einfach überspringen und später manuell anlegen

---

### **Phase 4: Vercel Production Config (15 min)**

#### Step 4.1: Environment Variables updaten
- [ ] Gehe zu [vercel.com/dashboard](https://vercel.com/dashboard) → tailormp → Settings → Environment Variables

**⚠️ UPDATE diese Variables (eine nach der anderen):**

| Variable | Neuer Wert (Production) | Wo her? |
|----------|-------------------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://[project-ref].supabase.co` | Supabase Phase 1.2 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` (anon key) | Supabase Phase 1.2 |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` (service_role) | Supabase Phase 1.2 |
| `DATABASE_URL` | `postgresql://postgres:...` | Supabase Phase 1.3 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Stripe Phase 2.3 |
| `STRIPE_SECRET_KEY` | `sk_live_...` | Stripe Phase 2.3 |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (production) | Stripe Phase 2.4 |
| `NEXT_PUBLIC_URL` | `https://tailormp.vercel.app` | Vercel URL |
| `NEXT_PUBLIC_APP_URL` | `https://tailormp.vercel.app` | Vercel URL |
| `STRIPE_SUCCESS_URL` | `https://tailormp.vercel.app/checkout/success` | Vercel URL |
| `STRIPE_CANCEL_URL` | `https://tailormp.vercel.app/checkout/cancel` | Vercel URL |

**💡 SO GEHST DU VOR:**
1. Click auf die Variable
2. Click "Edit"
3. Paste den neuen Production Value
4. **⚠️ WICHTIG:** Wähle nur "Production" Environment (NICHT Preview/Development)
5. Save
6. Repeat für alle

#### Step 4.2: Redeploy triggern
- [ ] Gehe zu Deployments Tab
- [ ] Click auf das neueste Deployment → "..." Menu → "Redeploy"
- [ ] **⚠️ WICHTIG:** Wähle "Use existing Build Cache" = OFF (frischer Build!)
- [ ] Warte ~2 Minuten bis Deployment fertig ist

---

### **Phase 5: Production Testing (30 min)**

#### Step 5.1: Basic Functionality
- [ ] Öffne `https://tailormp.vercel.app`
- [ ] **Test 1:** Homepage lädt korrekt
- [ ] **Test 2:** Registrierung funktioniert (neuer Account)
- [ ] **Test 3:** Login funktioniert
- [ ] **Test 4:** Products Page zeigt Produkte (falls Seed Data) oder Empty State

#### Step 5.2: Stripe Live Payment Test
- [ ] Als Tailor: Neues Produkt erstellen (€10)
- [ ] Als Customer: Produkt in den Cart
- [ ] Checkout starten
- [ ] **⚠️ WICHTIG:** Du wirst zu echtem Stripe Checkout geleitet
- [ ] **⚠️ NUTZE ECHTE KREDITKARTE** (Live Mode!)
- [ ] **💡 TIPP:** Bestelle nur €1-5 Test-Produkt, um echte Kosten niedrig zu halten
- [ ] Nach Zahlung: Check ob Order in `/orders` erscheint

#### Step 5.3: Stripe Dashboard Check
- [ ] Gehe zu [dashboard.stripe.com](https://dashboard.stripe.com)
- [ ] Payments → solltest du deine Test-Zahlung sehen
- [ ] **Status:** Succeeded
- [ ] **Payout:** Kommt in 2-7 Tagen auf dein Bankkonto

#### Step 5.4: Database Check
- [ ] Supabase Dashboard → Table Editor
- [ ] Check `orders` table → neue Order sollte da sein
- [ ] Check `users` table → neue registrierte User

---

## ✅ DONE - Du bist LIVE! 🎉

Nach diesen Steps ist TailorMarket offiziell live und bereit für echte User!

---

## 🛡️ Security Checklist (Quick Check)

- [ ] Stripe Live Keys sind NUR in Vercel (nicht in Git committed)
- [ ] Supabase Service Role Key ist NUR in Vercel
- [ ] `.env.local` ist in `.gitignore` (sollte schon sein)
- [ ] Database Password ist sicher gespeichert

---

## 📞 Troubleshooting - Falls was schief geht

### Problem: "Invalid API Key" Error
**Lösung:**
- Check ob du wirklich Live Keys nutzt (nicht Test Keys)
- Check ob Keys korrekt kopiert (kein Leerzeichen am Ende)

### Problem: Stripe Webhook schlägt fehl
**Lösung:**
- Check Stripe Dashboard → Webhooks → Response logs
- Webhook URL muss `https://tailormp.vercel.app/api/webhooks/stripe` sein
- Webhook Secret in Vercel muss von Production Webhook sein

### Problem: Database Connection Error
**Lösung:**
- Check ob Passwort URL-encoded ist
- Check ob Database ist "Healthy" in Supabase
- Check ob Prisma migration lief (`npx prisma db push`)

### Problem: App deployed aber "Internal Server Error"
**Lösung:**
- Vercel → Deployment → Function Logs anschauen
- Meist: Environment Variable fehlt oder falsch

---

## 💡 Nach Go-Live - Optional

### Monitoring Setup (später)
- [ ] Sentry für Error Tracking
- [ ] Vercel Analytics aktivieren
- [ ] Google Analytics (optional)

### Domain Setup (später)
- [ ] Domain kaufen (z.B. Namecheap, Cloudflare)
- [ ] Domain in Vercel verbinden (Settings → Domains)
- [ ] SSL ist automatisch (Vercel macht das)

### Email Setup
- [ ] Resend: Verify Domain für eigene Email (statt `onboarding@resend.dev`)
- [ ] Oder: Custom SMTP (später)

---

## 🎯 Estimated Timeline

| Phase | Zeit | Kann parallel? |
|-------|------|----------------|
| Supabase Production | 30 min | Nein |
| Stripe Activation | 15 min (+ 10-30 min Wartezeit) | ← Wartezeit nutzen für DB Migration! |
| Database Migration | 20 min | Ja, während Stripe Verification |
| Vercel Config | 15 min | Nein |
| Testing | 30 min | Nein |
| **TOTAL** | **~2-3 Stunden** | (inkl. Wartezeiten) |

---

## 📝 Notizen für dich

**Credentials sicher speichern:**
```
=== PRODUCTION CREDENTIALS ===

Supabase Production:
- Project URL: ___________
- Anon Key: ___________
- Service Role: ___________
- DB Password: ___________

Stripe Live:
- Publishable: ___________
- Secret: ___________
- Webhook Secret: ___________

Bank Account (für Payouts):
- IBAN: ___________
```

---

**Erstellt:** 2025-12-19
**Version:** 1.0
**Von:** Claude Code

**Bei Fragen während Production Setup:**
Einfach "mein akh, ich hänge bei Step X.Y" und ich helfe dir! 🚀
