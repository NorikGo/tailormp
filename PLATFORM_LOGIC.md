# TailorMarket - Komplette Platform-Logik Spezifikation

## Übersicht

TailorMarket ist ein Marketplace, der **zwei klar getrennte Benutzerrollen** hat:

- **CUSTOMERS** (Kunden): Können Produkte kaufen, Maße eingeben, Bestellungen verfolgen
- **TAILORS** (Schneider): Können Produkte erstellen/verkaufen, Bestellungen bearbeiten, Zahlungen empfangen

**KRITISCH**: Diese Rollen müssen strikt getrennt sein. Ein Customer kann NICHT verkaufen, ein Tailor kann NICHT kaufen (vorerst).

---

## 1. Rollen-System und Berechtigungen

### 1.1 Role-Based Access Control (RBAC)

#### Customer-Berechtigungen

- ✅ Produkte durchsuchen und filtern
- ✅ Produktdetails ansehen
- ✅ Produkte in den Warenkorb legen
- ✅ Checkout durchführen und bezahlen
- ✅ Eigene Maße eingeben/speichern
- ✅ Bestellungen ansehen und verfolgen
- ✅ Bewertungen schreiben
- ❌ KEINE Produkte erstellen oder hochladen
- ❌ KEINE Verkäufer-Dashboard Zugriff

#### Tailor-Berechtigungen

- ✅ Produkte/Services erstellen und verwalten
- ✅ Produktbilder hochladen
- ✅ Preise und Optionen festlegen
- ✅ Eingehende Bestellungen sehen und bearbeiten
- ✅ Bestellstatus aktualisieren
- ✅ Stripe Connect Account verwalten
- ✅ Verkaufsstatistiken ansehen
- ❌ KEINE Produkte von anderen kaufen (vorerst)
- ❌ KEINE Customer-Features nutzen

---

## 2. Datenbank-Schema

### 2.1 Profiles Table (ERWEITERT)

```sql
-- Existierende Tabelle erweitern
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('customer', 'tailor'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_account_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_onboarding_complete BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS shipping_address JSONB;

-- Index für Rolle
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
```

**Struktur:**

```typescript
interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: "customer" | "tailor"; // PFLICHTFELD

  // Tailor-spezifisch
  business_name?: string;
  bio?: string;
  country?: string;
  stripe_account_id?: string;
  stripe_onboarding_complete: boolean;

  // Customer-spezifisch
  shipping_address?: {
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };

  created_at: string;
  updated_at: string;
}
```

### 2.2 Products Table (NEU)

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tailor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Produktinfos
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('shirt', 'pants', 'dress', 'suit', 'jacket', 'custom')),

  -- Preise
  base_price DECIMAL(10,2) NOT NULL CHECK (base_price >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',

  -- Bilder
  images TEXT[] DEFAULT '{}',
  primary_image TEXT,

  -- Verfügbarkeit
  is_active BOOLEAN DEFAULT true,
  stock_type TEXT DEFAULT 'unlimited' CHECK (stock_type IN ('unlimited', 'limited')),
  stock_quantity INTEGER CHECK (stock_quantity >= 0),

  -- Lieferung
  estimated_delivery_days INTEGER NOT NULL DEFAULT 21,

  -- Anpassungen
  customization_options JSONB DEFAULT '{}',
  requires_measurements BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indizes
CREATE INDEX idx_products_tailor_id ON products(tailor_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_category ON products(category);

-- RLS Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Jeder kann aktive Produkte sehen
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (is_active = true);

-- Nur der Tailor kann seine eigenen Produkte bearbeiten
CREATE POLICY "Tailors can manage own products"
  ON products FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = products.tailor_id
    )
  );
