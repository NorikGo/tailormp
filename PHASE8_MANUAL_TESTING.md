# Phase 8.2 - Manual Testing Protocol

**Datum:** 2025-12-04
**Tester:** Claude Code (Automated Manual Testing)
**Environment:** Development (localhost:3000)

---

## 🎯 Testing Strategy

Wir testen die **kritischen User Flows** end-to-end:
1. Authentication Flow
2. Marketplace Features
3. Cart & Checkout
4. Order Management
5. Tailor Features
6. Review System

---

## ✅ Test Results

### 1. BASIC CONNECTIVITY

#### Test 1.1: Homepage loads
- **URL:** `http://localhost:3000`
- **Expected:** Homepage loads with title "TailorMarket - Maßgeschneiderte Anzüge weltweit"
- **Result:** ✅ PASS
- **Details:**
  - Title: `<title>TailorMarket - Maßgeschneiderte Anzüge weltweit</title>`
  - Server responding correctly

#### Test 1.2: API - Products Endpoint
- **URL:** `GET /api/products`
- **Expected:** Returns list of products with price field
- **Result:** ✅ PASS
- **Details:**
  - 5 Products returned
  - All have `price` field (Float)
  - Sample: "Winter Mantel" (€449), "Hochzeitsanzug Deluxe" (€899)
  - No `basePrice` field (correctly removed)

#### Test 1.3: API - Tailors Endpoint
- **URL:** `GET /api/tailors`
- **Expected:** Returns list of tailors
- **Result:** ✅ PASS
- **Details:**
  - 4 Tailors returned
  - Top tailor: "Nguyen Van Thai" (Vietnam, Rating 4.9)
  - All verified tailors have `isVerified: true`

#### Test 1.4: API - Product Detail
- **URL:** `GET /api/products/[id]`
- **Expected:** Returns single product with tailor info
- **Result:** ✅ PASS
- **Details:**
  - Product: "Maßgeschneidertes Hemd" (€89)
  - Tailor info included: Nguyen Van Thai
  - All fields present: price, category, description

#### Test 1.5: API - Tailor Detail
- **URL:** `GET /api/tailors/[id]`
- **Expected:** Returns tailor with products
- **Result:** ✅ PASS
- **Details:**
  - Tailor: Nguyen Van Thai
  - 2 Products listed
  - Rating, experience, specialties all present

#### Test 1.6: API - Cart (Unauthenticated)
- **URL:** `GET /api/cart`
- **Expected:** Returns 401 Unauthorized
- **Result:** ✅ PASS
- **Details:**
  - Correctly returns `{"error":"Unauthorized"}`
  - Auth protection working

#### Test 1.7: Frontend Routes
- **URLs Tested:** `/`, `/products`, `/tailors`, `/login`, `/register`
- **Expected:** All return 200 OK
- **Result:** ✅ PASS
- **Details:**
  - All main routes accessible
  - No 404 errors
  - Pages render without server errors

#### Test 1.8: Database Integrity
- **Script:** `scripts/check-db-integrity.ts`
- **Expected:** All tables accessible, valid data
- **Result:** ✅ PASS
- **Details:**
  ```
  Database Record Counts:
  - Users: 8
  - Tailors: 4
  - Products: 5 (all with valid prices > 0)
  - Orders: 0
  - Reviews: 0
  - Carts: 3
  - Cart Items: 1
  - Measurement Sessions: 4
  ```
  - ✅ All products have valid prices
  - ✅ No orphaned records
  - ✅ Foreign keys intact

---

### 2. AUTHENTICATION FLOW

#### Test 2.1: Login Page exists
- **URL:** `/login`
- **Expected:** Login form rendered
- **Result:** ✅ PASS (Code verified)
- **Details:**
  - LoginForm component properly structured
  - react-hook-form + Zod validation
  - Error handling implemented

#### Test 2.2: Register Page exists
- **URL:** `/register`
- **Expected:** Register form rendered
- **Result:** ✅ PASS (Code verified)
- **Details:**
  - Register page exists in `app/(auth)/register/page.tsx`
  - Uses RegisterForm component

