# 🧪 Vercel Praxis-Test - Phase 8.7.1

**Ziel:** Testen ob Vercel Deployment mit Development Config funktioniert
**Dauer:** 30 Minuten
**Warum:** Bevor Bekannte testen, sicherstellen dass alles deployed funktioniert

---

## 📋 Was wir testen

Laut Roadmap Phase 8.7.1 sollen wir verifizieren:
1. ✅ Vercel Deployment funktioniert
2. ✅ Environment Variables sind korrekt gesetzt
3. ✅ App läuft live ohne Errors
4. ✅ Performance ist gut (Lighthouse)

**WICHTIG:** Wir deployen mit **Development Credentials** (nicht Production):
- Supabase Dev Database
- Stripe Test Mode
- Resend Free Tier

---

## 🚀 SCHRITT 1: Vercel Deployment Status prüfen (5 Min)

### 1.1 Checke aktuelles Deployment

Gehe zu: https://vercel.com/dashboard

- [ ] **Finde dein Projekt:** "tailormp" (oder wie du es genannt hast)
- [ ] **Status:** Sollte "Ready" sein (grüner Dot)
- [ ] **URL:** Notiere die Production URL (z.B. `https://tailormp.vercel.app`)

### 1.2 Öffne die Live-App

- [ ] Öffne die Vercel URL im Browser
- [ ] **Erwartung:** App lädt (kein 500 Error)

**Falls Error 500:**
→ Gehe zu Vercel → Deployment → Function Logs
→ Screenshot vom Error machen
→ Sag mir: "Vercel zeigt Error: [Error Message]"

---

## 🧪 SCHRITT 2: Basis-Funktionalität testen (10 Min)

### 2.1 Homepage Test

**URL:** `https://tailormp.vercel.app`

- [ ] **Test 1:** Homepage lädt korrekt
  - ✅ Hero Section sichtbar
  - ✅ "Wie es funktioniert" Section sichtbar
  - ✅ Keine Console Errors (F12 → Console Tab)

### 2.2 Navigation Test

- [ ] **Test 2:** Header Navigation funktioniert
  - Klicke "Produkte" → Redirect zu `/products`
  - Klicke "Schneider" → Redirect zu `/tailors`
  - ✅ Erwartung: Seiten laden ohne Error

### 2.3 Database Connection Test

**URL:** `https://tailormp.vercel.app/products`

- [ ] **Test 3:** Products Page zeigt Daten
  - ✅ Erwartung: Produkte werden geladen (aus Supabase Dev DB)
  - ❌ Falls "Fehler beim Laden" → Environment Variable Problem

**Debugging:**
Falls keine Produkte laden:
1. F12 → Network Tab → Checke `/api/products` Request
2. Falls 500 Error → Vercel Logs checken
3. Sag mir Bescheid

---

## 🔐 SCHRITT 3: Auth & Database Test (10 Min)

### 3.1 Registration Test

**URL:** `https://tailormp.vercel.app/register`

- [ ] **Test 1:** Neuen Account erstellen
  - Name: `Vercel Test User`
  - Email: `verceltest@test.com` (oder deine Email)
  - Passwort: `testpass123`
  - Role: `CUSTOMER`
  - Klicke "Registrieren"

- [ ] **Erwartung:**
  - ✅ Success Message
  - ✅ Redirect zu `/`
  - ✅ User ist eingeloggt (Header zeigt Name)

**Falls Fehler:**
→ Check ob Supabase Environment Variables korrekt sind in Vercel

### 3.2 Login Test

- [ ] **Test 2:** Logout → Login
  - Klicke auf dein Name → Logout
  - Gehe zu `/login`
  - Logge dich mit dem Test-Account ein
  - ✅ Erwartung: Erfolgreich eingeloggt

---

## ⚡ SCHRITT 4: Performance Test (5 Min)

### 4.1 Lighthouse Audit (Production URL)

**Chrome DevTools:**
1. Öffne `https://tailormp.vercel.app`
2. F12 → Lighthouse Tab
3. Categories: Performance, Accessibility, Best Practices, SEO
4. Mode: Desktop
5. Click "Analyze page load"

**Erwartete Scores (±10 Punkte Toleranz):**
- [ ] Performance: ~90-100
- [ ] Accessibility: ~90-100
- [ ] Best Practices: ~90-100
- [ ] SEO: ~90-100

**Falls Scores deutlich schlechter (<80):**
→ Screenshot machen
→ Sag mir Bescheid

---

## 💳 SCHRITT 5: Stripe Test Mode Check (Optional, 5 Min)

**Nur wenn du Stripe testen willst:**

### 5.1 Checkout Test

