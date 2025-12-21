# 🧪 Manual Testing Checklist - TailorMarket MVP

**Datum:** 2025-12-21
**Tester:** Du (mit Browser)
**Geschätzte Dauer:** 1.5 - 2 Stunden
**Ziel:** Letzte Bugs finden vor Development Deployment

---

## 🚀 Vorbereitung (5 Min)

### Schritt 1: Dev Server starten
```bash
npm run dev
```

### Schritt 2: Browser öffnen
- **Desktop:** Chrome/Edge (Haupttest)
- **Mobile:** Chrome DevTools (F12 → Toggle Device Toolbar)
- **URL:** http://localhost:3000

### Schritt 3: Test-Accounts bereit haben
Du wirst verschiedene Accounts brauchen:
- **Customer Account:** Neu registrieren
- **Tailor Account:** Neu registrieren
- **Test Stripe Card:** 4242 4242 4242 4242 (Test Mode)

---

## 📋 TEIL 1: Forms Testing (30 Min)

### 1.1 Login Form
**URL:** http://localhost:3000/login

- [ ] **Test 1: Erfolgreicher Login**
  - Registriere zuerst einen Account (falls noch nicht vorhanden)
  - Logge dich ein
  - ✅ Erwartet: Redirect zu `/` mit "Willkommen" Message

- [ ] **Test 2: Fehlervalidierung - Leere Felder**
  - Lass Email & Passwort leer
  - Click "Anmelden"
  - ✅ Erwartet: Rote Error Messages unter Feldern

- [ ] **Test 3: Fehlervalidierung - Falsche Email**
  - Email: `test@test.com`, Passwort: `wrongpassword123`
  - ✅ Erwartet: "Ungültige Anmeldedaten" Error

- [ ] **Test 4: Fehlervalidierung - Ungültiges Email Format**
  - Email: `invalid-email`, Passwort: `test1234`
  - ✅ Erwartet: "Ungültige E-Mail-Adresse" Message

**Bugs gefunden?** → Notiere unten in "Bug Log"

---

### 1.2 Register Form (Customer)
**URL:** http://localhost:3000/register

- [ ] **Test 1: Erfolgreiche Customer Registration**
  - Name: `Test Customer`
  - Email: `customer@test.com` (oder deine Email)
  - Passwort: `testpass123`
  - Role: `CUSTOMER` (Standard)
  - ✅ Erwartet: Redirect zu `/` mit Success Message

- [ ] **Test 2: Fehlervalidierung - Passwort zu kurz**
  - Passwort: `123` (weniger als 8 Zeichen)
  - ✅ Erwartet: "Passwort muss mindestens 8 Zeichen lang sein"

- [ ] **Test 3: Duplicate Email**
  - Versuche mit gleicher Email nochmal zu registrieren
  - ✅ Erwartet: "Diese E-Mail-Adresse wird bereits verwendet"

---

### 1.3 Register Form (Tailor)
**URL:** http://localhost:3000/register

- [ ] **Test 1: Erfolgreiche Tailor Registration**
  - Name: `Test Tailor`
  - Email: `tailor@test.com`
  - Passwort: `testpass123`
  - Role: **TAILOR** (wichtig!)
  - ✅ Erwartet: Redirect mit Success Message
  - ✅ Erwartet: Tailor-spezifische Felder (Land, Bio, etc.) erscheinen später im Dashboard

---

### 1.4 Product Form (Tailor Only)
**URL:** http://localhost:3000/dashboard (als Tailor eingeloggt)

- [ ] **Test 1: Neues Produkt erstellen**
  - Klicke "Neues Produkt"
  - Fülle alle Felder aus:
    - Titel: `Test Anzug`
    - Beschreibung: `Ein eleganter Test-Anzug`
    - Preis: `299.99`
    - Kategorie: `SUIT`
    - Produktionszeit: `14`
  - ✅ Erwartet: Produkt erscheint in Dashboard

- [ ] **Test 2: Produkt bearbeiten**
  - Klicke "Bearbeiten" bei einem Produkt
  - Ändere Titel zu `Test Anzug V2`
  - ✅ Erwartet: Änderung wird gespeichert