```

**Customization Options Struktur:**

```typescript
interface CustomizationOptions {
  fabrics?: {
    name: string;
    price_addon: number;
    image_url?: string;
  }[];
  colors?: string[];
  buttons?: {
    type: string;
    price_addon: number;
  }[];
  collar_styles?: {
    name: string;
    price_addon: number;
  }[];
  // ... weitere Optionen
}
```

### 2.3 Orders Table (NEU)

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,

  -- Beteiligte Parteien
  customer_id UUID NOT NULL REFERENCES profiles(id),
  tailor_id UUID NOT NULL REFERENCES profiles(id),
  product_id UUID NOT NULL REFERENCES products(id),

  -- Status
  status TEXT NOT NULL DEFAULT 'pending_payment' CHECK (
    status IN (
      'pending_payment',
      'paid',
      'in_production',
      'shipped',
      'delivered',
      'cancelled',
      'refunded'
    )
  ),

  -- Preise
  product_price DECIMAL(10,2) NOT NULL,
  customization_price DECIMAL(10,2) DEFAULT 0,
  shipping_price DECIMAL(10,2) DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',

  -- Kundendetails
  customer_measurements JSONB,
  customization_selections JSONB,
  special_instructions TEXT,
  shipping_address JSONB NOT NULL,

  -- Zahlungsdetails
  stripe_payment_intent_id TEXT,
  stripe_transfer_id TEXT,

  -- Tracking
  tracking_number TEXT,
  estimated_delivery_date DATE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indizes
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_tailor_id ON orders(tailor_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- RLS Policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Customers können nur ihre eigenen Bestellungen sehen
CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = orders.customer_id
    )
  );

-- Tailors können ihre empfangenen Bestellungen sehen und bearbeiten
CREATE POLICY "Tailors can view and manage received orders"
  ON orders FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = orders.tailor_id
    )
  );

-- Customers können Bestellungen erstellen
CREATE POLICY "Customers can create orders"
  ON orders FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = orders.customer_id AND role = 'customer'
    )
  );
```

### 2.4 Measurements Table (NEU)

```sql
CREATE TABLE measurements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  measurement_type TEXT NOT NULL DEFAULT 'manual' CHECK (
    measurement_type IN ('manual', '3dlook', 'other_provider')
  ),

  measurements_data JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_measurements_customer_id ON measurements(customer_id);
CREATE INDEX idx_measurements_is_default ON measurements(customer_id, is_default);

-- RLS Policies
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;

-- Nur der Customer kann seine eigenen Maße sehen und verwalten
CREATE POLICY "Customers can manage own measurements"
  ON measurements FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = measurements.customer_id
    )
  );
```

**Measurements Data Struktur:**

```typescript
interface MeasurementsData {
  // Oberkörper
  chest?: number; // Brustumfang
  waist?: number; // Taillenumfang
  hips?: number; // Hüftumfang
  shoulder_width?: number; // Schulterbreite

  // Arme
  sleeve_length?: number; // Armlänge
  arm_length?: number; // Armlänge gesamt
  bicep?: number; // Bizepsumfang
  wrist?: number; // Handgelenkumfang

  // Hosen
  inseam?: number; // Innenbeinlänge
  outseam?: number; // Außenbeinlänge
  thigh?: number; // Oberschenkelumfang
  knee?: number; // Knieumfang
  calf?: number; // Wadenumfang
  ankle?: number; // Knöchelumfang

  // Zusätzlich
  height?: number; // Körpergröße
  weight?: number; // Gewicht

  // Einheit
  unit: "cm" | "inch";
}
```

### 2.5 Reviews Table (NEU)

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES profiles(id),
  tailor_id UUID NOT NULL REFERENCES profiles(id),
  product_id UUID NOT NULL REFERENCES products(id),

  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,

  images TEXT[] DEFAULT '{}',

  tailor_response TEXT,
  tailor_response_date TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Jeder kann nur eine Review pro Bestellung schreiben
  UNIQUE(order_id, customer_id)
);

-- Indizes
CREATE INDEX idx_reviews_tailor_id ON reviews(tailor_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- RLS Policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Jeder kann Reviews lesen
CREATE POLICY "Public can view reviews"
  ON reviews FOR SELECT
  USING (true);

-- Customers können Reviews für ihre Bestellungen erstellen
CREATE POLICY "Customers can create reviews for own orders"
  ON reviews FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = reviews.customer_id
    )
    AND EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = reviews.order_id
      AND orders.customer_id = reviews.customer_id
      AND orders.status = 'delivered'
    )
  );