1. [ ] Füge ein Produkt in den Cart
2. [ ] Gehe zu Checkout
3. [ ] Wirst du zu Stripe redirected?
4. [ ] **Stripe Test Card:** 4242 4242 4242 4242
5. [ ] Payment erfolgreich?
6. [ ] Redirect zu Success Page?

**Falls Stripe nicht lädt:**
→ Check Vercel Environment Variables:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (sollte `pk_test_...` sein)
- `STRIPE_SECRET_KEY` (sollte `sk_test_...` sein)

---

## ✅ SCHRITT 6: Zusammenfassung

### Checkliste durchgehen:

- [ ] **Deployment Status:** Ready ✅
- [ ] **Homepage:** Lädt korrekt ✅
- [ ] **Navigation:** Funktioniert ✅
- [ ] **Database:** Products laden ✅
- [ ] **Auth:** Register/Login funktioniert ✅
- [ ] **Performance:** Lighthouse >80 ✅
- [ ] **Stripe:** (Optional) Checkout funktioniert ✅

---

## 🎯 Ergebnis-Bewertung

### ✅ Alle Tests bestanden (5-7 von 7)
**Status:** 🎉 **READY FÜR BEKANNTE-TESTING!**

**Nächster Schritt:**
- Teile die Vercel URL mit deinen Bekannten
- Lass sie testen
- Sammle Feedback
- Wir fixen Bugs iterativ

**Sag mir:**
```
"Vercel Praxis-Test bestanden! Kann ich jetzt deployen für Bekannte?"
```

---

### ⚠️ Einige Tests fehlgeschlagen (3-4 von 7)
**Status:** 🟡 **PROBLEME GEFUNDEN**

**Was tun:**
1. Notiere welche Tests fehlgeschlagen sind
2. Mach Screenshots von Errors
3. Sag mir: "Vercel Test: [X] fehlgeschlagen, Error: [...]"
4. Ich helfe dir Bugs zu fixen

---

### ❌ Viele Tests fehlgeschlagen (<3 von 7)
**Status:** 🔴 **DEPLOYMENT BROKEN**

**Was tun:**
1. Check Vercel Function Logs (kritisch!)
2. Check Environment Variables (in Vercel Settings)
3. Sag mir: "Vercel Deployment broken, hier sind die Logs: [...]"

---

## 📝 Debugging Tipps

### Problem 1: "500 Internal Server Error"
**Lösung:**
- Vercel → Deployments → Click auf neuestes → Functions Tab
- Suche nach Error Messages
- Meist: Environment Variable fehlt oder Database Connection Error

### Problem 2: "Products laden nicht"
**Lösung:**
- Check Vercel → Settings → Environment Variables
- Verifiziere:
  ```
  DATABASE_URL = postgresql://...
  NEXT_PUBLIC_SUPABASE_URL = https://...
  NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
  ```

### Problem 3: "Auth funktioniert nicht"
**Lösung:**
- Check Supabase Dashboard → Authentication
- Verifiziere dass Dev Project "Healthy" ist
- Check ob Supabase Keys in Vercel korrekt sind

### Problem 4: "Stripe lädt nicht"
**Lösung:**
- Check ob Stripe Keys **Test Mode** sind (pk_test_, sk_test_)
- Check Vercel Environment Variables
- Check Browser Console für CORS Errors

---

## 🚀 Nach erfolgreichem Test

**Du hast jetzt:**
- ✅ Verifiziert: Vercel Deployment funktioniert
- ✅ Verifiziert: Development Config ist korrekt
- ✅ Eine live URL für Bekannte: `https://tailormp.vercel.app`

**Next Steps:**
1. **Teile URL mit Bekannten** für Feedback
2. **Sammle Bug Reports** von ihnen
3. **Wir fixen Bugs iterativ**
4. **Später:** Großes Umkrempeln (wie du planst)
5. **Viel später:** Production Setup (wenn ready für echte User)

---

## 💡 Wichtige Hinweise

**Für Bekannte:**
- Erkläre ihnen: "Das ist Development Version, nutzt Test-Daten"
- Stripe Zahlungen: Nutze Test-Karte 4242 4242 4242 4242
- Bug Reports willkommen!

**Für dich:**
- Du kannst jederzeit Code ändern → Git push → Auto-Deploy
- Database Schema ändern? → Kein Problem (ist Dev DB)
- Breaking Changes? → Egal, nur Test-Environment

---

**Viel Erfolg beim Vercel Praxis-Test, mein Akh! 🧪**

Wenn du durch bist, sag mir einfach:
- "Vercel Test erfolgreich!" → Dann teilst du die URL
- "Vercel Test: Problem X" → Dann fixe ich es