- [ ] **Test 3: Produkt löschen**
  - Klicke "Löschen"
  - ✅ Erwartet: Produkt verschwindet

---

### 1.5 Review Form
**URL:** http://localhost:3000/products/[id] (als Customer eingeloggt)

**WICHTIG:** Du musst zuerst eine Bestellung abschließen, um Review schreiben zu können.

- [ ] **Test 1: Review schreiben**
  - Scrolle zu "Bewertung schreiben"
  - Rating: 5 Sterne
  - Kommentar: `Exzellente Qualität!`
  - ✅ Erwartet: Review erscheint unter dem Produkt

- [ ] **Test 2: Ohne Rating**
  - Versuche Review ohne Sterne zu submitten
  - ✅ Erwartet: Error "Bitte wähle eine Bewertung"

---

### 1.6 Checkout Form (Stripe)
**URL:** http://localhost:3000/checkout

- [ ] **Test 1: Erfolgreicher Checkout**
  1. Füge ein Produkt in den Cart (`/products` → "In den Warenkorb")
  2. Gehe zu `/cart`
  3. Klicke "Zur Kasse"
  4. Du wirst zu Stripe Checkout geleitet
  5. **Stripe Test Card:**
     - Card: `4242 4242 4242 4242`
     - MM/YY: `12/34`
     - CVC: `123`
     - ZIP: `12345`
  6. Klicke "Pay"
  7. ✅ Erwartet: Redirect zu `/checkout/success`
  8. ✅ Erwartet: Order erscheint in `/orders`

- [ ] **Test 2: Checkout Cancel**
  - Klicke im Stripe Checkout auf "Back" (Abbrechen)
  - ✅ Erwartet: Redirect zu `/cart` oder Cancel Page

---

## 📱 TEIL 2: UI/UX Polish (30 Min)

### 2.1 Button States

Gehe zu verschiedenen Seiten und teste:

- [ ] **Hover States**
  - Fahre mit Maus über Buttons (Login, Register, "In den Warenkorb")
  - ✅ Erwartet: Button ändert Farbe/Background

- [ ] **Active States**
  - Klicke und halte Button gedrückt
  - ✅ Erwartet: Button sieht "gedrückt" aus

- [ ] **Disabled States**
  - Bei Loading: Button sollte disabled sein
  - ✅ Erwartet: Grauer Button, Cursor: not-allowed

---

### 2.2 Loading States

- [ ] **Login Form Submit**
  - Klicke "Anmelden"
  - ✅ Erwartet: Button zeigt Spinner (Loader2 Icon) während Request

- [ ] **Product Card Loading**
  - Gehe zu `/products`
  - Reload Seite (F5)
  - ✅ Erwartet: Spinner während Products laden

- [ ] **Cart Update**
  - Ändere Quantity in Cart
  - ✅ Erwartet: Loading Indicator

---

### 2.3 Responsive Images

**Öffne Chrome DevTools → Toggle Device Toolbar (Ctrl+Shift+M)**

- [ ] **Product Images**
  - Gehe zu `/products`
  - Teste verschiedene Bildschirmgrößen:
    - Mobile (375px)
    - Tablet (768px)
    - Desktop (1920px)
  - ✅ Erwartet: Bilder skalieren korrekt, kein Overflow

- [ ] **Tailor Avatar**
  - Gehe zu `/tailors/[id]`
  - ✅ Erwartet: Avatar ist rund, korrekte Größe

---

### 2.4 Typography Mobile

**Mobile View (375px Breite)**

- [ ] **Homepage Text**
  - Gehe zu `/`
  - ✅ Erwartet: Text ist lesbar (mind. 16px Font Size)
  - ✅ Erwartet: Kein Text wird abgeschnitten

- [ ] **Product Cards**
  - ✅ Erwartet: Titel, Preis, Beschreibung gut lesbar

---

### 2.5 Kontrast Check (WCAG AA)

- [ ] **Buttons**
  - Primary Buttons (Blau): Ausreichend Kontrast zu Weiß?
  - ✅ Erwartet: Text klar lesbar

