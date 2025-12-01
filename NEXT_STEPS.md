# 🎯 Next Steps - Phase 6 Vorbereitung

**Stand:** Phase 5 vollständig abgeschlossen (55.7% Gesamtfortschritt)
**Datum:** 2025-12-01

---

## ✅ Was ist fertig (Phase 5)

### Checkout & Payment Integration - KOMPLETT
- ✅ Stripe Payment Flow (Checkout Sessions, Webhooks)
- ✅ Order Management System (Database, API Routes)
- ✅ Customer Dashboard (Orders anzeigen, tracken)
- ✅ Tailor Dashboard (Orders verwalten, Status updates)
- ✅ Platform Commission (10% automatisch berechnet)
- ✅ Vollständige Dokumentation (3 Guide-Dateien)

**Dokumentation:**
- `docs/PHASE_5_IMPLEMENTATION.md` - Vollständige Feature-Dokumentation
- `docs/PHASE_5_QUICKSTART.md` - Testing Guide
- `docs/PHASE_5_URLS.md` - URL & Endpoint Reference

---

## 🚀 Phase 6: Tailor Features - TODO

**Ziel:** Schneider können ihre Produkte selbst verwalten

### 6.1 Tailor Profile Completion (2-3h)
**Was:** Schneider können ihr Profil vervollständigen

**Tasks:**
- [ ] TailorProfile Model erweitern (falls nötig)
- [ ] API Route: `PATCH /api/tailor/profile`
- [ ] Profile Edit Page: `/tailor/profile/edit`
- [ ] Form: businessName, bio, specialties, location, languages
- [ ] Avatar Upload (Supabase Storage)

**Prompt für Claude:**
```
Wir arbeiten an TailorMarket, Phase 6.1 - Tailor Profile Completion.
Referenziere ROADMAP.md, CLAUDE.md.

Erstelle:
1. API Route: PATCH /api/tailor/profile (Update Tailor Profile)
2. Profile Edit Page mit React Hook Form + Zod
3. Felder: businessName, bio, specialties[], location, languages[]
4. Avatar Upload später (erstmal Placeholder)
```

---

### 6.2 Product CRUD API Routes (3h)
**Was:** Backend API für Product Management

**Tasks:**
- [ ] `POST /api/tailor/products` - Produkt erstellen
- [ ] `PATCH /api/tailor/products/[id]` - Produkt editieren
- [ ] `DELETE /api/tailor/products/[id]` - Produkt löschen
- [ ] Validation: productSchema (Zod)
- [ ] Authorization: Nur eigene Produkte editierbar

---

### 6.3 Image Upload (2h)
**Was:** Produktbilder hochladen

**Tasks:**
- [ ] Supabase Storage Bucket: `product-images`
- [ ] API Route: `POST /api/upload/product-image`
- [ ] Image Upload Component mit Drag & Drop
- [ ] Image Resize (Client-Side) auf max 1200px
- [ ] Multiple Images Support (max 5)

---

### 6.4 Product Create Form (3h)
**Was:** Schneider können neue Produkte anlegen

**Tasks:**
- [ ] Page: `/tailor/products/new`
- [ ] Multi-Step Form:
  - Step 1: Basics (title, description, category)
  - Step 2: Pricing (price, productionTime)
  - Step 3: Images Upload
- [ ] Preview vor Submit
- [ ] Success → Redirect zu `/tailor/products`

---

### 6.5 Product Management Page (3h)
**Was:** Übersicht aller Produkte des Schneiders

**Tasks:**
- [ ] Page: `/tailor/products`
- [ ] ProductTable mit Actions (Edit, Delete, Toggle Active)
- [ ] Filter: Active/Inactive
- [ ] Button: "Neues Produkt"
- [ ] Empty State wenn keine Produkte

---

### 6.6 Product Edit Page (2h)
**Was:** Bestehende Produkte bearbeiten

**Tasks:**
- [ ] Page: `/tailor/products/[id]/edit`
- [ ] Pre-fill Form mit bestehenden Daten
- [ ] Image Management (Upload neue, Delete alte)
- [ ] Update API Call
- [ ] Success → Redirect zurück

---

## 📋 Detaillierter Plan für Phase 6.1 (Start)

### Schritt-für-Schritt Anleitung

**1. Prisma Schema prüfen**
```bash
# Check: Gibt es schon ein TailorProfile model?
# Falls ja: Welche Felder fehlen?
npx prisma studio
```

**2. API Route erstellen**
```typescript
// app/api/tailor/profile/route.ts
export async function PATCH(req: NextRequest) {
  // Get tailorId from auth
  // Validate with tailorProfileSchema
  // Update prisma.tailorProfile
  // Return updated profile
}
```

**3. Validation Schema**
```typescript
// app/lib/validations.ts
export const tailorProfileSchema = z.object({
  businessName: z.string().min(2).max(100),
  bio: z.string().max(500),
  location: z.string(),
  specialties: z.array(z.string()),
  languages: z.array(z.string()),
  yearsExperience: z.number().min(0).max(50),
});
```

