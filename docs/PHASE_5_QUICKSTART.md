# Phase 5 - Quick Start Guide

Schnellanleitung zum Testen der Checkout & Payment Integration.

## Setup (einmalig)

### 1. Stripe Test Keys bereits konfiguriert ✅
Die Stripe Test Keys sind bereits in `.env.local` hinterlegt.

### 2. Datenbank Migration ausgeführt ✅
```bash
# Bereits durchgeführt:
npx prisma db push --accept-data-loss
```

### 3. Stripe CLI installieren (für Webhooks)
```bash
# Windows (via Scoop)
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe

# Oder via Download:
# https://github.com/stripe/stripe-cli/releases
```

### 4. Stripe CLI Login
```bash
stripe login
```

## Testing Flow

### Terminal 1: Dev Server
```bash
npm run dev
```
→ Server läuft auf http://localhost:3000

### Terminal 2: Stripe Webhooks
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
→ Kopiere den Webhook Secret und füge ihn in `.env.local` ein:
```
STRIPE_WEBHOOK_SECRET=whsec_...
```

Dann Server neu starten (Terminal 1).

## Test Szenario

### 1. Customer Journey
1. **Browse Products**
   - Öffne http://localhost:3000/products
   - Klicke auf ein Produkt

2. **Checkout**
   - Klicke "Jetzt bestellen"
   - Fülle Lieferadresse aus:
     ```
     Name: Max Mustermann
     Straße: Teststraße 123
     PLZ: 12345
     Stadt: Berlin
     Land: Deutschland
     ```
   - Wähle Versandart: Standard oder Express
   - Optional: Stoffwunsch, Notizen
   - Klicke "Zur Zahlung"

3. **Stripe Payment**
   - Verwende Test-Kreditkarte:
     ```
     Nummer: 4242 4242 4242 4242
     Datum: 12/34 (beliebiges Zukunftsdatum)
     CVV: 123 (beliebig)
     Name: Test User
     ```
   - Klicke "Pay"

4. **Success**
   - Du wirst zu `/order/success` redirected
   - Siehst Bestellbestätigung
   - Klicke "Zum Dashboard"

5. **Dashboard**
   - Öffne http://localhost:3000/dashboard
   - Siehst deine Bestellung
   - Klicke auf "Details"
   - Siehst Status Timeline

### 2. Tailor Journey
1. **Orders Übersicht**
   - Öffne http://localhost:3000/tailor/orders
   - Siehst neue Bestellung im "Neu" Tab
   - Stats zeigen: 1 neue Bestellung

2. **Order Details**
   - Klicke auf Order
   - Siehst:
     - Bestellte Artikel
     - Kunde & Lieferadresse
     - Payment: Dein Anteil (90%)

3. **Status Update**
   - Ändere Status zu "In Bearbeitung"
   - Klicke "Status aktualisieren"
   - ✅ Erfolgsmeldung

4. **Versand**
   - Ändere Status zu "Versendet"
   - Füge Tracking Number ein: `DHL1234567890`
   - Klicke "Status aktualisieren"

5. **Verify Customer View**
   - Zurück zu http://localhost:3000/dashboard
   - Order zeigt jetzt "Versendet"
   - Tracking Number sichtbar

## Stripe Test Cards

### Erfolgreiche Zahlung
```
4242 4242 4242 4242
```

### Abgelehnte Zahlung
```
4000 0000 0000 0002
```

### 3D Secure erforderlich
```
4000 0025 0000 3155
```

Mehr Test Cards: https://stripe.com/docs/testing

## Webhook Events

Im Terminal mit `stripe listen` siehst du:
```
checkout.session.completed → Order wird erstellt
payment_intent.succeeded → Order Status: paid
```

## Datenbank prüfen

```bash
npx prisma studio
```
→ Öffnet http://localhost:5555
→ Schaue in Tables: Order, OrderItem

## Troubleshooting

### Problem: Webhook wird nicht empfangen
**Lösung:**
- Check: `stripe listen` läuft
- Check: `STRIPE_WEBHOOK_SECRET` in `.env.local`
- Restart Dev Server

### Problem: Order wird nicht erstellt
**Lösung:**
- Check Stripe Dashboard → Events
- Check Terminal Logs
- Check Webhook Secret korrekt

### Problem: "Unauthorized" Fehler
**Lösung:**
- Aktuell verwenden wir Dummy User IDs
- Headers: `x-user-id`, `x-user-role` werden in API Routes gesetzt
- TODO: Auth Integration in Phase 6

### Problem: TypeScript Fehler
**Lösung:**
```bash
npm run build
# Check für Fehler
```

## API Testing (optional)

### Checkout Session erstellen
```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user-123" \
  -d '{
    "productId": "YOUR_PRODUCT_ID",
    "quantity": 1,
    "shippingAddress": {
      "name": "Test User",
      "street": "Teststr. 1",
      "city": "Berlin",
      "zip": "12345",
      "country": "Deutschland"
    },
    "shippingMethod": "standard"
  }'
```

### Orders abrufen
```bash
# Als Customer
curl http://localhost:3000/api/orders \
  -H "x-user-id: test-user-123" \
  -H "x-user-role: customer"

# Als Tailor
curl http://localhost:3000/api/orders \
  -H "x-user-id: test-tailor-123" \
  -H "x-user-role: tailor"
```

## URLs Übersicht

| Page | URL | Beschreibung |
|------|-----|--------------|
| Products | `/products` | Produktliste |
| Product Detail | `/products/[id]` | Produktdetails |
| Checkout | `/products/[id]/checkout` | Checkout Form |
| Success | `/order/success?session_id=xxx` | Bestellbestätigung |
| Customer Dashboard | `/dashboard` | Kundenbestellungen |
| Order Details | `/dashboard/orders/[orderId]` | Order Details (Kunde) |
| Tailor Orders | `/tailor/orders` | Schneider Aufträge |
| Tailor Order Detail | `/tailor/orders/[orderId]` | Order Management |

## Nächste Schritte

Nach erfolgreichem Testing:

1. **Auth Integration**
   - Ersetze Dummy User IDs mit echten Session Daten

2. **Email Setup**
   - Bestellbestätigung an Kunde
   - Neue Bestellung an Schneider
   - Status Updates

3. **Production Deployment**
   - Stripe Webhook Endpoint registrieren
   - Environment Variables setzen
   - Test mit Stripe Test Mode

---

**Happy Testing! 🎉**

Bei Fragen: Siehe `docs/PHASE_5_IMPLEMENTATION.md` für Details.
