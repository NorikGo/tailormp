# 🚀 Production Deployment Guide

**Estimated Time:** 10-15 Minuten
**Difficulty:** Einfach ✅

---

## 📋 Vor dem Deployment

### ✅ Checklist
- [x] Build erfolgreich (`npm run build`)
- [x] Tests passing (16/16 E2E Tests)
- [x] Performance optimiert
- [x] Analytics konfiguriert
- [ ] Environment Variables bereit

---

## 🔑 Environment Variables

**Du brauchst:**

1. **Supabase:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. **Database:**
   - `DATABASE_URL`

3. **Stripe:**
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_WEBHOOK_SECRET`

4. **Email (Resend):**
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`

5. **App URL:**
   - `NEXT_PUBLIC_APP_URL` (wird nach Deploy gesetzt)

**Tipp:** Kopiere aus `.env.local`!

---

## 🚀 Deployment Steps

### Schritt 1: GitHub Push (falls nicht schon gemacht)

```bash
git add .
git commit -m "feat: Production ready with analytics"
git push origin main
```

### Schritt 2: Vercel Account

1. Gehe zu: https://vercel.com
2. Login mit GitHub
3. "Add New Project"

### Schritt 3: Import Repository

1. **Select Repository:** `NorikGo/tailormp`
2. **Configure Project:**
   - Framework Preset: Next.js ✅ (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Schritt 4: Environment Variables

**Klick "Environment Variables":**

Füge ALLE Variables aus `.env.local` hinzu:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
DATABASE_URL=postgresql://xxx
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=https://dein-projekt.vercel.app
PLATFORM_COMMISSION_PERCENTAGE=10
MEASUREMENT_PROVIDER=mock
```

**Wichtig:**
- Kopiere ALLE aus `.env.local`
- `NEXT_PUBLIC_APP_URL` wird erst nach Deploy bekannt

### Schritt 5: Deploy

1. **Klick "Deploy"**
2. **Warte 2-3 Minuten** ☕
3. **Deployment Log** erscheint

**Erfolg wenn:**
```
✓ Deployment completed
```

### Schritt 6: URL aktualisieren

1. **Kopiere deine Vercel URL:** `https://dein-projekt.vercel.app`
2. **Gehe zu Project Settings → Environment Variables**
3. **Update:** `NEXT_PUBLIC_APP_URL` auf deine URL
4. **Redeploy:** Settings → Deployments → "..." → "Redeploy"

### Schritt 7: Stripe Webhook

1. **Stripe Dashboard:** https://dashboard.stripe.com
2. **Developers → Webhooks**
3. **Add endpoint:**
   - URL: `https://dein-projekt.vercel.app/api/webhooks/stripe`
   - Events: Select all checkout events
4. **Copy Webhook Secret:** `whsec_xxx`
5. **Update in Vercel:** `STRIPE_WEBHOOK_SECRET`

---

## ✅ Post-Deployment Checklist

### Sofort testen (5 min):

- [ ] Homepage lädt: `https://dein-projekt.vercel.app`
- [ ] Login funktioniert
- [ ] Schneider-Page lädt
- [ ] Produkte-Page lädt
- [ ] Analytics erscheint in Vercel Dashboard (nach 5-10 min)

### Innerhalb 1 Stunde:

- [ ] Registrierung testen
- [ ] Kompletter Checkout-Flow testen
- [ ] Email-Empfang prüfen (Resend Dashboard)
- [ ] Lighthouse Audit (sollte >90 sein)

### Innerhalb 24 Stunden:

- [ ] Alle Features durchgehen
- [ ] Mobile testen
- [ ] Analytics Daten prüfen
- [ ] Error Logs prüfen (Vercel Dashboard → Logs)

---

## 📊 Monitoring

### Vercel Dashboard

**Analytics:**
- Dashboard → Analytics
- Sieh: Page Views, Visitors, Performance

**Logs:**
- Dashboard → Logs
- Filter: "Error" für Fehler

**Deployments:**
- Dashboard → Deployments
- Alle Deploys sichtbar

---

## 🐛 Troubleshooting

### "Build Failed"
→ Check Vercel Build Logs
→ Meist: Fehlende Environment Variable

### "500 Internal Error"
→ Check Vercel Function Logs
→ Meist: Database Connection oder API Key fehlt

### "Stripe Checkout funktioniert nicht"
→ Check Stripe Dashboard → Logs
→ Check Webhook Secret korrekt gesetzt

### "Emails kommen nicht an"
→ Check Resend Dashboard → Logs
→ Check `RESEND_FROM_EMAIL` verified

---

## 🎯 Domain Setup (Optional)

### Custom Domain hinzufügen:

1. **Vercel Dashboard → Settings → Domains**
2. **Add Domain:** `deine-domain.com`
3. **DNS Settings** bei deinem Provider:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. **Warte 5-10 Minuten**
5. **SSL automatisch aktiviert** ✅

---

## ✅ Success!

**Deployment erfolgreich wenn:**

- ✅ Site lädt unter Vercel URL
- ✅ Login funktioniert
- ✅ Keine Errors in Logs
- ✅ Analytics tracken (nach ~10min)
- ✅ Lighthouse Score >85

---

## 🚀 Nächste Schritte

1. **User Testing** - Lade Beta-User ein
2. **Monitoring** - Beobachte Analytics & Logs
3. **Marketing** - Soft Launch vorbereiten
4. **Iteration** - Basierend auf Feedback verbessern

---

**Zeit für Production?** 🎉

Folge einfach den Steps oben!

**Brauche Hilfe?** Frag einfach! 🤝

---

**Created:** 2025-12-08
**Version:** 1.0
