# 📋 Post-Deploy Checklist

**Status:** ⏳ TODO
**Priority:** High
**Estimated Time:** 1-2 Stunden

---

## 🔥 Kritisch (ASAP)

### 1. Environment Variables Check
- [ ] Vercel Dashboard → Settings → Environment Variables
- [ ] `NEXT_PUBLIC_APP_URL` auf echte URL setzen
- [ ] Redeploy nach Änderung

### 2. Stripe Webhook Setup
- [ ] Stripe Dashboard → Webhooks
- [ ] Add endpoint: `https://deine-url.vercel.app/api/webhooks/stripe`
- [ ] Events: `checkout.session.*`
- [ ] Webhook Secret in Vercel setzen
- [ ] Redeploy

### 3. Email Verification (Resend)
- [ ] Test-Email senden
- [ ] Resend Dashboard → Logs prüfen
- [ ] `RESEND_FROM_EMAIL` verified?

---

## 📊 Wichtig (Diese Woche)

### 4. Basis-Tests
- [ ] Homepage lädt
- [ ] Login funktioniert
- [ ] Register funktioniert
- [ ] Products/Tailors Seiten laden
- [ ] Keine kritischen Errors in Vercel Logs

### 5. Monitoring Setup
- [ ] Error Logs prüfen (Vercel → Logs)
- [ ] Analytics läuft? (nach 10min)
- [ ] Speed Insights Scores checken (nach 1h)

---

## ✨ Nice-to-Have (Nächste Woche)

### 6. Performance
- [ ] Lighthouse Audit auf Live-Site
- [ ] Core Web Vitals >90?
- [ ] Performance-Issues identifizieren

### 7. SEO
- [ ] Google Search Console einrichten
- [ ] Sitemap submitten
- [ ] Meta Tags prüfen

### 8. User Testing
- [ ] Beta-User einladen
- [ ] Feedback sammeln
- [ ] Kritische Bugs dokumentieren

---

## 🔗 Quick Links

- Vercel Dashboard: https://vercel.com/dashboard
- Stripe Dashboard: https://dashboard.stripe.com
- Resend Dashboard: https://resend.com/emails
- Supabase Dashboard: https://rylmtkxxbwnbeecprill.supabase.co

---

**Created:** 2025-12-08
**Status:** Open