-- Tailors können auf ihre Reviews antworten
CREATE POLICY "Tailors can respond to reviews"
  ON reviews FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = reviews.tailor_id
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = reviews.tailor_id
    )
  );
```

---

## 3. Registrierungs- und Onboarding-Flow

### 3.1 Registrierung mit Rollenauswahl

**Seite: `/auth/register`**

1. User kommt zur Registrierungsseite
2. **ERSTE FRAGE: "Was möchtest du tun?"**
   - Option A: "Ich möchte maßgeschneiderte Kleidung kaufen" → CUSTOMER
   - Option B: "Ich möchte meine Schneider-Services anbieten" → TAILOR
3. Nach Auswahl: Standard-Registrierungsformular
   - Email
   - Passwort
   - Name
4. Bei Submission:

   ```typescript
   // Supabase Auth User erstellen
   const { data: authData, error } = await supabase.auth.signUp({
     email,
     password,
   });

   // Profile mit Rolle erstellen
   await supabase.from("profiles").insert({
     user_id: authData.user.id,
     email,
     full_name: name,
     role: selectedRole, // 'customer' oder 'tailor'
   });
   ```

5. Redirect basierend auf Rolle:
   - Customer → `/` (Homepage mit Produkten)
   - Tailor → `/tailor/onboarding` (Onboarding-Prozess)

### 3.2 Tailor Onboarding

**Seite: `/tailor/onboarding`**

Mehrstufiger Prozess:

**Schritt 1: Business-Informationen**

- Business Name (Pflicht)
- Land (Pflicht)
- Bio/Beschreibung
- Profilbild upload

**Schritt 2: Stripe Connect Onboarding**

- Erklärung: "Um Zahlungen zu empfangen, musst du ein Stripe-Konto verbinden"
- Button: "Mit Stripe verbinden"
- Flow:

  ```typescript
  // Backend erstellt Stripe Connect Account
  const account = await stripe.accounts.create({
    type: "express",
    country: tailorCountry,
    email: tailorEmail,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });

  // Account Link für Onboarding
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${baseUrl}/tailor/onboarding?step=stripe`,
    return_url: `${baseUrl}/tailor/onboarding?step=complete`,
    type: "account_onboarding",
  });

  // User zu Stripe weiterleiten
  redirect(accountLink.url);
  ```

**Schritt 3: Fertig**

- Bestätigung
- Redirect zu `/tailor/dashboard`

---

## 4. User Interface und Navigation

### 4.1 Navigation für Customers

**Header Navigation:**

```
Logo | Produkte | Wie es funktioniert | [Suchleiste] | Warenkorb | Profil-Icon
```

**Profil-Dropdown Menü:**

- Mein Profil
- Meine Bestellungen
- Meine Maße
- Einstellungen
- Abmelden

**Hauptseiten:**

- `/` - Homepage mit Produkt-Grid
- `/products` - Alle Produkte (mit Filter)
- `/products/[id]` - Produktdetails
- `/cart` - Warenkorb
- `/checkout` - Checkout-Prozess
- `/customer/orders` - Bestellübersicht
- `/customer/orders/[id]` - Bestelldetails
- `/customer/measurements` - Maßverwaltung
- `/customer/profile` - Profil bearbeiten

### 4.2 Navigation für Tailors

**Header Navigation:**

```
Logo | Dashboard | Produkte | Bestellungen | Einnahmen | Profil-Icon
```

**Profil-Dropdown Menü:**

- Mein Shop
- Einstellungen
- Stripe Account
- Abmelden

**Hauptseiten:**

