# Phase 6: Tailor Features - Implementierungs-Dokumentation

**Status:** ✅ COMPLETE
**Datum:** 2025-12-02
**Dauer:** ~15h

---

## 📋 Übersicht

Phase 6 implementiert die komplette Product Management Funktionalität für Schneider:
- Profil vervollständigen
- Produkte erstellen, bearbeiten, löschen
- Bilder hochladen (Supabase Storage)
- Product Management Dashboard

---

## ✅ Implementierte Features

### 6.1 - Tailor Profile Completion

**Dateien:**
- `app/api/tailor/profile/route.ts` - GET & PATCH API Routes
- `app/(marketplace)/tailor/profile/edit/page.tsx` - Profile Edit Page
- `app/lib/validations.ts` - tailorProfileSchema
- `components/ui/textarea.tsx` - Textarea Component
- `prisma/schema.prisma` - Tailor model erweitert

**Features:**
- ✅ Profile Edit Form mit Pre-fill
- ✅ Felder: name, businessName, bio, country, city, location, specialties, languages, yearsExperience, phone, website
- ✅ Validation mit Zod
- ✅ Success/Error Messages
- ✅ Navigation zu Profile aus Tailor Dashboard

**API Endpoints:**
```typescript
GET /api/tailor/profile
Headers: x-user-id, x-user-role

Response: { tailor: TailorProfile }

PATCH /api/tailor/profile
Headers: x-user-id, x-user-role
Body: TailorProfileInput

Response: { success: true, tailor, message }
```

---

### 6.2 - Product CRUD API Routes

**Dateien:**
- `app/api/tailor/products/route.ts` - POST & GET
- `app/api/tailor/products/[id]/route.ts` - GET, PATCH, DELETE
- `app/lib/validations.ts` - productSchema, updateProductSchema

**Features:**
- ✅ Create Product (POST /api/tailor/products)
- ✅ List Products (GET /api/tailor/products)
- ✅ Get Product (GET /api/tailor/products/[id])
- ✅ Update Product (PATCH /api/tailor/products/[id])
- ✅ Delete Product (DELETE /api/tailor/products/[id])
- ✅ Authorization: Nur eigene Produkte editierbar
- ✅ Protection: Produkte mit Orders nicht löschbar

**API Endpoints:**

```typescript
// Create Product
POST /api/tailor/products
Headers: x-user-id, x-user-role
Body: { title, description, price, category }
Response: { success: true, product, message }

// List Products
GET /api/tailor/products
Headers: x-user-id, x-user-role
Response: { products: Product[] }

// Get Single Product
GET /api/tailor/products/[id]
Headers: x-user-id, x-user-role
Response: { product: Product }

// Update Product
PATCH /api/tailor/products/[id]
Headers: x-user-id, x-user-role
Body: Partial<ProductInput>
Response: { success: true, product, message }

// Delete Product
DELETE /api/tailor/products/[id]
Headers: x-user-id, x-user-role
Response: { success: true, message }
Error: Cannot delete product with existing orders
```

---

### 6.3 - Image Upload

**Dateien:**
- `app/api/upload/product-image/route.ts` - Upload API
- `components/tailor/ImageUpload.tsx` - Upload Component

**Features:**
- ✅ Upload to Supabase Storage
- ✅ Drag & Drop Support
- ✅ Client-Side Preview
- ✅ Validation: Max 5MB, only JPG/PNG/WebP
- ✅ Multiple Images (max 5 per product)
- ✅ Delete Images (API + UI)
- ✅ Image Position Management

**API Endpoints:**

```typescript
// Upload Image
POST /api/upload/product-image
Headers: x-user-id, x-user-role
FormData: {
  file: File,
  productId?: string,
  position?: number
}
Response: {
  success: true,
  url: string,
  fileName: string,
  productImage?: ProductImage
}

// Delete Image
DELETE /api/upload/product-image
Headers: x-user-id, x-user-role
Body: {
  fileName: string,
  productImageId?: string
}
Response: { success: true, message }
```

**Component Usage:**
```tsx
<ImageUpload
  onUploadSuccess={(url, fileName) => handleSuccess(url, fileName)}
  onUploadError={(error) => handleError(error)}
  productId="product-id-optional"
  position={0}
  maxSize={5}
/>
```

---

### 6.4 - Product Create Form

**Dateien:**
- `app/(marketplace)/tailor/products/new/page.tsx`

**Features:**
- ✅ Multi-Section Form (Basics, Pricing, Images)
- ✅ React Hook Form + Zod Validation
- ✅ Image Upload Integration
- ✅ Preview before Submit
- ✅ Success Message & Redirect
- ✅ Error Handling

**Form Fields:**
- title* (string, min 3, max 200)
- description (string, max 2000)
- category (string, max 100)
- price* (number, min 1, max 100000)
- images (up to 5)

---

### 6.5 - Product Management Page

**Dateien:**
- `app/(marketplace)/tailor/products/page.tsx`

**Features:**
- ✅ Grid View mit Product Cards
- ✅ Product Image Display
- ✅ Quick Actions: View, Edit, Delete
- ✅ Empty State für neue Schneider
- ✅ Stats: Anzahl Produkte, Durchschnittspreis
- ✅ Delete Confirmation
- ✅ Link zu Product Detail (öffnet in neuem Tab)

**URL:** `/tailor/products`

---

### 6.6 - Product Edit Page

