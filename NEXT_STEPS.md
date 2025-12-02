# 🎯 Next Steps - Phase 7 Vorbereitung

**Stand:** Phase 6 vollständig abgeschlossen (63.3% Gesamtfortschritt)
**Datum:** 2025-12-02

---

## ✅ Was ist fertig (Phase 6)

### Product Management - KOMPLETT ✨
- ✅ Tailor Profile Completion (Edit Page, API)
- ✅ Product CRUD API Routes (POST, PATCH, DELETE)
- ✅ Image Upload (Supabase Storage, Drag & Drop)
- ✅ Product Create Form (React Hook Form + Zod)
- ✅ Product Management Page (Grid View)
- ✅ Product Edit Page (Pre-fill, Image Management)
- ✅ Navigation & Authorization komplett

**Neue Features:**
- Schneider können ihr Profil vervollständigen
- Vollständiges Product Management Dashboard
- Multi-Image Upload (bis zu 5 Bilder pro Produkt)
- Volle CRUD-Funktionalität mit Ownership-Checks

---

## 🚀 Phase 7: Reviews & Polish - TODO

**Ziel:** MVP Feature-Complete machen mit Reviews, Search und Polish

### 7.1 Review System (4-5h)
**Was:** Kunden können Bewertungen für Produkte & Schneider abgeben

**Tasks:**
- [ ] Review Model in Prisma (rating, comment, productId, tailorId, userId)
- [ ] API Routes: POST /api/reviews, GET /api/products/[id]/reviews
- [ ] Review Form Component (Rating Stars, Text)
- [ ] Review List Component (Display auf Product Detail)
- [ ] Average Rating Calculation & Display
- [ ] Review Permissions (nur nach Kauf)

**Prompt für Claude:**
```
Wir arbeiten an TailorMarket, Phase 7.1 - Review System.
Referenziere ROADMAP.md, CLAUDE.md.

Erstelle:
1. Prisma Schema: Review model (rating 1-5, comment, productId, tailorId, userId)
2. API Routes: POST /api/reviews, GET /api/products/[id]/reviews
3. ReviewForm Component mit Star Rating
4. ReviewList Component für Product Detail Page
5. Zeige Average Rating auf ProductCard
```

---

### 7.2 Search & Filter Enhancement (3h)
**Was:** Erweiterte Such- und Filterfunktionen

**Tasks:**
- [ ] Search API: Full-text search in product titles/descriptions
- [ ] Filter UI: Price Range Slider, Category Dropdown
- [ ] Sort Options: Price (asc/desc), Rating, Newest
- [ ] Filter State Management (URL params)
- [ ] Filter Persistence across navigation

---

### 7.3 Content Pages (2h)
**Was:** About, How it Works, FAQ Pages

**Tasks:**
- [ ] About Page: Team, Mission, Story
- [ ] How it Works: Detailed Step-by-Step
- [ ] FAQ Page: Accordion mit häufigen Fragen
- [ ] Contact Page: Form oder E-Mail

---

### 7.4 Loading States & Skeletons (2h)
**Was:** Bessere UX mit Loading States

**Tasks:**
- [ ] Skeleton Components (ProductCard, TailorCard, OrderCard)
- [ ] Loading Spinner standardisieren
- [ ] Error Boundaries implementieren
- [ ] Empty States verbessern

---

### 7.5 Responsive Polish (3h)
**Was:** Mobile Experience optimieren

**Tasks:**
- [ ] Mobile Navigation (Hamburger Menu)
- [ ] Touch-friendly Buttons & Forms
- [ ] Responsive Tables → Mobile Cards
- [ ] Image Optimization (next/image)
- [ ] Tablet Breakpoints prüfen

---

### 7.6 SEO Basics (2h)
**Was:** Grundlegendes SEO

**Tasks:**
- [ ] Metadata für alle Seiten (title, description)
- [ ] Open Graph Tags
- [ ] Sitemap.xml generieren
- [ ] robots.txt
- [ ] Alt-Tags für alle Bilder

---

### 7.7 Legal Pages (2h)
**Was:** Rechtlich notwendige Seiten

**Tasks:**
- [ ] Privacy Policy Page
- [ ] Terms of Service Page
- [ ] Impressum Page
- [ ] Footer Links aktualisieren

---

## 📋 Priorität für Phase 7

**High Priority (Must-Have für MVP):**
1. Review System (7.1) - Core Feature
2. Search & Filter (7.2) - UX Critical
3. Loading States (7.4) - Polish
4. Legal Pages (7.7) - Rechtlich erforderlich

**Medium Priority (Nice-to-Have):**
5. Content Pages (7.3) - Marketing
6. Responsive Polish (7.5) - UX
7. SEO Basics (7.6) - Langfristig wichtig

**Total:** ~18-20h für Phase 7

---

## 🔧 Phase 7.1 - Review System (Start)

### Schritt-für-Schritt Plan

**1. Prisma Schema erweitern**
```prisma
model Review {
  id        String   @id @default(cuid())
  rating    Int      // 1-5 stars
  comment   String?

  // Relations
  productId String
  product   Product  @relation(fields: [productId], references: [id])

  tailorId  String
  tailor    Tailor   @relation(fields: [tailorId], references: [id])

  userId    String
  user      User     @relation(fields: [userId], references: [id])

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([productId, userId]) // One review per user per product
  @@index([productId])
  @@index([tailorId])
  @@index([userId])
}
```

**2. Validation Schema**
```typescript
// app/lib/validations.ts
export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10).max(1000).optional(),
  productId: z.string().cuid(),
});
```

**3. API Routes**
- POST /api/reviews - Create review
- GET /api/products/[id]/reviews - Get reviews for product
- GET /api/tailors/[id]/reviews - Get reviews for tailor

**4. Components**
- StarRating Component (interactive)
- ReviewForm Component
- ReviewCard Component
- ReviewList Component

**5. Integration**
- Product Detail Page: Reviews anzeigen
- After Order Completion: Review-Aufforderung
- Tailor Profile: Average Rating anzeigen

---

## 📊 Progress Tracking

**Completed:**
- Phase 1: Foundation ✅ (6/6)
- Phase 2: Authentication ✅ (7/7)
- Phase 3: Marketplace View ✅ (12/12)
- Phase 4: Measurement Provider ✅ (7/7)
- Phase 5: Checkout & Orders ✅ (12/12)
- Phase 6: Tailor Features ✅ (6/6)

**Current:** 50/79 Steps (63.3%)

**Next:** Phase 7 - Reviews & Polish (0/7 Steps)

**ETA bis MVP:** ~2-3 Wochen

---

## 🎯 Success Criteria für Phase 7

Phase 7 ist komplett wenn:
- [ ] Review System funktioniert (Create, Display, Average)
- [ ] Search & Filter erweitert
- [ ] Loading States & Skeletons implementiert
- [ ] Legal Pages erstellt
- [ ] Mobile Experience poliert
- [ ] SEO Basics implementiert
- [ ] E2E Test: Review erstellen → auf Product Detail sichtbar

---

## 💡 Erste Schritte (Nächste Session)

**Prompt für Claude Code:**
```
Hallo! Wir arbeiten an TailorMarket.

Referenziere:
- ROADMAP.md (aktueller Stand)
- NEXT_STEPS.md (diese Datei)
- CLAUDE.md (Code-Richtlinien)

Wir sind bei Phase 7.1 - Review System.
Status: Phase 6 vollständig abgeschlossen (63.3%).

Lass uns mit Phase 7.1 starten: Review System implementieren.
```

---

**Let's go! 🚀**

Nächster Schritt: Phase 7.1 - Review System