- `/tailor/dashboard` - Übersicht (Statistiken, neue Bestellungen)
- `/tailor/products` - Produktverwaltung
- `/tailor/products/new` - Neues Produkt erstellen
- `/tailor/products/[id]/edit` - Produkt bearbeiten
- `/tailor/orders` - Alle Bestellungen
- `/tailor/orders/[id]` - Bestelldetails bearbeiten
- `/tailor/earnings` - Einnahmen-Übersicht
- `/tailor/profile` - Shop-Profil bearbeiten
- `/tailor/settings` - Einstellungen

### 4.3 Route Protection und Middleware

**File: `/middleware.ts`**

```typescript
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;

  // Public routes - kein Auth check
  if (path.startsWith("/auth") || path === "/") {
    return res;
  }

  // Auth required
  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Get user profile with role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", session.user.id)
    .single();

  // Protect tailor routes
  if (path.startsWith("/tailor") && profile?.role !== "tailor") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Protect customer routes
  if (path.startsWith("/customer") && profile?.role !== "customer") {
    return NextResponse.redirect(new URL("/tailor/dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

---

## 5. Kernanwendungsfälle und Flows

### 5.1 TAILOR: Produkt erstellen

**Seite: `/tailor/products/new`**

**Formular-Felder:**

1. **Basis-Informationen**

   - Titel (Text, Pflicht)
   - Beschreibung (Textarea, Pflicht)
   - Kategorie (Dropdown: Shirt, Pants, Dress, Suit, Jacket, Custom)

2. **Preise**

   - Basispreis (Number, Pflicht)
   - Währung (USD/EUR)

3. **Bilder**

   - Bild-Upload (Multiple Files)
   - Hauptbild auswählen
   - Storage: Supabase Storage in Bucket "product-images"
   - Path: `{tailor_id}/{product_id}/{filename}`

4. **Verfügbarkeit**

   - Produkttyp:
     - ○ Maßanfertigung (Unbegrenzt verfügbar)
     - ○ Vorgefertigt (Limitierter Bestand)
   - Falls vorgefertigt: Stückzahl

5. **Lieferung**

   - Geschätzte Lieferzeit (in Tagen)

6. **Maßanforderungen**

   - ☑ Benötigt Kundenmaße

7. **Anpassungsoptionen (Optional)**
   - Stoffe hinzufügen
     - Name
     - Aufpreis
     - Bild
   - Farben (Text-Input, Komma-getrennt)
   - Kragen-Stile
   - Knopf-Optionen
   - etc.

**Submission:**

```typescript
const createProduct = async (formData) => {
  // 1. Bilder zu Supabase Storage hochladen
  const imageUrls = await uploadImages(formData.images);

  // 2. Produkt in DB erstellen
  const { data, error } = await supabase
    .from("products")
    .insert({
      tailor_id: currentUser.profile.id,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      base_price: formData.base_price,
      images: imageUrls,
      primary_image: imageUrls[0],
      estimated_delivery_days: formData.delivery_days,
      customization_options: formData.customizations,
      requires_measurements: formData.requires_measurements,
      is_active: true,
    })
    .select()
    .single();

  // 3. Redirect zu Produktliste
  router.push("/tailor/products");
};
```

### 5.2 CUSTOMER: Produkt kaufen (vollständiger Flow)

#### Phase 1: Produkt entdecken

**Seite: `/` oder `/products`**

- Grid von Produkt-Cards
- Jede Card zeigt:
  - Hauptbild
  - Titel
  - Basispreis
  - Schneider-Name
  - Rating (Sterne)
  - "Details ansehen" Button

#### Phase 2: Produktdetails

**Seite: `/products/[id]`**

**Layout:**

- Links: Bildergalerie (Hauptbild + Thumbnails)
- Rechts: Produktinfos
  - Titel
  - Preis
  - Schneider-Info (Name, Land, Rating)
  - Beschreibung
  - Lieferzeit

**Anpassungsoptionen** (wenn verfügbar):

- Stoff auswählen (Radio Buttons mit Bildern)
- Farbe auswählen (Color Picker)
- Kragen-Stil (Dropdown)
- Zusätzliche Notizen (Textarea)

**Aktionen:**

- [ ] Maße erforderlich:
  - Wenn Customer noch keine Maße hat: "Maße jetzt eingeben" Button
  - Wenn Maße vorhanden: Dropdown "Maße auswählen"
- **"In den Warenkorb"** Button

**Add to Cart Logik:**

```typescript
const addToCart = async () => {
  // Validierung
  if (product.requires_measurements && !selectedMeasurements) {
    toast.error("Bitte wähle deine Maße aus oder gib neue ein");
    return;
  }

  // Cart Item zusammenstellen
  const cartItem = {
    product_id: product.id,
    tailor_id: product.tailor_id,
    quantity: 1, // Bei Maßanfertigung immer 1
    base_price: product.base_price,
    customizations: selectedCustomizations,
    customization_price: calculateCustomizationPrice(),
    measurements_id: selectedMeasurements?.id,
    total_price: product.base_price + calculateCustomizationPrice(),
  };

  // Zu localStorage Cart hinzufügen (oder state management)
  addItemToCart(cartItem);

  toast.success("Zum Warenkorb hinzugefügt");
};
```

#### Phase 3: Warenkorb

**Seite: `/cart`**

**Layout:**

- Liste der Cart Items
  - Produktbild
  - Titel
  - Schneider
  - Gewählte Anpassungen
  - Gewählte Maße
  - Einzelpreis
  - Entfernen-Button

**Zusammenfassung:**

- Zwischensumme
- Versandkosten (wird im Checkout berechnet)
- **"Zur Kasse"** Button

#### Phase 4: Checkout

**Seite: `/checkout`**

**Schritt 1: Lieferadresse**

```typescript
interface ShippingAddress {
  full_name: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
  phone: string;
}
```

**Schritt 2: Bestellübersicht**

- Alle Items nochmal anzeigen
- Lieferadresse bestätigen
- Gesamtpreis

**Schritt 3: Zahlung**

**WICHTIG: Stripe Payment Intent mit Transfers:**

```typescript
// Backend API Route: /api/checkout/create-payment-intent

