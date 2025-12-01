# TailorMarket

Marketplace-Plattform die Schneider aus Entwicklungsländern mit westlichen Kunden verbindet.

## 📚 Dokumentation

- **[specs.md](./specs.md)** - Komplette technische Spezifikation
- **[ROADMAP.md](./ROADMAP.md)** - Entwicklungs-Roadmap mit Steps
- **[Claude.md](./Claude.md)** - Code-Qualitäts-Richtlinien

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Siehe [ROADMAP.md](./ROADMAP.md) für die Entwicklungs-Schritte.

## 🛠️ Tech Stack

Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, Supabase, Prisma

## 📝 Status

**Phase 5 Complete!** ✅ Checkout & Stripe Payment Integration implementiert (siehe ROADMAP.md)

**Aktueller Fortschritt:** 44/79 Steps (55.7%)
- ✅ Phase 1: Foundation & Layout
- ✅ Phase 2: Authentication
- ✅ Phase 3: Marketplace View
- ✅ Phase 4: Measurement Provider Architecture
- ✅ Phase 5: Checkout & Orders
- ⏳ Phase 6: Tailor Features (Next)

### 🎉 Neue Features (Phase 5)

**Checkout & Payment:**
- 💳 Stripe Payment Integration (Checkout Sessions, Webhooks)
- 📦 Kompletter Checkout Flow (Shipping Address, Methods, Custom Notes)
- ✅ Order Success Page mit Confirmation
- 💰 Platform Commission (10% automatisch berechnet)

**Dashboards:**
- 👤 Customer Dashboard - Orders Liste & Details mit Timeline
- 👔 Tailor Dashboard - Order Management mit Status Updates & Tracking
- 📊 Order Lifecycle: pending → paid → processing → shipped → completed

**Testing:**
```bash
# Siehe docs/PHASE_5_QUICKSTART.md für Details
npm run dev
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Dein Workflow ab jetzt:

### Neues Feature starten:
```

Claude, referenziere specs.md, ROADMAP.md und Claude.md.
Wir sind bei [aktueller Schritt].
Erstelle [Feature].