**Dateien:**
- `app/(marketplace)/tailor/products/[id]/edit/page.tsx`

**Features:**
- ✅ Pre-filled Form mit bestehenden Daten
- ✅ Existing Images Display & Management
- ✅ Upload neue Images
- ✅ Delete alte Images
- ✅ Update API Integration
- ✅ Success Message & Redirect
- ✅ 404 Handling für nicht-existente Produkte

**URL:** `/tailor/products/[id]/edit`

---

## 🗂️ Dateistruktur

```
my-marketplace/
├── app/
│   ├── api/
│   │   ├── tailor/
│   │   │   ├── profile/
│   │   │   │   └── route.ts          (NEW - GET, PATCH)
│   │   │   └── products/
│   │   │       ├── route.ts          (NEW - POST, GET)
│   │   │       └── [id]/
│   │   │           └── route.ts      (NEW - GET, PATCH, DELETE)
│   │   └── upload/
│   │       └── product-image/
│   │           └── route.ts          (NEW - POST, DELETE)
│   │
│   ├── (marketplace)/
│   │   └── tailor/
│   │       ├── profile/
│   │       │   └── edit/
│   │       │       └── page.tsx      (NEW)
│   │       ├── products/
│   │       │   ├── page.tsx          (NEW)
│   │       │   ├── new/
│   │       │   │   └── page.tsx      (NEW)
│   │       │   └── [id]/
│   │       │       └── edit/
│   │       │           └── page.tsx  (NEW)
│   │       └── orders/
│   │           └── page.tsx          (MODIFIED - Navigation)
│   │
│   └── lib/
│       └── validations.ts            (MODIFIED - Schemas)
│
├── components/
│   ├── ui/
│   │   └── textarea.tsx              (NEW)
│   └── tailor/
│       └── ImageUpload.tsx           (NEW)
│
├── prisma/
│   └── schema.prisma                 (MODIFIED - Tailor model)
│
└── docs/
    └── PHASE_6_SUMMARY.md            (NEW)
```

---

## 🔑 Key Learnings

### Authorization Pattern
Alle Tailor-API-Routes prüfen:
1. User ID aus Headers
2. User Role = "tailor"
3. Tailor Profile existiert
4. Ownership Check (bei spezifischen Resources)

```typescript
const userId = req.headers.get('x-user-id');
const userRole = req.headers.get('x-user-role');

if (!userId || userRole !== 'tailor') {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
}

const tailor = await prisma.tailor.findUnique({
  where: { user_id: userId }
});

// For specific resources:
const product = await prisma.product.findFirst({
  where: { id: productId, tailorId: tailor.id }
});
```

### Image Upload Pattern
1. Client wählt Bild (Drag & Drop oder File Input)
2. Client validiert (Typ, Größe)
3. Client zeigt Preview
4. Upload zu Supabase Storage
5. Speichere URL in Database (ProductImage)
6. Bei Delete: Lösche aus Storage + Database

### Next.js 15 Async Params
Neue Route Handler Syntax:
```typescript
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // ...
}
```

---

## 🧪 Testing Guide

### Manual Testing Checklist

**Profile Edit:**
- [ ] Navigate to `/tailor/orders`
- [ ] Click "Profil bearbeiten"
- [ ] Fill form, Submit
- [ ] Verify success message
- [ ] Refresh page, verify data persisted

**Product Create:**
- [ ] Navigate to `/tailor/products`
- [ ] Click "Neues Produkt"
- [ ] Fill title, description, price
- [ ] Upload 2-3 images
- [ ] Submit
- [ ] Verify redirect to `/tailor/products`
- [ ] Verify product visible in list

**Product Edit:**
- [ ] Click "Edit" on product
- [ ] Change title
- [ ] Delete one image
- [ ] Upload new image
- [ ] Submit
- [ ] Verify changes saved

**Product Delete:**
- [ ] Click "Delete" on product
- [ ] Confirm dialog
- [ ] Verify product removed from list
- [ ] Try to delete product with orders → Error message

---

## 📊 Database Changes

### Tailor Model Extensions

```prisma
model Tailor {
  // ... existing fields ...

  // NEW FIELDS:
  businessName    String?
  bio             String?
  country         String?
  city            String?
  location        String?
  specialties     String[]  @default([])
  languages       String[]  @default([])
  yearsExperience Int?
  phone           String?
  website         String?
  isVerified      Boolean   @default(false)
  isActive        Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

**Migration Command:**
```bash
npx prisma db push
npx prisma generate
```

---

## 🚀 Next Steps (Phase 7)

Phase 6 ist komplett! Nächste Features:
- Review System (Bewertungen)
- Search & Filter Enhancement
- Content Pages (About, FAQ)
- Loading States & Skeletons
- SEO Basics
- Legal Pages

Siehe [NEXT_STEPS.md](../NEXT_STEPS.md)

---

## 📝 Notes

- Alle API Routes verwenden noch Dummy Auth (`x-user-id: dummy-tailor-id`)
- TODO: Real Authentication Integration in Phase 2
- Image Upload erfordert Supabase Storage Bucket: `product-images`
- Max 5 Bilder pro Produkt (kann in productSchema angepasst werden)
- Produkte mit Orders können nicht gelöscht werden (Business Logic)

---

**Phase 6 Status:** ✅ COMPLETE
**Total Features:** 6/6
**Overall Progress:** 50/79 Steps (63.3%)