**4. Profile Edit Page**
```tsx
// app/(marketplace)/tailor/profile/edit/page.tsx
// React Hook Form + Zod
// Pre-fill mit bestehenden Daten
// Multi-Select für specialties, languages
```

**5. Navigation Update**
```tsx
// Tailor Dashboard: Link zu Profile Edit
```

---

## 🧪 Testing Checklist (Phase 5)

Vor Start von Phase 6, verify dass alles funktioniert:

### Quick Test
```bash
# Terminal 1
npm run dev

# Terminal 2
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Browser Test:
# 1. http://localhost:3000/products
# 2. Produkt wählen → "Jetzt bestellen"
# 3. Checkout ausfüllen
# 4. Zahlen: 4242 4242 4242 4242
# 5. Success Page → Dashboard
# 6. Order Detail öffnen
# 7. Tailor Dashboard: http://localhost:3000/tailor/orders
# 8. Order öffnen, Status zu "processing" ändern
```

### Expected Results
- ✅ Order wird erstellt (status: paid)
- ✅ Customer sieht Order in Dashboard
- ✅ Tailor sieht Order in "Neu" Tab
- ✅ Status Update funktioniert
- ✅ Customer sieht Update im Dashboard

---

## 📂 Project Structure (Current)

```
my-marketplace/
├── app/
│   ├── (marketplace)/
│   │   ├── products/[id]/checkout/     ✅ Phase 5
│   │   ├── order/success/              ✅ Phase 5
│   │   ├── dashboard/                  ✅ Phase 5
│   │   └── tailor/orders/              ✅ Phase 5
│   ├── api/
│   │   ├── checkout/                   ✅ Phase 5
│   │   ├── webhooks/stripe/            ✅ Phase 5
│   │   └── orders/                     ✅ Phase 5
│   ├── lib/
│   │   └── stripe/                     ✅ Phase 5
│   └── types/
│       └── order.ts                    ✅ Phase 5
├── docs/
│   ├── PHASE_5_IMPLEMENTATION.md       ✅ New
│   ├── PHASE_5_QUICKSTART.md           ✅ New
│   └── PHASE_5_URLS.md                 ✅ New
└── ROADMAP.md                          ✅ Updated
```

**Next (Phase 6):**
```
app/
├── (marketplace)/tailor/
│   ├── profile/edit/page.tsx          🔜 6.1
│   └── products/
│       ├── page.tsx                   🔜 6.5
│       ├── new/page.tsx               🔜 6.4
│       └── [id]/edit/page.tsx         🔜 6.6
└── api/tailor/
    ├── profile/route.ts               🔜 6.1
    └── products/
        ├── route.ts                   🔜 6.2
        └── [id]/route.ts              🔜 6.2
```

---

## 🔧 Environment Check

Vor Start Phase 6:

```bash
# 1. Dependencies aktuell?
npm outdated

# 2. Prisma Schema synced?
npx prisma db push

# 3. Types generiert?
npx prisma generate

# 4. Build funktioniert?
npm run build

# 5. Keine TypeScript Errors?
npx tsc --noEmit
```

---

## 💡 Erste Schritte (Nächste Session)

**Prompt für Claude Code:**
```
Hallo! Wir arbeiten an TailorMarket.

Referenziere:
- ROADMAP.md (aktueller Stand)
- NEXT_STEPS.md (diese Datei)
- CLAUDE.md (Code-Richtlinien)

Wir sind bei Phase 6.1 - Tailor Profile Completion.
Status: Phase 5 vollständig abgeschlossen (55.7%).

Lass uns mit Phase 6.1 starten: Tailor Profile Edit Page.
```

**Was Claude tun wird:**
1. ROADMAP.md lesen → Versteht aktuellen Stand
2. NEXT_STEPS.md lesen → Weiß was zu tun ist
3. Phase 6.1 implementieren

---

## 📊 Progress Tracking

**Completed:**
- Phase 1: Foundation ✅ (6/6)
- Phase 2: Authentication ✅ (7/7)
- Phase 3: Marketplace View ✅ (12/12)
- Phase 4: Measurement Provider ✅ (7/7)
- Phase 5: Checkout & Orders ✅ (12/12)

**Current:** 44/79 Steps (55.7%)

**Next:** Phase 6 - Tailor Features (0/6 Steps)

**ETA bis MVP:** ~3-4 Wochen bei aktuellem Tempo

---

## 🎯 Success Criteria für Phase 6

Phase 6 ist komplett wenn:
- [ ] Schneider können ihr Profil vervollständigen
- [ ] Schneider können Produkte erstellen/editieren/löschen
- [ ] Produktbilder können hochgeladen werden
- [ ] Product Management Page funktioniert
- [ ] E2E Test: Neues Produkt erstellen → auf Marketplace sichtbar

---

**Let's go! 🚀**

Nächster Schritt: Phase 6.1 - Tailor Profile Completion