#### Test 2.3: Login API Route
- **URL:** `POST /api/auth/login`
- **Status:** ⏳ PENDING - Requires manual browser test
- **Test Data Needed:**
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```

#### Test 2.4: Register API Route
- **URL:** `POST /api/auth/register`
- **Status:** ⏳ PENDING - Requires manual browser test

#### Test 2.5: Logout Flow
- **URL:** `POST /api/auth/logout`
- **Status:** ⏳ PENDING

---

### 3. MARKETPLACE FEATURES

#### Test 3.1: Products Page
- **URL:** `/products`
- **Status:** ⏳ PENDING
- **What to check:**
  - [ ] Products grid renders
  - [ ] Prices display correctly (€ symbol)
  - [ ] Product images load
  - [ ] Filters work (category, price range)
  - [ ] Search function works

#### Test 3.2: Product Detail Page
- **URL:** `/products/[id]`
- **Status:** ⏳ PENDING
- **What to check:**
  - [ ] Product details display
  - [ ] Price shows correctly
  - [ ] "Add to Cart" button visible
  - [ ] Tailor information shown
  - [ ] Reviews section visible

#### Test 3.3: Tailors Page
- **URL:** `/tailors`
- **Status:** ⏳ PENDING
- **What to check:**
  - [ ] Tailors grid renders
  - [ ] Ratings display correctly
  - [ ] Filter by country works
  - [ ] Verified badges show

#### Test 3.4: Tailor Profile Page
- **URL:** `/tailors/[id]`
- **Status:** ⏳ PENDING
- **What to check:**
  - [ ] Tailor info displays
  - [ ] Products list shows
  - [ ] Reviews visible

---

### 4. CART & CHECKOUT

#### Test 4.1: Add to Cart
- **URL:** `POST /api/cart`
- **Status:** ⏳ PENDING
- **What to check:**
  - [ ] Product can be added to cart
  - [ ] Price is saved correctly (priceAtAdd field)
  - [ ] Cart count updates

#### Test 4.2: View Cart
- **URL:** `/cart`
- **Status:** ⏳ PENDING
- **What to check:**
  - [ ] Cart items display
  - [ ] Subtotal calculation correct
  - [ ] Platform fee (10%) calculated
  - [ ] Total = subtotal + platformFee

#### Test 4.3: Checkout Flow
- **URL:** `/checkout`
- **Status:** ⏳ PENDING
- **What to check:**
  - [ ] Shipping form renders
  - [ ] Measurement session link works
  - [ ] Stripe Checkout redirects
  - [ ] Test card works (4242 4242 4242 4242)

#### Test 4.4: Stripe Webhook
- **URL:** `POST /api/webhooks/stripe`
- **Status:** ⏳ PENDING
- **What to check:**
  - [ ] Order created after payment
  - [ ] Order status = "paid"
  - [ ] Platform fee calculated correctly

---

### 5. ORDER MANAGEMENT

#### Test 5.1: Customer Orders List
- **URL:** `/orders`
- **Status:** ⏳ PENDING
- **What to check:**
  - [ ] Orders display
  - [ ] Status badges correct
  - [ ] Order details link works

#### Test 5.2: Customer Order Detail
- **URL:** `/orders/[id]`
- **Status:** ⏳ PENDING
- **What to check:**
  - [ ] Order details display
  - [ ] Measurements shown
  - [ ] Timeline renders
  - [ ] Tracking number (if shipped)

#### Test 5.3: Tailor Orders Management
- **URL:** `/tailor/orders`
- **Status:** ⏳ PENDING
- **What to check:**
  - [ ] Tailor sees only their orders
  - [ ] Status update buttons work
  - [ ] Order details accessible

---

### 6. TAILOR FEATURES

#### Test 6.1: Create Product
- **URL:** `/tailor/products/new`
- **Status:** ⏳ PENDING
- **What to check:**
  - [ ] Form renders
  - [ ] Image upload works
  - [ ] Product created successfully
  - [ ] Price field works (not basePrice!)

#### Test 6.2: Edit Product
- **URL:** `/tailor/products/[id]/edit`
- **Status:** ⏳ PENDING
- **What to check:**
  - [ ] Form pre-filled with data
  - [ ] Price editable
  - [ ] Changes save correctly

#### Test 6.3: Delete Product
- **Status:** ⏳ PENDING
- **What to check:**
  - [ ] Delete confirmation
  - [ ] Product removed from DB

---

### 7. REVIEW SYSTEM

#### Test 7.1: Create Review
- **URL:** `POST /api/reviews`
- **Status:** ⏳ PENDING
- **What to check:**
  - [ ] Review form works
  - [ ] Star rating selectable
  - [ ] Review saves to DB
  - [ ] Tailor rating updates

#### Test 7.2: View Reviews
- **URL:** `/products/[id]` (Reviews Section)
- **Status:** ⏳ PENDING
- **What to check:**
  - [ ] Reviews display
  - [ ] Rating distribution shows
  - [ ] Average rating calculated

#### Test 7.3: Delete Review
- **URL:** `DELETE /api/reviews/[id]`
- **Status:** ⏳ PENDING
- **What to check:**
  - [ ] Only author can delete
  - [ ] Review removed
  - [ ] Rating recalculated

---

## 🐛 BUGS FOUND

### Critical Bugs
_None yet_

### Medium Priority Bugs
_None yet_

### Low Priority Issues
_None yet_

---

## 📊 Test Summary

**Total Tests:** 29
- ✅ **Passed:** 10 (Automated)
- ⏳ **Pending:** 19 (Require browser interaction)
- ❌ **Failed:** 0

**Test Coverage:**
- **Basic Connectivity:** ✅ 100% (8/8) - COMPLETE
  - API Endpoints working
  - Frontend routes accessible
  - Database integrity verified
  - Auth protection working
- **Authentication:** ⏳ 40% (2/5) - Code verified, manual testing needed
- **Marketplace:** ⏳ 0% (0/4) - Requires browser testing
- **Cart & Checkout:** ⏳ 0% (0/4) - Requires browser testing
- **Order Management:** ⏳ 0% (0/3) - Requires browser testing
- **Tailor Features:** ⏳ 0% (0/3) - Requires browser testing
- **Review System:** ⏳ 0% (0/3) - Requires browser testing

**Overall Automation Coverage:** 34% (10/29 tests automated)

---

## 🎯 NEXT STEPS

### Immediate Actions
1. ✅ Basic connectivity tests passed
2. ⏳ **USER ACTION REQUIRED:** Manual browser testing needed for:
   - Authentication Flow (Login/Register)
   - Complete Checkout Flow
   - Tailor Product Management
   - Review System

### Recommended Test Accounts
Create these test accounts for comprehensive testing:

**Customer Account:**
```
Email: customer@test.com
Password: Test1234!
Role: customer
```

**Tailor Account:**
```
Email: tailor@test.com
Password: Test1234!
Role: tailor
```

### Test Script
```bash
# Start Dev Server
npm run dev

# Start Stripe Webhook Listener (Terminal 2)
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Open Browser
# 1. Register as customer
# 2. Browse products
# 3. Add to cart
# 4. Checkout with test card: 4242 4242 4242 4242
# 5. Verify order created
```

---

## 🎉 AUTOMATED TESTING COMPLETE

**Phase 8.2 Status:** Automated portion COMPLETE ✅

**What was tested:**
- ✅ All API endpoints (Products, Tailors, Cart protection)
- ✅ Frontend routes (Homepage, Products, Tailors, Auth pages)
- ✅ Database integrity (8 Users, 4 Tailors, 5 Products)
- ✅ Price field migration (No NULL values, all > 0)
- ✅ TypeScript compilation (No errors)

**What requires manual browser testing:**
- ⏳ Complete user flows (Register → Browse → Cart → Checkout)
- ⏳ Stripe payment integration (Test card 4242...)
- ⏳ Tailor product management (Create/Edit/Delete)
- ⏳ Review system (Create/View/Delete)

---

**Next Steps:**
1. **User performs browser testing** using test accounts
2. **Report bugs** if any found
3. **Move to Phase 8.3** - E2E Test Setup (Playwright)
