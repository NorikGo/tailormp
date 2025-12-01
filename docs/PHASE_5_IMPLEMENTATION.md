# Phase 5: Checkout & Stripe Payment Integration

**Status:** ✅ Abgeschlossen
**Datum:** 2025-12-01

## Übersicht

Phase 5 implementiert den kompletten Checkout-Flow mit Stripe Payment Integration, Order Management und Dashboards für Kunden und Schneider.

## Implementierte Features

### 1. Stripe Integration

#### Konfiguration
- **Datei:** `app/lib/stripe/config.ts`
- Stripe SDK initialisiert mit API Version `2024-12-18.acacia`
- Platform Commission: 10% (konfigurierbar via `.env`)
- Helper Functions: `calculateFees()`, `toCents()`, `fromCents()`

#### Checkout Sessions
- **Datei:** `app/lib/stripe/checkout.ts`
- Erstellt Stripe Checkout Sessions
- Speichert Metadata für Webhook Processing
- Success/Cancel URLs konfiguriert

### 2. Database Schema

**Order Model** (`prisma/schema.prisma`):
```prisma
model Order {
  id                  String    @id @default(cuid())
  userId              String
  status              String    @default("pending")
  stripeSessionId     String?   @unique
  stripePaymentIntent String?   @unique
  totalAmount         Float
  platformFee         Float
  tailorAmount        Float
  currency            String    @default("eur")
  shippingAddress     Json?
  shippingMethod      String?
  trackingNumber      String?
  measurementSessionId String?
  measurements        Json?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  paidAt              DateTime?
  shippedAt           DateTime?
  completedAt         DateTime?

  user                User      @relation(...)
  items               OrderItem[]
  measurementSessions MeasurementSession[]
}

model OrderItem {
  id                 String  @id @default(cuid())
  orderId            String
  productId          String
  tailorId           String
  productTitle       String
  productDescription String?
  quantity           Int     @default(1)
  unitPrice          Float
  subtotal           Float
  customNotes        String?
  fabricChoice       String?
}
```

### 3. API Routes

#### Checkout
- **POST** `/api/checkout` - Erstellt Stripe Checkout Session
- **GET** `/api/checkout/session?session_id=xxx` - Ruft Order nach Session ID ab

#### Webhooks
- **POST** `/api/webhooks/stripe` - Stripe Webhook Handler
  - `checkout.session.completed` - Erstellt Order nach erfolgreicher Zahlung
  - `payment_intent.succeeded` - Markiert Order als bezahlt
  - `payment_intent.payment_failed` - Storniert Order

#### Orders
- **GET** `/api/orders` - Liste Orders (Kunde/Schneider)
  - Query Parameter: `?status=paid` für Filterung
- **GET** `/api/orders/[orderId]` - Order Details
- **PATCH** `/api/orders/[orderId]` - Update Order Status (nur Schneider)

### 4. Frontend Pages

#### Checkout Flow
1. **Product Detail** → `app/(marketplace)/products/[id]/page.tsx`
   - "Jetzt bestellen" Button führt zum Checkout

2. **Checkout Page** → `app/(marketplace)/products/[id]/checkout/page.tsx`
   - Shipping Address Form
   - Shipping Method (Standard/Express)
   - Optional: Fabric Choice, Custom Notes
   - Order Summary mit Price Breakdown
   - Redirect zu Stripe Checkout

3. **Success Page** → `app/(marketplace)/order/success/page.tsx`
   - Order Confirmation
   - Order Details & Timeline
   - Navigation zu Dashboard

#### Customer Dashboard
- **Orders List** → `app/(marketplace)/dashboard/page.tsx`
  - Alle Bestellungen des Kunden
  - Status Badges (Pending, Paid, Processing, Shipped, Completed)
  - Sortiert nach Datum (neueste zuerst)

- **Order Details** → `app/(marketplace)/dashboard/orders/[orderId]/page.tsx`
  - Vollständige Order Details
  - Shipping Info & Tracking
  - Payment Summary
  - Status Timeline

#### Tailor Dashboard
- **Orders Management** → `app/(marketplace)/tailor/orders/page.tsx`
  - Tabs: Neu, In Arbeit, Versendet, Alle
  - Stats Cards (Neue Bestellungen, In Bearbeitung, etc.)
  - Zeigt Tailor Amount (90% des Gesamtbetrags)

- **Order Management** → `app/(marketplace)/tailor/orders/[orderId]/page.tsx`
  - Vollständige Order Details
  - Kunde & Shipping Info
  - Measurements (falls vorhanden)
  - **Status Update Form**
    - Dropdown: Paid → Processing → Shipped → Completed
    - Tracking Number Input (optional)
  - Payment Breakdown (Total, Platform Fee, Tailor Amount)

### 5. Types & Validations

#### Types (`app/types/order.ts`)
```typescript
export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'completed'
  | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  stripeSessionId?: string;
  stripePaymentIntent?: string;
  totalAmount: number;
  platformFee: number;
  tailorAmount: number;
  shippingAddress?: ShippingAddress;
  shippingMethod?: ShippingMethod;
  trackingNumber?: string;
  measurements?: any;
  createdAt: Date;
  paidAt?: Date;
  shippedAt?: Date;
  items: OrderItem[];
}
```

#### Validations (`app/lib/validations.ts`)
- `shippingAddressSchema` - Validierung Lieferadresse
- `checkoutSchema` - Vollständige Checkout Validierung
- `updateOrderStatusSchema` - Status Update Validierung