- [ ] **Links**
  - Header Navigation: Grau auf Weiß
  - ✅ Erwartet: Gut lesbar (wenn nicht, ignoriere - Lighthouse zeigt 96/100, ist OK)

---

## 📱 TEIL 3: Mobile Testing (30 Min)

**WICHTIG:** Nutze Chrome DevTools "Device Toolbar" (Ctrl+Shift+M)

### 3.1 Mobile Menu

- [ ] **Test 1: Menu öffnen**
  - Mobile View (375px)
  - Klicke Hamburger Icon (☰) im Header
  - ✅ Erwartet: Full-Screen Menu erscheint

- [ ] **Test 2: Menu schließen**
  - Klicke X Icon
  - ✅ Erwartet: Menu verschwindet

- [ ] **Test 3: Navigation**
  - Klicke auf einen Link im Mobile Menu
  - ✅ Erwartet: Redirect + Menu schließt sich

---

### 3.2 Input Fields (Touch-Friendly)

**Mobile View: 375px**

- [ ] **Login Form Inputs**
  - Klicke auf Email Field
  - ✅ Erwartet: Field ist groß genug (mind. 44x44px)
  - ✅ Erwartet: Keyboard öffnet sich (im DevTools nicht testbar, aber visuell OK?)

- [ ] **Register Form**
  - ✅ Erwartet: Alle Inputs groß genug

---

### 3.3 Horizontal Scroll

**Test auf verschiedenen Seiten:**

- [ ] **Homepage** (Mobile 375px)
  - Scrolle horizontal
  - ✅ Erwartet: KEIN horizontaler Scroll (alles passt in Viewport)

- [ ] **Products Page**
  - ✅ Erwartet: Product Grid stackt vertikal (1 Spalte)

- [ ] **Tailor Profile**
  - ✅ Erwartet: Kein Overflow

**Falls horizontaler Scroll auftritt:** → Bug Log!

---

### 3.4 Page Load Speed (3G Simulation)

**Chrome DevTools → Network Tab → Throttling: "Slow 3G"**

- [ ] **Homepage**
  - Reload Seite (F5)
  - ✅ Erwartet: Seite lädt in <5s (3s Ziel ist für echtes 3G unrealistisch in Dev)

- [ ] **Products Page**
  - ✅ Erwartet: Initial Content sichtbar in <5s

**Hinweis:** Diese Metrik ist in Development nicht akkurat (Production Build ist viel schneller).

---

## 🐛 BUG LOG

**Falls du Bugs findest, notiere sie hier:**

### Bug #1
**Seite/Component:**
**Was ist passiert:**
**Erwartetes Verhalten:**
**Schritte zum Reproduzieren:**
1.
2.
3.

**Schweregrad:** 🔴 Kritisch / 🟡 Medium / 🟢 Minor

---

### Bug #2
(Falls nötig)

---

### Bug #3
(Falls nötig)

---

## ✅ Testing Abschluss

**Nachdem du alle Tests durchgeführt hast:**

1. **Anzahl Bugs gefunden:** ____
2. **Kritische Bugs (🔴):** ____
3. **Medium Bugs (🟡):** ____
4. **Minor Bugs (🟢):** ____

**Empfehlung:**
- **0-2 Minor Bugs:** ✅ Bereit für Development Deployment
- **1-2 Medium Bugs:** ⚠️ Bugs fixen, dann deployen
- **Kritische Bugs:** 🔴 Bugs MÜSSEN gefixt werden vor Deployment

---

## 🚀 Nächster Schritt nach Testing

**Sage einfach:**
```
"Testing abgeschlossen, [Anzahl] Bugs gefunden"
```

**Dann:**
1. Falls Bugs → Ich helfe dir sie zu fixen
2. Falls keine/wenige Bugs → Wir deployen auf Vercel mit Dev-Setup!

---

**Viel Erfolg beim Testing, mein Akh! 🧪**

Falls du während des Testings Fragen hast oder etwas nicht funktioniert, sag mir sofort Bescheid!