export async function POST(req: Request) {
  const { cartItems, shippingAddress, customerId } = await req.json();

  // 1. Bestellungen in DB erstellen (Status: pending_payment)
  const orders = await Promise.all(
    cartItems.map(async (item) => {
      const orderNumber = generateOrderNumber();

      return await prisma.order.create({
        data: {
          order_number: orderNumber,
          customer_id: customerId,
          tailor_id: item.tailor_id,
          product_id: item.product_id,
          status: "pending_payment",
          product_price: item.base_price,
          customization_price: item.customization_price,
          shipping_price: calculateShipping(item),
          total_price: item.total_price,
          customer_measurements: item.measurements,
          customization_selections: item.customizations,
          shipping_address: shippingAddress,
        },
      });
    })
  );

  // 2. Stripe Payment Intent erstellen
  const totalAmount = orders.reduce((sum, order) => sum + order.total_price, 0);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(totalAmount * 100), // in cents
    currency: "usd",
    metadata: {
      order_ids: orders.map((o) => o.id).join(","),
    },
    // Automatische Transfers an Tailors werden später bei erfolgreichem Payment gemacht
  });

  return Response.json({
    clientSecret: paymentIntent.client_secret,
    order_ids: orders.map((o) => o.id),
  });
}
```

**Frontend:**

```tsx
// Stripe Elements einbinden
import { Elements, PaymentElement } from "@stripe/react-stripe-js";

<Elements stripe={stripePromise} options={{ clientSecret }}>
  <CheckoutForm />
</Elements>;
```

**Nach erfolgreicher Zahlung:**

```typescript
// Webhook: /api/webhooks/stripe