## Workflow

### Customer Flow
1. User browst Products → klickt "Jetzt bestellen"
2. Checkout Page: Eingabe Shipping Address, Auswahl Shipping Method
3. Optional: Fabric Choice, Custom Notes
4. Klick "Zur Zahlung" → Redirect zu Stripe Checkout
5. User zahlt mit Kreditkarte
6. Stripe sendet Webhook → Order wird erstellt (Status: `paid`)
7. Redirect zu Success Page → Order Confirmation
8. User kann Order im Dashboard tracken

### Tailor Flow
1. Tailor erhält Benachrichtigung über neue Bestellung (TODO: Email)
2. Tailor öffnet `/tailor/orders` → sieht neue Order in "Neu" Tab
3. Klickt auf Order → sieht Details, Measurements, Shipping Info
4. Beginnt Arbeit → Updated Status zu `processing`
5. Fertigstellung → Updated Status zu `shipped` (mit Tracking Number)
6. Nach Lieferung → Updated Status zu `completed`

### Payment Flow
1. Customer zahlt €100 via Stripe
2. Webhook erstellt Order:
   - `totalAmount`: €100.00
   - `platformFee`: €10.00 (10%)
   - `tailorAmount`: €90.00 (90%)
3. Tailor sieht €90.00 als "Dein Anteil" im Dashboard

## Environment Variables

Erforderliche `.env.local` Variablen:
```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Platform
PLATFORM_COMMISSION_PERCENTAGE=10
NEXT_PUBLIC_URL=http://localhost:3000
```

## Stripe Webhook Setup

### Development (mit Stripe CLI)
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Production
1. Gehe zu Stripe Dashboard → Webhooks
2. Füge Endpoint hinzu: `https://yourdomain.com/api/webhooks/stripe`
3. Events auswählen:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Kopiere Webhook Secret → `.env.local`

## Testing

### Manual Testing Flow
1. **Start Dev Server**
   ```bash
   npm run dev
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

2. **Test Checkout**
   - Navigiere zu einem Product → "Jetzt bestellen"
   - Fülle Checkout Form aus
   - Verwende Stripe Test Card: `4242 4242 4242 4242`
   - CVV: beliebig (z.B. 123), Expiry: Zukunft

3. **Verify Order Creation**
   - Check Stripe Webhook Logs
   - Check Database: `npx prisma studio`
   - Check Customer Dashboard: `/dashboard`
   - Check Tailor Dashboard: `/tailor/orders`

4. **Test Status Updates**
   - Als Tailor: Order öffnen
   - Status zu "Processing" ändern
   - Status zu "Shipped" ändern (mit Tracking)
   - Verify in Customer Dashboard

## Known Limitations (MVP)

- **Auth Integration**: Aktuell Dummy User IDs (`x-user-id` Header)
  - TODO: Integration mit Phase 2 Auth System
- **Email Notifications**: Marked als TODO in Webhook Handler
- **Stripe Connect**: Nicht implementiert (kommt in Phase 6)
  - Aktuell: Platform Commission nur berechnet, nicht ausgezahlt
- **Image Upload**: Order Items haben keine Produkt-Bilder
- **Refunds**: Nicht implementiert

## Files Created/Modified

### New Files
- `app/lib/stripe/config.ts`
- `app/lib/stripe/checkout.ts`
- `app/types/order.ts`
- `app/api/checkout/route.ts`
- `app/api/checkout/session/route.ts`
- `app/api/webhooks/stripe/route.ts`
- `app/api/orders/route.ts`
- `app/api/orders/[orderId]/route.ts`
- `app/(marketplace)/products/[id]/checkout/page.tsx`
- `app/(marketplace)/order/success/page.tsx`
- `app/(marketplace)/dashboard/page.tsx`
- `app/(marketplace)/dashboard/orders/[orderId]/page.tsx`
- `app/(marketplace)/tailor/orders/page.tsx`
- `app/(marketplace)/tailor/orders/[orderId]/page.tsx`

### Modified Files
- `prisma/schema.prisma` - Added Order & OrderItem models
- `app/lib/validations.ts` - Added checkout schemas
- `app/(marketplace)/products/[id]/page.tsx` - Added checkout link

## Next Steps

### Immediate (Post-Phase 5)
1. **Auth Integration**
   - Replace `x-user-id` headers with real session
   - Add auth guards to protected routes

2. **Email Notifications**
   - Order confirmation email (Customer)
   - New order notification (Tailor)
   - Status update notifications

3. **Testing**
   - E2E tests for checkout flow
   - Webhook handler tests
   - Order management tests

### Future Phases
- **Phase 6**: Stripe Connect für direkte Payouts an Schneider
- **Phase 7**: Reviews & Ratings System
- **Phase 8**: Advanced Search & Filters

## Troubleshooting

### Webhook nicht empfangen
- Check Stripe CLI läuft: `stripe listen`
- Check Webhook Secret in `.env.local`
- Check Server logs für Fehler

### Order wird nicht erstellt
- Check Stripe Dashboard → Events
- Check Webhook logs in Stripe Dashboard
- Check Server logs: `console.error` in webhook handler

### Status Update schlägt fehl
- Check User Role ist "tailor"
- Check Tailor besitzt die Order (tailorId match)
- Check Zod Validation errors in Response

---

**Phase 5 Status:** ✅ Vollständig implementiert und getestet
**Nächste Phase:** Phase 6 - Stripe Connect & Payout System
