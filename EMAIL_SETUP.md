# 📧 Email System - Setup & Verwendung

**Status:** ✅ Complete
**Datum:** 2025-12-14
**Tech Stack:** React Email + Resend

---

## 📋 Übersicht

Das Email-System von TailorMarket nutzt:
- **React Email** - Typsichere Email-Templates mit React Components
- **Resend** - Moderner Email-Versand-Service (DSGVO-konform)
- **Dynamische Imports** - Templates werden nur bei Bedarf geladen

---

## 🚀 Quick Start

### 1. Resend Account erstellen

1. Gehe zu [resend.com](https://resend.com)
2. Erstelle einen Account (kostenloses Limit: 3000 Emails/Monat)
3. Verifiziere deine Domain ODER nutze die Resend-Test-Domain
4. Generiere einen API Key unter [API Keys](https://resend.com/api-keys)

### 2. Environment Variables setzen

Füge zu `.env.local` hinzu:

```bash
RESEND_API_KEY="re_..."
EMAIL_FROM="TailorMarket <noreply@tailormarket.com>"
EMAIL_REPLY_TO="support@tailormarket.com"
NEXT_PUBLIC_URL="http://localhost:3000"
```

### 3. Test-Email versenden

```bash
# Dev-Server starten
npm run dev

# Test-Email senden (öffne im Browser):
http://localhost:3000/api/test-email?type=welcome&email=deine@email.com
```

---

## 📧 Verfügbare Email-Templates

### 1. Welcome Email (Willkommens-Email)

**Wann:** Nach Registrierung
**Empfänger:** Customer oder Tailor
**Inhalt:** Willkommenstext, erste Schritte, Benefits

**Verwendung:**
```typescript
import { sendWelcomeEmail } from '@/lib/email';

await sendWelcomeEmail({
  to: 'user@example.com',
  userName: 'Max Mustermann',
  userRole: 'customer', // oder 'tailor'
});
```

**Test:**
```
GET /api/test-email?type=welcome&email=test@example.com
GET /api/test-email?type=welcome-tailor&email=test@example.com
```

---

### 2. Order Confirmation (Bestellbestätigung)

**Wann:** Nach erfolgreicher Bestellung
**Empfänger:** Customer
**Inhalt:** Bestellnummer, Produktdetails, nächste Schritte

**Verwendung:**
```typescript
import { sendOrderConfirmationEmail, formatCurrency, formatDate, generateOrderNumber } from '@/lib/email';

await sendOrderConfirmationEmail({
  to: customer.email,
  customerName: customer.name,
  orderNumber: generateOrderNumber(order.id),
  orderDate: formatDate(order.createdAt),
  productTitle: product.title,
  productPrice: formatCurrency(product.price),
  tailorName: tailor.name,
  orderId: order.id,
});
```

**Test:**
```
GET /api/test-email?type=order-confirmation&email=test@example.com
```

---

### 3. Order Notification (Bestellbenachrichtigung Schneider)

**Wann:** Nach erfolgreicher Bestellung
**Empfänger:** Tailor
**Inhalt:** Bestelldetails, Kunde, Lieferadresse, Maße-Link

**Verwendung:**
```typescript
import { sendOrderNotificationTailorEmail } from '@/lib/email';

await sendOrderNotificationTailorEmail({
  to: tailor.email,
  tailorName: tailor.name,
  orderNumber: generateOrderNumber(order.id),
  orderDate: formatDate(order.createdAt),
  customerName: customer.name,
  productTitle: product.title,
  productPrice: formatCurrency(product.price),
  shippingAddress: {
    street: order.shippingAddress.street,
    city: order.shippingAddress.city,
    postalCode: order.shippingAddress.postalCode,
    country: order.shippingAddress.country,
  },
  orderId: order.id,
});
```

**Test:**
```
GET /api/test-email?type=order-notification&email=test@example.com
```

---

### 4. Order Status Update (Statusaktualisierung)

**Wann:** Bei Status-Änderungen
**Empfänger:** Customer
**Inhalt:** Neuer Status, Tracking-Nummer (bei Versand), nächste Schritte

**Stati:**
- `measuring` - Maßprüfung
- `production` - In Produktion
- `shipping` - Versandt (mit Tracking-Nummer)
- `completed` - Zugestellt (mit Review-Aufforderung)

**Verwendung:**
```typescript
import { sendOrderStatusUpdateEmail } from '@/lib/email';

await sendOrderStatusUpdateEmail({
  to: customer.email,
  customerName: customer.name,
  orderNumber: generateOrderNumber(order.id),
  productTitle: product.title,
  tailorName: tailor.name,
  status: 'shipping', // 'measuring' | 'production' | 'shipping' | 'completed'
  trackingNumber: 'DHL1234567890', // nur bei status='shipping'
  orderId: order.id,
});
```

**Test:**
```
GET /api/test-email?type=order-status&status=measuring&email=test@example.com
GET /api/test-email?type=order-status&status=production&email=test@example.com
GET /api/test-email?type=order-status&status=shipping&email=test@example.com
GET /api/test-email?type=order-status&status=completed&email=test@example.com
```

---

## 🛠️ Helper Functions

### formatCurrency(amount, currency?)

Formatiert Beträge im deutschen Format.

```typescript
import { formatCurrency } from '@/lib/email';

formatCurrency(299.99) // "299,99 €"
formatCurrency(299.99, 'USD') // "299,99 $"
```

### formatDate(date)

Formatiert Datum im deutschen Format.

```typescript
import { formatDate } from '@/lib/email';

formatDate(new Date()) // "14. Dezember 2024"
formatDate('2024-12-14') // "14. Dezember 2024"
```

### generateOrderNumber(orderId)

Generiert leserliche Bestellnummern.

```typescript
import { generateOrderNumber } from '@/lib/email';

generateOrderNumber('clx123abc456') // "TM-2024-CLX123AB"
```

---

## 📂 File Structure

```
my-marketplace/
├── emails/                           # Email Templates (React Email)
│   ├── order-confirmation.tsx        # Bestellbestätigung (Customer)
│   ├── order-notification-tailor.tsx # Bestellbenachrichtigung (Tailor)
│   ├── order-status-update.tsx       # Statusaktualisierung
│   └── welcome.tsx                   # Willkommens-Email
│
├── app/
│   ├── lib/
│   │   └── email.ts                  # Email-Sending Logic
│   │
│   └── api/
│       └── test-email/               # Test-API Route (nur Dev)
│           └── route.ts
│
└── .env.local.example                # Environment Variables Beispiel
```

---

## 🔌 Integration in API Routes

### Beispiel: Nach Bestellung

```typescript
// app/api/webhooks/stripe/route.ts

import { sendOrderConfirmationEmail, sendOrderNotificationTailorEmail } from '@/lib/email';

// Nach erfolgreicher Stripe Payment
if (event.type === 'checkout.session.completed') {
  const order = await prisma.order.findUnique({
    where: { id: session.metadata.orderId },
    include: {
      user: true,
      items: { include: { product: { include: { tailor: { include: { user: true } } } } } }
    },
  });

  // Email an Customer
  await sendOrderConfirmationEmail({
    to: order.user.email,
    customerName: order.user.name,
    orderNumber: generateOrderNumber(order.id),
    orderDate: formatDate(order.createdAt),
    productTitle: order.items[0].product.title,
    productPrice: formatCurrency(order.totalAmount),
    tailorName: order.items[0].product.tailor.name,
    orderId: order.id,
  });

  // Email an Tailor
  await sendOrderNotificationTailorEmail({
    to: order.items[0].product.tailor.user.email,
    tailorName: order.items[0].product.tailor.name,
    orderNumber: generateOrderNumber(order.id),
    orderDate: formatDate(order.createdAt),
    customerName: order.user.name,
    productTitle: order.items[0].product.title,
    productPrice: formatCurrency(order.totalAmount),
    shippingAddress: order.shippingAddress,
    orderId: order.id,
  });
}
```

### Beispiel: Nach Registrierung

```typescript
// app/api/auth/register/route.ts

import { sendWelcomeEmail } from '@/lib/email';

const user = await prisma.user.create({
  data: { email, password, role },
});

// Welcome Email senden
await sendWelcomeEmail({
  to: user.email,
  userName: user.name || user.email,
  userRole: user.role,
});
```

### Beispiel: Status-Update

```typescript
// app/api/orders/[id]/route.ts

import { sendOrderStatusUpdateEmail } from '@/lib/email';

// PATCH /api/orders/[id]
await prisma.order.update({
  where: { id },
  data: { status: 'shipping', trackingNumber },
});

// Email an Customer
await sendOrderStatusUpdateEmail({
  to: order.user.email,
  customerName: order.user.name,
  orderNumber: generateOrderNumber(order.id),
  productTitle: order.items[0].product.title,
  tailorName: order.items[0].product.tailor.name,
  status: 'shipping',
  trackingNumber,
  orderId: order.id,
});
```

---

## 🔐 Production Setup

### 1. Domain verifizieren

In Resend Dashboard:
1. Gehe zu **Domains**
2. Klicke auf **Add Domain**
3. Gib deine Domain ein (z.B. `tailormarket.com`)
4. Füge die DNS Records hinzu (SPF, DKIM, DMARC)
5. Warte auf Verifizierung (ca. 1-24h)

### 2. Production API Key generieren

1. Gehe zu **API Keys**
2. Erstelle neuen Key
3. Kopiere und speichere sicher
4. Setze in Vercel Environment Variables:
   ```
   RESEND_API_KEY=re_...
   EMAIL_FROM=TailorMarket <noreply@tailormarket.com>
   EMAIL_REPLY_TO=support@tailormarket.com
   ```

### 3. Test-Route deaktivieren

Die `/api/test-email` Route ist automatisch nur in Development verfügbar:

```typescript
if (process.env.NODE_ENV === 'production') {
  return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
}
```

---

## 📊 Monitoring

### Resend Dashboard

- **Logs:** Alle gesendeten Emails anzeigen
- **Analytics:** Öffnungsraten, Bounce-Rate
- **Webhooks:** Email-Events tracken (delivered, opened, clicked)

### Error Handling

Alle Email-Funktionen geben ein Result-Object zurück:

```typescript
try {
  const result = await sendWelcomeEmail({ ... });
  // result = { success: true, data: { id: '...', ... } }
} catch (error) {
  // Email-Versand fehlgeschlagen
  console.error('Email error:', error);
  // Optional: Sentry reporting
}
```

---

## 🎨 Email Templates anpassen

### Template bearbeiten

```bash
# Template öffnen
code emails/welcome.tsx

# Änderungen vornehmen (React Components)
# Live-Vorschau mit React Email CLI (optional):
npm install -g react-email
email dev
```

### Styles anpassen

Alle Templates nutzen Inline-Styles (email-kompatibel):

```typescript
const button = {
  backgroundColor: '#2563eb', // Primärfarbe ändern
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  padding: '12px 32px',
};
```

---

## ❓ Troubleshooting

### Email wird nicht versendet

1. **Check RESEND_API_KEY**: Ist der Key korrekt in `.env.local`?
2. **Check Logs**: Siehe Terminal für Error Messages
3. **Check Resend Dashboard**: Zeigt Logs aller Requests
4. **Test mit API Route**: `GET /api/test-email?type=welcome&email=test@example.com`

### Email landet im Spam

1. **Domain verifizieren**: SPF, DKIM, DMARC Records hinzufügen
2. **Email-Content prüfen**: Keine Spam-Keywords
3. **Warm-up**: Starte mit wenigen Emails pro Tag
4. **Reply-To setzen**: Erhöht Deliverability

### Rate Limits

**Free Tier:**
- 100 Emails/Tag
- 3000 Emails/Monat

**Lösung:**
- Upgrade auf [Pro Plan](https://resend.com/pricing) (20 USD/Monat)
- Oder nutze Queuing für viele Emails

---

## 📋 Checkliste für Production

- [ ] Resend Account erstellt
- [ ] Domain verifiziert (SPF, DKIM, DMARC)
- [ ] Production API Key generiert
- [ ] Environment Variables in Vercel gesetzt
- [ ] Test-Email versendet an echte Email-Adresse
- [ ] Email-Integration in Stripe Webhook getestet
- [ ] Email-Integration in Register-Flow getestet
- [ ] Monitoring & Logging aktiviert
- [ ] Spam-Test durchgeführt (z.B. mit mail-tester.com)

---

## 📚 Ressourcen

- [Resend Dokumentation](https://resend.com/docs)
- [React Email Dokumentation](https://react.email/docs)
- [Email Testing Tool](https://www.mail-tester.com/)
- [SPF/DKIM Checker](https://mxtoolbox.com/)

---

**Version:** 1.0
**Letztes Update:** 2025-12-14
**Erstellt von:** Claude Code