// Bei payment_intent.succeeded Event:
const handlePaymentSuccess = async (paymentIntent) => {
  const orderIds = paymentIntent.metadata.order_ids.split(",");

  // 1. Orders auf 'paid' setzen
  await prisma.order.updateMany({
    where: { id: { in: orderIds } },
    data: {
      status: "paid",
      stripe_payment_intent_id: paymentIntent.id,
    },
  });

  // 2. Transfers an Tailors erstellen
  const orders = await prisma.order.findMany({
    where: { id: { in: orderIds } },
    include: { tailor: { include: { profile: true } } },
  });

  for (const order of orders) {
    // Platform fee: 10% (Beispiel)
    const platformFee = order.total_price * 0.1;
    const tailorAmount = order.total_price - platformFee;

    const transfer = await stripe.transfers.create({
      amount: Math.round(tailorAmount * 100),
      currency: "usd",
      destination: order.tailor.profile.stripe_account_id,
      transfer_group: paymentIntent.id,
      metadata: {
        order_id: order.id,
        order_number: order.order_number,
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripe_transfer_id: transfer.id },
    });
  }

  // 3. Email-Benachrichtigungen senden
  await sendOrderConfirmationEmail(orders);
};
```

#### Phase 5: Bestellbestätigung

**Seite: `/customer/orders/[id]`**

- Bestellnummer
- Status
- Produkte
- Lieferadresse
- Zahlung bestätigt
- Geschätzte Lieferzeit

### 5.3 TAILOR: Bestellung bearbeiten

**Seite: `/tailor/orders/[id]`**

**Anzeige:**

- Bestellnummer und Datum
- Customer Info (Name, Email)
- Produkt Details
- Kundenmaße (vollständig anzeigen)
- Gewählte Anpassungen
- Spezielle Anweisungen
- Lieferadresse

**Status-Management:**

```tsx
<Select value={order.status} onChange={handleStatusChange}>
  <option value="paid">Bezahlt (Warten auf Produktion)</option>
  <option value="in_production">In Produktion</option>
  <option value="shipped">Versendet</option>
  <option value="delivered">Zugestellt</option>
</Select>

// Bei "shipped":
<Input
  type="text"
  placeholder="Tracking-Nummer eingeben"
  value={trackingNumber}
  onChange={(e) => setTrackingNumber(e.target.value)}
/>
```

**Status Update Logik:**

```typescript
const updateOrderStatus = async (newStatus: OrderStatus) => {
  const updates: any = { status: newStatus };

  if (newStatus === "shipped" && trackingNumber) {
    updates.tracking_number = trackingNumber;
  }

  await supabase.from("orders").update(updates).eq("id", order.id);

  // Email an Customer senden
  await sendStatusUpdateEmail(order.customer_id, order.id, newStatus);

  toast.success("Bestellstatus aktualisiert");
};
```

### 5.4 CUSTOMER: Maße eingeben

**Seite: `/customer/measurements`**

**Zwei Optionen:**

**Option A: Manuelle Eingabe**

```tsx
<Form>
  <h3>Oberkörper</h3>
  <Input label="Brustumfang (cm)" name="chest" type="number" />
  <Input label="Taillenumfang (cm)" name="waist" type="number" />
  <Input label="Schulterbreite (cm)" name="shoulder_width" type="number" />
  <Input label="Armlänge (cm)" name="sleeve_length" type="number" />

  <h3>Unterkörper</h3>
  <Input label="Hüftumfang (cm)" name="hips" type="number" />
  <Input label="Innenbeinlänge (cm)" name="inseam" type="number" />
  <Input label="Oberschenkelumfang (cm)" name="thigh" type="number" />

  <Checkbox
    label="Als Standard-Maße speichern"
    checked={isDefault}
    onChange={setIsDefault}
  />

  <Button type="submit">Maße speichern</Button>
</Form>
```

**Option B: 3D-Scan (später)**

```tsx
<Button onClick={() => initiate3DLookScan()}>
  <Camera className="mr-2" />
  Fotos für 3D-Scan aufnehmen
