# Phase 5 - URL Übersicht

Quick Reference für alle neuen URLs und Endpoints.

## 🌐 Frontend URLs

### Public Pages
| URL | Beschreibung |
|-----|--------------|
| `/` | Homepage |
| `/products` | Produktliste |
| `/products/[id]` | Produktdetails mit "Jetzt bestellen" Button |
| `/products/[id]/checkout` | **NEU** Checkout Formular |
| `/order/success?session_id=xxx` | **NEU** Bestellbestätigung |

### Customer Pages
| URL | Beschreibung |
|-----|--------------|
| `/dashboard` | **NEU** Customer Dashboard - Orders Liste |
| `/dashboard/orders/[orderId]` | **NEU** Order Details mit Timeline |

### Tailor Pages
| URL | Beschreibung |
|-----|--------------|
| `/tailor/orders` | **NEU** Tailor Dashboard - Order Management |
| `/tailor/orders/[orderId]` | **NEU** Order Details mit Status Update |

## 🔌 API Endpoints

### Checkout & Payment
| Method | Endpoint | Beschreibung |
|--------|----------|--------------|
| `POST` | `/api/checkout` | **NEU** Stripe Checkout Session erstellen |
| `GET` | `/api/checkout/session?session_id=xxx` | **NEU** Order Details nach Session ID |
| `POST` | `/api/webhooks/stripe` | **NEU** Stripe Webhook Handler |

### Orders
| Method | Endpoint | Beschreibung |
|--------|----------|--------------|
| `GET` | `/api/orders` | **NEU** Orders Liste (Customer/Tailor) |
| `GET` | `/api/orders?status=paid` | Filter nach Status |
| `GET` | `/api/orders/[orderId]` | **NEU** Order Details |
| `PATCH` | `/api/orders/[orderId]` | **NEU** Order Status Update (Tailor only) |

### Required Headers
```bash
# Customer Request
x-user-id: customer-id-123
x-user-role: customer

# Tailor Request
x-user-id: tailor-id-456
x-user-role: tailor
```

## 🧪 Testing Flow

### 1. Browse & Select Product
```
http://localhost:3000/products
→ Klick auf Produkt
→ Klick "Jetzt bestellen"
```

### 2. Checkout
```
http://localhost:3000/products/[id]/checkout
→ Fülle Formular aus
→ Klick "Zur Zahlung"
→ Redirect zu Stripe Checkout
```

### 3. Payment (Stripe Test Card)
```
Card: 4242 4242 4242 4242
Date: 12/34
CVV: 123
→ "Pay" klicken
```

### 4. Success & Confirmation
```
http://localhost:3000/order/success?session_id=cs_xxx
→ Bestellbestätigung
→ "Zum Dashboard" klicken
```

### 5. Customer Dashboard
```
http://localhost:3000/dashboard
→ Orders Liste
→ Klick "Details"
→ Order Timeline
```

### 6. Tailor Dashboard
```
http://localhost:3000/tailor/orders
→ Neue Bestellung im "Neu" Tab
→ Klick "Details"
→ Status Update zu "processing"
→ Status Update zu "shipped" (mit Tracking)
```

## 🔐 Authorization

**Aktuell (MVP):**
- Verwendet Header `x-user-id` und `x-user-role`
- Keine echte Auth-Integration

**TODO (Phase 6):**
- Integration mit Phase 2 Auth System
- Session-basierte User-Erkennung
- Auth Guards für Protected Routes

## 💡 Tipps

### Order Status Flow
```
pending → paid → processing → shipped → completed
                      ↓
                  cancelled
```

### Platform Fees
```
Customer zahlt: €100
Platform Fee:   €10 (10%)
Tailor erhält:  €90
```

### Webhook Events
```
checkout.session.completed → Order erstellt (status: paid)
payment_intent.succeeded   → Order bezahlt
payment_intent.failed      → Order storniert
```

### Stripe Test Cards
```
Erfolg:       4242 4242 4242 4242
Abgelehnt:    4000 0000 0000 0002
3D Secure:    4000 0025 0000 3155
```

## 📊 Monitoring

### Dev Server Logs
```bash
# Terminal 1: Next.js
npm run dev
→ Watch für API Requests & Errors

# Terminal 2: Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe
→ Watch für Webhook Events
```

### Database
```bash
npx prisma studio
→ http://localhost:5555
→ Inspect: Order, OrderItem tables
```

### Stripe Dashboard
```
https://dashboard.stripe.com/test/payments
→ Alle Payments & Events
```

---

**Phase 5 Status:** ✅ Vollständig implementiert
**Next:** Phase 6 - Tailor Features (Product Management)