</Button>
```

**Gespeicherte Maße anzeigen:**

- Liste aller gespeicherten Maß-Sets
- Markierung des Standard-Sets
- Bearbeiten / Löschen Buttons

---

## 6. Dashboard-Übersichten

### 6.1 Tailor Dashboard

**Seite: `/tailor/dashboard`**

**Komponenten:**

1. **Statistik-Karten (oben)**

   ```tsx
   <div className="grid grid-cols-4 gap-4">
     <StatCard
       title="Neue Bestellungen"
       value={newOrdersCount}
       icon={<ShoppingBag />}
     />
     <StatCard
       title="In Produktion"
       value={inProductionCount}
       icon={<Package />}
     />
     <StatCard
       title="Diesen Monat verdient"
       value={formatCurrency(monthlyEarnings)}
       icon={<DollarSign />}
     />
     <StatCard
       title="Aktive Produkte"
       value={activeProductsCount}
       icon={<Tag />}
     />
   </div>
   ```

2. **Neue Bestellungen (Mitte)**

   - Tabelle der neuesten Bestellungen
   - Spalten: Bestellnummer, Kunde, Produkt, Betrag, Datum, Status
   - Quick-Actions: "Details" Button

3. **Umsatz-Chart (unten)**
   - Linien-Chart der letzten 30 Tage
   - Y-Achse: Umsatz
   - X-Achse: Datum

### 6.2 Customer Dashboard (Meine Bestellungen)

**Seite: `/customer/orders`**

**Komponenten:**

1. **Filter-Tabs**

   ```tsx
   <Tabs>
     <Tab label="Alle" />
     <Tab label="In Bearbeitung" />
     <Tab label="Versendet" />
     <Tab label="Abgeschlossen" />
   </Tabs>
   ```

2. **Bestellungen-Liste**
   - Card pro Bestellung
   - Zeigt:
     - Bestellnummer
     - Produktbild
     - Produkttitel
     - Schneider-Name
     - Status mit farbigem Badge
     - Bestelldatum
     - Gesamtpreis
     - "Details" Button
     - Wenn zugestellt: "Bewertung schreiben" Button

---

## 7. Wichtige API-Endpunkte

### Backend Routes (Next.js App Router)

```
/api/auth/callback          - Supabase Auth Callback
/api/products               - GET: Alle Produkte (mit Filtern)
/api/products/[id]          - GET: Einzelnes Produkt
/api/tailor/products        - POST: Produkt erstellen
                            - GET: Eigene Produkte
/api/tailor/products/[id]   - PUT: Produkt bearbeiten
                            - DELETE: Produkt löschen
/api/tailor/orders          - GET: Eigene Bestellungen
/api/tailor/orders/[id]     - PUT: Bestellstatus aktualisieren
/api/customer/measurements  - POST: Maße erstellen
                            - GET: Eigene Maße
/api/customer/orders        - GET: Eigene Bestellungen
/api/customer/orders/[id]   - GET: Einzelne Bestellung
/api/checkout/create-payment-intent - POST: Payment Intent erstellen
/api/webhooks/stripe        - POST: Stripe Webhooks
/api/reviews                - POST: Review erstellen
/api/reviews/[id]/respond   - PUT: Als Tailor auf Review antworten
```

---

## 8. Implementierungs-Prioritäten

### Phase 1: Grundlegendes Setup ✓

- Rollen-System in Datenbank
- Registrierung mit Rollenauswahl
- Middleware für Route Protection

### Phase 2: Tailor-Features 🔄

- Produkt erstellen/bearbeiten/löschen
- Bild-Upload zu Supabase Storage
- Tailor Dashboard
- Bestellungen anzeigen
- Bestellstatus aktualisieren

### Phase 3: Customer-Features 🔄

- Produkte durchsuchen
- Produktdetails anzeigen
- Maße eingeben und verwalten
- Warenkorb-Funktionalität

### Phase 4: Checkout und Zahlungen

- Stripe Payment Intent Integration
- Stripe Connect Transfers
- Bestellungen erstellen
- Bestellbestätigungen

### Phase 5: Post-Purchase

- Bestellverfolgung
- Reviews System
- Email-Benachrichtigungen

### Phase 6: Optimierungen

- Suchfunktion
- Filter und Sortierung
- Tailor-Profile Seiten
- Analytics

---

## 9. Wichtige Hinweise für die Implementierung

### 9.1 Sicherheit

1. **Alle Datenbankzugriffe müssen RLS-geschützt sein**

   - Customers können nur ihre eigenen Daten sehen
   - Tailors können nur ihre eigenen Produkte und empfangenen Bestellungen sehen

2. **API-Routes müssen Auth und Rolle checken**

   ```typescript
   // Beispiel API Route Protection
   export async function POST(req: Request) {
     const supabase = createRouteHandlerClient({ cookies });

     const {
       data: { session },
     } = await supabase.auth.getSession();
     if (!session) {
       return Response.json({ error: "Unauthorized" }, { status: 401 });
     }

     const { data: profile } = await supabase
       .from("profiles")
       .select("role")
       .eq("user_id", session.user.id)
       .single();

     if (profile?.role !== "tailor") {
       return Response.json({ error: "Forbidden" }, { status: 403 });
     }

     // ... weiterer Code
   }
   ```

3. **Bild-Upload Validierung**
   - Max. Dateigröße: 5MB
   - Erlaubte Formate: jpg, jpeg, png, webp
   - Dateinamen sanitizen

### 9.2 Performance

1. **Bilder optimieren**

   - Next.js Image Component verwenden
   - Lazy Loading
   - Responsive Bilder (srcset)

2. **Database Queries optimieren**

   - Select nur benötigte Felder
   - Indexes nutzen (bereits in Schema definiert)
   - Pagination für Listen

3. **Caching**
   - Produkt-Listen cachen (React Query / SWR)
   - Static Generation wo möglich

### 9.3 User Experience

1. **Loading States**

   - Skeleton Loaders für Listen
   - Spinner für Actions
   - Optimistic Updates wo sinnvoll

2. **Error Handling**

   - Toast-Notifications für Erfolg/Fehler
   - Sinnvolle Fehlermeldungen
   - Retry-Mechanismen

3. **Responsive Design**
   - Mobile-First Approach
   - Touch-friendly Buttons
   - Hamburger-Menü auf Mobile

### 9.4 Testing-Szenarien

**Als Customer testen:**

1. Registrierung als Customer
2. Produkte durchsuchen
3. Maße eingeben
4. Produkt in Warenkorb legen
5. Checkout durchführen
6. Bestellung verfolgen
7. Review schreiben

**Als Tailor testen:**

1. Registrierung als Tailor
2. Stripe Onboarding
3. Erstes Produkt erstellen
4. Produkt bearbeiten
5. Eingehende Bestellung anzeigen
6. Bestellstatus aktualisieren
7. Auf Review antworten

**Negative Tests:**

1. Customer versucht auf `/tailor/dashboard` zuzugreifen → Redirect
2. Tailor versucht Produkt von anderem Tailor zu bearbeiten → 403 Error
3. Nicht-eingeloggter User versucht zu bestellen → Redirect zu Login

---

## 10. Nächste Schritte

1. **Datenbank-Migrationen ausführen**

   - Alle neuen Tabellen erstellen
   - RLS Policies aktivieren
   - Indexes erstellen

2. **Registrierung anpassen**

   - Rollenauswahl-UI implementieren
   - Profile mit Rolle erstellen

3. **Middleware implementieren**

   - Route Protection basierend auf Rolle

4. **Tailor-Flow implementieren**

   - Produkt-CRUD
   - Dashboard
   - Bestellverwaltung

5. **Customer-Flow implementieren**

   - Produkt-Browse
   - Maßverwaltung
   - Warenkorb
   - Checkout

6. **Stripe Integration**
   - Payment Intent API
   - Connect Onboarding
   - Webhooks

---

**Ende der Spezifikation**

Diese Dokumentation beschreibt die vollständige Logik deiner TailorMarket-Plattform. Zeige sie Claude Code und bitte ihn, die Implementierung Schritt für Schritt durchzuführen, beginnend mit den Datenbank-Änderungen und dem Rollen-System.
