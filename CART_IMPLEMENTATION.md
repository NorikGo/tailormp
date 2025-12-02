# 🛒 WARENKORB-IMPLEMENTIERUNG - TAILORMARKET

**Version:** 1.0  
**Zielphase:** Phase 7 - Polish & Features  
**Komplexität:** Mittel  
**Geschätzte Dauer:** 8-12 Stunden  
**Datum:** 2025-01-30

---

## 📋 INHALTSVERZEICHNIS

1. [Überblick & Ziele](#1-überblick--ziele)
2. [User Stories & Requirements](#2-user-stories--requirements)
3. [Datenmodell & Prisma Schema](#3-datenmodell--prisma-schema)
4. [Backend-Architektur](#4-backend-architektur)
5. [Frontend-Komponenten](#5-frontend-komponenten)
6. [Checkout-Integration](#6-checkout-integration)
7. [UX & User Flow](#7-ux--user-flow)
8. [Edge Cases & Error Handling](#8-edge-cases--error-handling)
9. [Testing-Checkliste](#9-testing-checkliste)
10. [Implementation-Schritte](#10-implementation-schritte)
11. [Prompts für Claude Code](#11-prompts-für-claude-code)
12. [Weitere Überlegungen](#12-weitere-überlegungen)

---

## 1. ÜBERBLICK & ZIELE

### 1.1 Was ist der Warenkorb?

Ein **persistenter Shopping Cart**, der es Usern erlaubt:

- Mehrere Produkte von verschiedenen Schneidern zu sammeln
- Produkte zu speichern (auch nach Logout via DB)
- Mengen anzupassen (falls sinnvoll für Custom Products)
- Alle Items auf einmal zu kaufen (Multi-Item Checkout)
- Schnellen Zugriff über Header-Icon mit Badge (Item-Count)

### 1.2 Warum jetzt?

**Voraussetzungen erfüllt:**

- Phase 5: Single-Product Checkout funktioniert
- Stripe Integration steht
- Order System existiert
- Measurement System integriert

**Nutzen:**

- Bessere User Experience (Vergleichen, später kaufen)
- Höhere Conversion Rate (weniger Kaufabbrüche)
- Professionellerer E-Commerce-Flow

### 1.3 Abgrenzung

**Was der Warenkorb IST:**

- Persistente Speicherung in Datenbank
- Pro User ein Cart (logged-in only)
- Mehrere Items von verschiedenen Schneidern
- Maße-Zuordnung zu jedem Item

**Was der Warenkorb NICHT IST (MVP):**

- Gast-Warenkorb (ohne Login) - erst später
- Shared Carts (zwischen Usern teilen)
- Saved Carts / Wishlists (separate Feature)
- Quantity > 1 pro Item (Custom Products = unique)

---

## 2. USER STORIES & REQUIREMENTS

### 2.1 User Stories

**Als Kunde möchte ich...**

**Story 1: Items zum Warenkorb hinzufügen**

```
GIVEN ich bin auf einer Produktdetail-Seite
WHEN ich auf "In den Warenkorb" klicke
THEN wird das Produkt zu meinem Warenkorb hinzugefügt
AND ich sehe eine Bestätigung (Toast)
AND der Warenkorb-Badge im Header zeigt die neue Anzahl
AND ich kann weiter shoppen oder zum Warenkorb gehen
```

**Story 2: Warenkorb ansehen**

```
GIVEN ich habe Items im Warenkorb
WHEN ich auf das Warenkorb-Icon im Header klicke
THEN sehe ich eine Übersicht aller Items
WITH Produkt-Bild, Name, Schneider, Preis
AND ich sehe den Gesamtpreis
AND ich kann Items entfernen
AND ich kann zum Checkout gehen
```

**Story 3: Items aus Warenkorb entfernen**

```
GIVEN ich bin auf der Warenkorb-Seite
WHEN ich auf "Entfernen" bei einem Item klicke
THEN wird das Item sofort aus dem Warenkorb gelöscht
AND der Gesamtpreis wird aktualisiert
AND der Badge-Counter wird aktualisiert
```

**Story 4: Maße zu Cart-Item zuordnen**

```
GIVEN ich habe ein Produkt im Warenkorb ohne Maße
WHEN ich auf "Maße hinzufügen" klicke
THEN werde ich zum Measurement-Tool geleitet
AND nach der Messung wird es diesem Cart-Item zugeordnet
OR ich kann ein bestehendes Measurement-Set wählen
```

**Story 5: Multi-Item Checkout**

```
GIVEN ich habe mehrere Items im Warenkorb
AND alle Items haben Maße zugeordnet
WHEN ich auf "Zur Kasse" klicke
THEN komme ich zum Checkout
AND sehe alle Items mit Gesamt-Breakdown
AND kann Lieferadresse eingeben
AND werde zu Stripe weitergeleitet
AND nach Zahlung werden ALLE Items als separate Orders erstellt
```

**Story 6: Persistenz nach Logout**

```
GIVEN ich habe Items im Warenkorb
WHEN ich mich auslogge
THEN bleiben die Items im Warenkorb gespeichert
WHEN ich mich später wieder einlogge
THEN sehe ich denselben Warenkorb-Inhalt
```

### 2.2 Functional Requirements

**Must Have (MVP):**

- FR1: Add to Cart Button auf Produktseiten
- FR2: Cart Icon im Header mit Badge (Item Count)
- FR3: Cart Page mit Übersicht aller Items
- FR4: Remove from Cart Funktion
- FR5: Measurement-Zuordnung zu Cart Items
- FR6: Multi-Item Checkout (alle Items auf einmal kaufen)
- FR7: Persistierung in Datenbank (CartItem Model)
- FR8: Gesamtpreis-Berechnung inkl. Platform Fee
- FR9: Empty State (wenn Warenkorb leer)

**Should Have (später):**

- FR10: Edit Measurements direkt aus Cart
- FR11: Save for Later (aus Cart in Wishlist)
- FR12: Quantity Selection (falls sinnvoll)

**Nice to Have (Post-MVP):**

- FR13: Gast-Warenkorb (Session-basiert)
- FR14: Cart Abandonment Email
- FR15: Wishlist als separate Entität

---

## 3. DATENMODELL & PRISMA SCHEMA

### 3.1 Cart & CartItem Models

Füge diese Models zu deinem Prisma Schema hinzu:

```prisma
model Cart {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  items     CartItem[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}

model CartItem {
  id        String   @id @default(cuid())
  cartId    String
  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)

  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  tailorId  String
  tailor    User     @relation("CartItemToTailor", fields: [tailorId], references: [id], onDelete: Cascade)

  measurementSessionId String?
  measurementSession   MeasurementSession? @relation(fields: [measurementSessionId], references: [id], onDelete: SetNull)

  priceAtAdd Decimal  @db.Decimal(10, 2)
  currency   String   @default("EUR")
  quantity   Int      @default(1)
  notes      String?

  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([cartId])
  @@index([productId])
  @@index([tailorId])
  @@unique([cartId, productId])
}
```

### 3.2 Bestehende Models erweitern

Füge diese Relationen hinzu:

```prisma
model Product {
  // ... existing fields
  cartItems CartItem[]
  // ... rest
}

model User {
  // ... existing fields
  cart              Cart?
  cartItemsAsTailor CartItem[] @relation("CartItemToTailor")
  // ... rest
}

model MeasurementSession {
  // ... existing fields
  cartItems CartItem[]
  // ... rest
}
```

### 3.3 Migration

Nach Schema-Änderung ausführen:

```bash
npx prisma db push
npx prisma generate
```

---

## 4. BACKEND-ARCHITEKTUR

### 4.1 API Routes Overview

```
/api/cart/
├── route.ts              # GET (get cart), POST (add item)
├── [itemId]/
│   └── route.ts          # DELETE (remove), PATCH (update)
├── clear/
│   └── route.ts          # POST (clear cart)
└── checkout/
    └── route.ts          # POST (create checkout session)
```

### 4.2 GET /api/cart

**Datei:** `app/api/cart/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please login to view cart" },
        { status: 401 }
      );
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
                tailor: {
                  select: {
                    id: true,
                    name: true,
                    country: true,
                    avatar: true,
                  },
                },
              },
            },
            measurementSession: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id },
        include: { items: true },
      });
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.priceAtAdd) * item.quantity,
      0
    );

    const platformFeePercentage =
      Number(process.env.PLATFORM_COMMISSION_PERCENTAGE) || 10;
    const platformFee = subtotal * (platformFeePercentage / 100);
    const total = subtotal + platformFee;

    return NextResponse.json({
      cart: {
        id: cart.id,
        items: cart.items,
        totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
        platformFee,
        total,
      },
    });
  } catch (error) {
    console.error("Cart fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}
```

### 4.3 POST /api/cart

Füge zur selben Datei hinzu:

```typescript
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, measurementSessionId, quantity = 1, notes } = body;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { tailor: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Not Found", message: "Product not found" },
        { status: 404 }
      );
    }

    if (!product.isActive) {
      return NextResponse.json(
        { error: "Bad Request", message: "Product is not available" },
        { status: 400 }
      );
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id },
      });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
    });

    if (existingItem) {
      return NextResponse.json(
        {
          error: "Conflict",
          message: "Product already in cart",
          cartItemId: existingItem.id,
        },
        { status: 409 }
      );
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: productId,
        tailorId: product.tailorId,
        priceAtAdd: product.price,
        currency: product.currency,
        quantity: quantity,
        measurementSessionId: measurementSessionId || null,
        notes: notes || null,
      },
      include: {
        product: {
          include: {
            images: true,
            tailor: {
              select: {
                id: true,
                name: true,
                country: true,
              },
            },
          },
        },
        measurementSession: true,
      },
    });

    return NextResponse.json(
      {
        message: "Product added to cart",
        cartItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
```

### 4.4 DELETE /api/cart/[itemId]

**Datei:** `app/api/cart/[itemId]/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: params.itemId },
      include: {
        cart: {
          select: { userId: true },
        },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Not Found", message: "Cart item not found" },
        { status: 404 }
      );
    }

    if (cartItem.cart.userId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden", message: "This item does not belong to you" },
        { status: 403 }
      );
    }

    await prisma.cartItem.delete({
      where: { id: params.itemId },
    });

    return NextResponse.json({
      message: "Item removed from cart",
      itemId: params.itemId,
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
```

### 4.5 PATCH /api/cart/[itemId]

Füge zur selben Datei hinzu:

```typescript
export async function PATCH(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { measurementSessionId, quantity, notes } = body;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: params.itemId },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== user.id) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: params.itemId },
      data: {
        ...(measurementSessionId !== undefined && { measurementSessionId }),
        ...(quantity !== undefined && { quantity }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        product: {
          include: {
            images: true,
            tailor: true,
          },
        },
        measurementSession: true,
      },
    });

    return NextResponse.json({
      message: "Cart item updated",
      cartItem: updatedItem,
    });
  } catch (error) {
    console.error("Update cart item error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
```

### 4.6 POST /api/cart/clear

**Datei:** `app/api/cart/clear/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cart) {
      return NextResponse.json({
        message: "Cart already empty",
        deletedCount: 0,
      });
    }

    const result = await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return NextResponse.json({
      message: "Cart cleared",
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
```

### 4.7 POST /api/cart/checkout

**Datei:** `app/api/cart/checkout/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { shippingAddress } = body;

    if (!shippingAddress) {
      return NextResponse.json(
        { error: "Bad Request", message: "Shipping address required" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                tailor: true,
                images: true,
              },
            },
            measurementSession: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Bad Request", message: "Cart is empty" },
        { status: 400 }
      );
    }

    const itemsWithoutMeasurements = cart.items.filter(
      (item) => !item.measurementSessionId
    );

    if (itemsWithoutMeasurements.length > 0) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Some items are missing measurements",
          itemsWithoutMeasurements: itemsWithoutMeasurements.map((item) => ({
            itemId: item.id,
            productTitle: item.product.title,
          })),
        },
        { status: 400 }
      );
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.priceAtAdd) * item.quantity,
      0
    );

    const platformFeePercentage =
      Number(process.env.PLATFORM_COMMISSION_PERCENTAGE) || 10;
    const platformFee = subtotal * (platformFeePercentage / 100);

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      cart.items.map((item) => ({
        price_data: {
          currency: item.currency.toLowerCase(),
          product_data: {
            name: item.product.title,
            description: `Von ${item.product.tailor.name}`,
            images:
              item.product.images.length > 0
                ? [item.product.images[0].url]
                : [],
          },
          unit_amount: Math.round(Number(item.priceAtAdd) * 100),
        },
        quantity: item.quantity,
      }));

    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: "Service-Gebühr",
          description: "TailorMarket Plattform-Gebühr",
        },
        unit_amount: Math.round(platformFee * 100),
      },
      quantity: 1,
    });

    const metadata: Record<string, string> = {
      userId: user.id,
      cartId: cart.id,
      type: "cart_checkout",
      shippingAddress: JSON.stringify(shippingAddress),
      itemCount: cart.items.length.toString(),
    };

    cart.items.forEach((item, index) => {
      metadata[`item_${index}_id`] = item.id;
      metadata[`item_${index}_productId`] = item.productId;
      metadata[`item_${index}_tailorId`] = item.tailorId;
      metadata[`item_${index}_measurementSessionId`] =
        item.measurementSessionId || "";
      metadata[`item_${index}_price`] = item.priceAtAdd.toString();
      metadata[`item_${index}_quantity`] = item.quantity.toString();
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
      customer_email: user.email,
      metadata: metadata,
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Cart checkout error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
```

---

## 5. FRONTEND-KOMPONENTEN

### 5.1 useCart Hook

**Datei:** `app/hooks/useCart.ts`

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

interface CartItem {
  id: string;
  product: {
    id: string;
    title: string;
    price: number;
    currency: string;
    images: { url: string }[];
    tailor: {
      id: string;
      name: string;
      country: string;
    };
  };
  priceAtAdd: number;
  quantity: number;
  measurementSession: {
    id: string;
    name: string;
    category: string;
  } | null;
  createdAt: string;
}

interface Cart {
  id: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  platformFee: number;
  total: number;
}

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cart");

      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      const data = await response.json();
      setCart(data.cart);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Fetch cart error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(
    async (
      productId: string,
      options?: {
        measurementSessionId?: string;
        quantity?: number;
        notes?: string;
      }
    ) => {
      try {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            ...options,
          }),
        });

        if (response.status === 409) {
          toast({
            title: "Bereits im Warenkorb",
            description: "Dieses Produkt ist bereits in deinem Warenkorb.",
            variant: "default",
          });
          return { success: false, alreadyInCart: true };
        }

        if (!response.ok) {
          throw new Error("Failed to add to cart");
        }

        const data = await response.json();
        await fetchCart();

        toast({
          title: "Zum Warenkorb hinzugefügt",
          description: "Das Produkt wurde erfolgreich hinzugefügt.",
          variant: "default",
        });

        return { success: true, cartItem: data.cartItem };
      } catch (err) {
        toast({
          title: "Fehler",
          description: "Produkt konnte nicht hinzugefügt werden.",
          variant: "destructive",
        });
        return { success: false };
      }
    },
    [fetchCart, toast]
  );

  const removeFromCart = useCallback(
    async (itemId: string) => {
      try {
        const response = await fetch(`/api/cart/${itemId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to remove from cart");
        }

        await fetchCart();

        toast({
          title: "Entfernt",
          description: "Das Produkt wurde aus dem Warenkorb entfernt.",
          variant: "default",
        });

        return { success: true };
      } catch (err) {
        toast({
          title: "Fehler",
          description: "Produkt konnte nicht entfernt werden.",
          variant: "destructive",
        });
        return { success: false };
      }
    },
    [fetchCart, toast]
  );

  const updateCartItem = useCallback(
    async (
      itemId: string,
      updates: {
        measurementSessionId?: string;
        quantity?: number;
        notes?: string;
      }
    ) => {
      try {
        const response = await fetch(`/api/cart/${itemId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          throw new Error("Failed to update cart item");
        }

        await fetchCart();
        return { success: true };
      } catch (err) {
        toast({
          title: "Fehler",
          description: "Änderung konnte nicht gespeichert werden.",
          variant: "destructive",
        });
        return { success: false };
      }
    },
    [fetchCart, toast]
  );

  const clearCart = useCallback(async () => {
    try {
      const response = await fetch("/api/cart/clear", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }

      await fetchCart();

      toast({
        title: "Warenkorb geleert",
        description: "Alle Produkte wurden entfernt.",
        variant: "default",
      });

      return { success: true };
    } catch (err) {
      toast({
        title: "Fehler",
        description: "Warenkorb konnte nicht geleert werden.",
        variant: "destructive",
      });
      return { success: false };
    }
  }, [fetchCart, toast]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    refreshCart: fetchCart,
  };
}
```

### 5.2 CartIcon Component

**Datei:** `app/components/cart/CartIcon.tsx`

```typescript
"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/app/hooks/useCart";

export function CartIcon() {
  const { cart, loading } = useCart();
  const itemCount = cart?.totalItems || 0;

  return (
    <Link
      href="/cart"
      className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <ShoppingCart className="h-6 w-6 text-slate-700" />

      {itemCount > 0 && (
        <Badge
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          variant="default"
        >
          {itemCount > 9 ? "9+" : itemCount}
        </Badge>
      )}
    </Link>
  );
}
```

### 5.3 CartButton Component

**Datei:** `app/components/cart/CartButton.tsx`

```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/app/hooks/useCart";
import { useRouter } from "next/navigation";

interface CartButtonProps {
  productId: string;
  variant?: "default" | "outline";
  className?: string;
}

export function CartButton({
  productId,
  variant = "default",
  className = "",
}: CartButtonProps) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    setLoading(true);
    const result = await addToCart(productId);
    setLoading(false);

    if (result.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }

    if (result.alreadyInCart) {
      router.push("/cart");
    }
  };

  return (
    <Button
      variant={variant}
      className={className}
      onClick={handleAddToCart}
      disabled={loading || added}
    >
      {added ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Hinzugefügt
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          In den Warenkorb
        </>
      )}
    </Button>
  );
}
```

### 5.4 CartItem Component

**Datei:** `app/components/cart/CartItem.tsx`

```typescript
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/app/hooks/useCart";

interface CartItemProps {
  item: {
    id: string;
    product: {
      id: string;
      title: string;
      price: number;
      currency: string;
      images: { url: string }[];
      tailor: {
        id: string;
        name: string;
        country: string;
      };
    };
    priceAtAdd: number;
    quantity: number;
    measurementSession: {
      id: string;
      name: string;
      category: string;
    } | null;
  };
}

export function CartItem({ item }: CartItemProps) {
  const { removeFromCart } = useCart();
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    await removeFromCart(item.id);
  };

  const imageUrl = item.product.images[0]?.url || "/placeholder-product.jpg";

  return (
    <div className="flex gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow">
      <Link href={`/products/${item.product.id}`} className="flex-shrink-0">
        <div className="relative w-24 h-24 rounded-md overflow-hidden bg-slate-100">
          <Image
            src={imageUrl}
            alt={item.product.title}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.product.id}`} className="hover:underline">
          <h3 className="font-medium text-slate-900 truncate">
            {item.product.title}
          </h3>
        </Link>

        <Link
          href={`/tailors/${item.product.tailor.id}`}
          className="text-sm text-slate-600 hover:underline"
        >
          {item.product.tailor.name}
        </Link>

        <div className="mt-2 flex items-center gap-2">
          {item.measurementSession ? (
            <Badge variant="secondary" className="text-xs">
              Maße: {item.measurementSession.name}
            </Badge>
          ) : (
            <div className="flex items-center gap-1 text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs">Maße fehlen</span>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs"
                asChild
              >
                <Link
                  href={`/measurement/new?returnTo=/cart&cartItemId=${item.id}`}
                >
                  Hinzufügen
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <p className="font-semibold text-slate-900">
          {item.priceAtAdd.toFixed(2)} {item.currency}
        </p>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          disabled={removing}
          className="text-slate-500 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
```

### 5.5 CartSummary Component

**Datei:** `app/components/cart/CartSummary.tsx`

```typescript
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CartSummaryProps {
  subtotal: number;
  platformFee: number;
  total: number;
  itemCount: number;
  hasItemsWithoutMeasurements: boolean;
}

export function CartSummary({
  subtotal,
  platformFee,
  total,
  itemCount,
  hasItemsWithoutMeasurements,
}: CartSummaryProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (hasItemsWithoutMeasurements) {
      return;
    }
    setLoading(true);
    router.push("/cart/checkout");
  };

  return (
    <div className="bg-slate-50 rounded-lg p-6 space-y-4">
      <h3 className="font-semibold text-lg">Zusammenfassung</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">
            Zwischensumme ({itemCount} {itemCount === 1 ? "Artikel" : "Artikel"}
            )
          </span>
          <span className="font-medium">{subtotal.toFixed(2)} EUR</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-600">Service-Gebühr (10%)</span>
          <span className="font-medium">{platformFee.toFixed(2)} EUR</span>
        </div>

        <Separator className="my-3" />

        <div className="flex justify-between text-base">
          <span className="font-semibold">Gesamt</span>
          <span className="font-semibold text-lg">{total.toFixed(2)} EUR</span>
        </div>
      </div>

      {hasItemsWithoutMeasurements && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
          Einige Artikel benötigen noch Maße. Bitte füge diese hinzu, bevor du
          zur Kasse gehst.
        </div>
      )}

      <Button
        className="w-full"
        size="lg"
        onClick={handleCheckout}
        disabled={loading || hasItemsWithoutMeasurements || itemCount === 0}
      >
        {loading ? "Wird geladen..." : "Zur Kasse"}
      </Button>

      <p className="text-xs text-slate-500 text-center">
        Versandkosten werden beim Checkout berechnet
      </p>
    </div>
  );
}
```

### 5.6 EmptyCart Component

**Datei:** `app/components/cart/EmptyCart.tsx`

```typescript
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EmptyCart() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100">
          <ShoppingCart className="h-10 w-10 text-slate-400" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Dein Warenkorb ist leer
          </h2>
          <p className="text-slate-600">
            Entdecke unsere Schneider und finde dein perfektes maßgeschneidertes
            Stück.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" asChild>
            <Link href="/tailors">Schneider entdecken</Link>
          </Button>

          <Button size="lg" variant="outline" asChild>
            <Link href="/products">Produkte durchsuchen</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### 5.7 Cart Page

**Datei:** `app/(marketplace)/cart/page.tsx`

```typescript
import { Metadata } from "next";
import { CartPageClient } from "./CartPageClient";

export const metadata: Metadata = {
  title: "Warenkorb | TailorMarket",
  description: "Dein Warenkorb bei TailorMarket",
};

export default function CartPage() {
  return <CartPageClient />;
}
```

**Datei:** `app/(marketplace)/cart/CartPageClient.tsx`

```typescript
"use client";

import { useCart } from "@/app/hooks/useCart";
import { CartItem } from "@/app/components/cart/CartItem";
import { CartSummary } from "@/app/components/cart/CartSummary";
import { EmptyCart } from "@/app/components/cart/EmptyCart";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function CartPageClient() {
  const { cart, loading } = useCart();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-slate-200 rounded" />
          <div className="h-32 bg-slate-200 rounded" />
          <div className="h-32 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return <EmptyCart />;
  }

  const hasItemsWithoutMeasurements = cart.items.some(
    (item) => !item.measurementSession
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Weiter einkaufen
          </Link>
        </Button>

        <h1 className="text-3xl font-bold text-slate-900">
          Warenkorb ({cart.totalItems}{" "}
          {cart.totalItems === 1 ? "Artikel" : "Artikel"})
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <CartSummary
              subtotal={cart.subtotal}
              platformFee={cart.platformFee}
              total={cart.total}
              itemCount={cart.totalItems}
              hasItemsWithoutMeasurements={hasItemsWithoutMeasurements}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 6. CHECKOUT-INTEGRATION

### 6.1 Checkout Page

**Datei:** `app/(marketplace)/cart/checkout/page.tsx`

```typescript
import { Metadata } from "next";
import { CartCheckoutClient } from "./CartCheckoutClient";

export const metadata: Metadata = {
  title: "Zur Kasse | TailorMarket",
  description: "Schließe deine Bestellung ab",
};

export default function CartCheckoutPage() {
  return <CartCheckoutClient />;
}
```

**Datei:** `app/(marketplace)/cart/checkout/CartCheckoutClient.tsx`

```typescript
"use client";

import { useState } from "react";
import { useCart } from "@/app/hooks/useCart";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name ist erforderlich"),
  street: z.string().min(3, "Straße ist erforderlich"),
  city: z.string().min(2, "Stadt ist erforderlich"),
  postalCode: z.string().min(4, "PLZ ist erforderlich"),
  country: z.string().min(2, "Land ist erforderlich"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export function CartCheckoutClient() {
  const { cart, loading: cartLoading } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (!cart || cart.items.length === 0) {
      toast({
        title: "Fehler",
        description: "Dein Warenkorb ist leer",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/cart/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingAddress: data,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Checkout failed");
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Fehler",
        description:
          error instanceof Error ? error.message : "Checkout fehlgeschlagen",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  if (cartLoading) {
    return <div>Loading...</div>;
  }

  if (!cart || cart.items.length === 0) {
    router.push("/cart");
    return null;
  }

  const hasItemsWithoutMeasurements = cart.items.some(
    (item) => !item.measurementSession
  );

  if (hasItemsWithoutMeasurements) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/cart">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zum Warenkorb
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-8">Zur Kasse</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Lieferadresse</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Vollständiger Name</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Max Mustermann"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="street">Straße und Hausnummer</Label>
                  <Input
                    id="street"
                    {...register("street")}
                    placeholder="Musterstraße 123"
                  />
                  {errors.street && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.street.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postalCode">PLZ</Label>
                    <Input
                      id="postalCode"
                      {...register("postalCode")}
                      placeholder="12345"
                    />
                    {errors.postalCode && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.postalCode.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="city">Stadt</Label>
                    <Input
                      id="city"
                      {...register("city")}
                      placeholder="Berlin"
                    />
                    {errors.city && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="country">Land</Label>
                  <Input
                    id="country"
                    {...register("country")}
                    placeholder="Deutschland"
                  />
                  {errors.country && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                "Wird geladen..."
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Weiter zur Zahlung ({cart.total.toFixed(2)} EUR)
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-50 rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-lg">Bestellübersicht</h3>

            <div className="space-y-3">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-600 truncate pr-2">
                    {item.product.title}
                  </span>
                  <span className="font-medium whitespace-nowrap">
                    {item.priceAtAdd.toFixed(2)} EUR
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Zwischensumme</span>
                <span className="font-medium">
                  {cart.subtotal.toFixed(2)} EUR
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Service-Gebühr</span>
                <span className="font-medium">
                  {cart.platformFee.toFixed(2)} EUR
                </span>
              </div>

              <div className="flex justify-between text-base font-semibold pt-2 border-t">
                <span>Gesamt</span>
                <span>{cart.total.toFixed(2)} EUR</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 6.2 Webhook Handler Extension

Erweitere deinen bestehenden Webhook Handler:

**Datei:** `app/api/webhooks/stripe/route.ts`

```typescript
// Füge diese Funktion hinzu:

async function handleCartCheckout(session: Stripe.Checkout.Session) {
  const metadata = session.metadata!;
  const userId = metadata.userId;
  const cartId = metadata.cartId;
  const itemCount = parseInt(metadata.itemCount);
  const shippingAddress = JSON.parse(metadata.shippingAddress);

  const orders = [];

  for (let i = 0; i < itemCount; i++) {
    const productId = metadata[`item_${i}_productId`];
    const tailorId = metadata[`item_${i}_tailorId`];
    const measurementSessionId =
      metadata[`item_${i}_measurementSessionId`] || null;
    const price = parseFloat(metadata[`item_${i}_price`]);
    const quantity = parseInt(metadata[`item_${i}_quantity`]);

    const platformFeePercentage =
      Number(process.env.PLATFORM_COMMISSION_PERCENTAGE) || 10;
    const itemTotal = price * quantity;
    const itemPlatformFee = itemTotal * (platformFeePercentage / 100);
    const itemTailorAmount = itemTotal - itemPlatformFee;

    const order = await prisma.order.create({
      data: {
        userId,
        productId,
        tailorId,
        measurementSessionId,
        stripeSessionId: session.id,
        stripePaymentIntent: session.payment_intent as string,
        totalAmount: itemTotal,
        platformFee: itemPlatformFee,
        tailorAmount: itemTailorAmount,
        currency: "EUR",
        paymentStatus: "paid",
        orderStatus: "confirmed",
        shippingAddress,
        paidAt: new Date(),
      },
    });

    orders.push(order);
  }

  await prisma.cartItem.deleteMany({
    where: { cartId },
  });

  console.log(`Created ${orders.length} orders from cart ${cartId}`);
}

// Dann in deinem POST handler:

export async function POST(request: NextRequest) {
  try {
    // ... existing webhook validation ...

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata;

      if (metadata?.type === "cart_checkout") {
        await handleCartCheckout(session);
      } else {
        // Existing single-product checkout logic
        await handleSingleProductCheckout(session);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
```

---

## 7. UX & USER FLOW

### 7.1 Complete User Flow

```
1. USER BROWSES PRODUCTS
2. USER clicks "Add to Cart" on Product Page
3. TOAST: "Added to cart"
4. BADGE in Header shows item count
5. USER continues shopping OR clicks Cart Icon
6. CART PAGE shows all items
7. USER reviews items
   - Remove items? → Item deleted, totals updated
   - Missing measurements? → Link to Measurement Tool
   - All good? → Click "Zur Kasse"
8. CHECKOUT PAGE
9. USER enters shipping address
10. USER clicks "Weiter zur Zahlung"
11. REDIRECT to Stripe Checkout
12. USER completes payment (Test Card: 4242 4242 4242 4242)
13. STRIPE calls Webhook → Orders created
14. USER redirected to Success Page
15. CART is cleared automatically
16. USER can view orders in Dashboard
```

---

## 8. EDGE CASES & ERROR HANDLING

### 8.1 Edge Cases

**EC1: Cart persistence after logout**

- Handled: Cart tied to userId in DB
- User logs out → Cart remains in DB
- User logs in → Same cart loaded

**EC2: Product price changes**

- Handled: priceAtAdd stored in CartItem
- Original price preserved

**EC3: Product deleted by tailor**

- Handle: Check product.isActive in cart
- Show "Not available" message

**EC4: Measurement session deleted**

- Handled: Prisma relation onDelete: SetNull
- Shows "Maße fehlen" warning

---

## 9. TESTING-CHECKLISTE

### 9.1 Backend API Tests

**GET /api/cart**

- [ ] Returns empty cart for new user
- [ ] Returns cart with items
- [ ] Calculates totals correctly
- [ ] Returns 401 if not authenticated

**POST /api/cart**

- [ ] Adds product successfully
- [ ] Returns 409 if already in cart
- [ ] Returns 404 if product not found
- [ ] Returns 401 if not authenticated

**DELETE /api/cart/[itemId]**

- [ ] Removes item successfully
- [ ] Returns 404 if not found
- [ ] Returns 403 if not owned
- [ ] Returns 401 if not authenticated

**POST /api/cart/checkout**

- [ ] Creates Stripe session
- [ ] Validates measurements
- [ ] Returns 400 if missing measurements
- [ ] Returns 401 if not authenticated

### 9.2 Frontend Tests

**CartIcon**

- [ ] Shows correct item count
- [ ] Updates when items added/removed
- [ ] Links to /cart

**CartButton**

- [ ] Shows loading state
- [ ] Shows success state
- [ ] Shows toast

**CartPage**

- [ ] Shows loading state
- [ ] Shows empty state
- [ ] Displays all items
- [ ] Remove works

**Checkout**

- [ ] Form validation works
- [ ] Creates checkout session
- [ ] Redirects to Stripe

---

## 10. IMPLEMENTATION-SCHRITTE

### Phase 1: Database & Backend (2-3h)

1. Add Cart & CartItem models to Prisma Schema
2. Run `npx prisma db push` and `npx prisma generate`
3. Implement all API routes
4. Test routes with Postman

### Phase 2: Frontend Core (3-4h)

1. Create useCart hook
2. Create CartIcon component
3. Create CartButton component
4. Add CartIcon to Header

### Phase 3: Cart Page (2-3h)

1. Create CartItem component
2. Create CartSummary component
3. Create EmptyCart component
4. Create Cart Page

### Phase 4: Checkout (2-3h)

1. Create Checkout Page with form
2. Implement Stripe integration
3. Test complete flow

### Phase 5: Webhook & Polish (1-2h)

1. Extend webhook handler
2. Add error handling
3. Test end-to-end
4. Polish UI

---

## 11. PROMPTS FÜR CLAUDE CODE

### Prompt 1: Database Setup

```
Wir implementieren jetzt den Warenkorb für TailorMarket.

DEINE AUFGABE:
Erweitere das Prisma Schema um Cart und CartItem Models.

ANFORDERUNGEN:
- Cart Model: userId (unique, one-to-one mit User)
- CartItem Model: cartId, productId, tailorId, measurementSessionId (optional), priceAtAdd, quantity, notes
- Relationen zu User, Product, Tailor, MeasurementSession
- Unique Constraint: User kann jedes Produkt nur einmal im Cart haben
- onDelete Cascade für Cart → CartItem
- onDelete SetNull für MeasurementSession → CartItem

Nach der Schema-Änderung sage mir Bescheid, dann führe ich "npx prisma db push" aus.

Referenz: CART_IMPLEMENTATION.md Abschnitt 3
```

### Prompt 2: API Routes

```
Implementiere jetzt die Cart API Routes.

ROUTES:
1. GET /api/cart - Hole Warenkorb mit allen Items
2. POST /api/cart - Füge Produkt hinzu
3. DELETE /api/cart/[itemId] - Entferne Item
4. PATCH /api/cart/[itemId] - Update Item
5. POST /api/cart/clear - Leere komplett
6. POST /api/cart/checkout - Erstelle Stripe Session

ANFORDERUNGEN:
- Supabase Auth für alle Routes
- Validierung: Product exists, isActive, etc.
- Totals berechnen (subtotal, platformFee, total)
- Error Handling (401, 404, 409, 400, 500)
- Bei POST: Check if product already in cart

Referenz: CART_IMPLEMENTATION.md Abschnitt 4
```

### Prompt 3: useCart Hook

```
Erstelle den useCart Custom Hook.

FUNKTIONEN:
- fetchCart() - Hole Cart von API
- addToCart(productId, options) - Füge hinzu
- removeFromCart(itemId) - Entferne
- updateCartItem(itemId, updates) - Update
- clearCart() - Leere
- refreshCart() - Refresh manuell

STATE:
- cart: Cart | null
- loading: boolean
- error: string | null

FEATURES:
- Toast Notifications bei Aktionen
- Error Handling
- Auto-fetch on mount
- useCallback für alle Funktionen

Referenz: CART_IMPLEMENTATION.md Abschnitt 5.1
```

### Prompt 4: Cart Components

```
Erstelle alle Cart-Components:

1. CartIcon (Header) - ShoppingCart Icon mit Badge
2. CartButton (Product Page) - "In den Warenkorb" Button
3. CartItem - Einzelnes Item mit Remove Button
4. CartSummary - Preis Breakdown, Checkout Button
5. EmptyCart - Empty State

FEATURES:
- useCart Hook nutzen
- shadcn/ui Components
- TypeScript Props
- Responsive Design

Referenz: CART_IMPLEMENTATION.md Abschnitt 5.2-5.6
```

### Prompt 5: Cart Page

```
Erstelle die Cart Page.

STRUKTUR:
- Header mit "Weiter einkaufen" Link
- Grid Layout (2 Spalten Desktop, 1 Spalte Mobile)
- Links: CartItem Liste
- Rechts: CartSummary (Sticky)
- Loading State (Skeletons)
- Empty State wenn keine Items

FEATURES:
- Remove Item
- Measurement Warning wenn fehlt
- Link zu Measurement Tool
- Responsive Design

Referenz: CART_IMPLEMENTATION.md Abschnitt 5.7
```

### Prompt 6: Checkout

```
Implementiere den Cart Checkout Flow.

CHECKOUT PAGE:
- Shipping Address Form (react-hook-form + Zod)
- Order Summary Sidebar
- Validation vor Submit
- Call /api/cart/checkout
- Redirect zu Stripe

WEBHOOK EXTENSION:
- Erweitere Webhook Handler
- handleCartCheckout Funktion
- Erstelle Order für jedes Cart Item
- Clear Cart nach Success

Referenz: CART_IMPLEMENTATION.md Abschnitt 6
```

---

## 12. WEITERE ÜBERLEGUNGEN

### 12.1 Post-MVP Features

- Gast-Warenkorb (Session-Storage)
- Wishlist / Save for Later
- Cart Abandonment Emails
- Bulk Actions
- Price Drop Notifications

### 12.2 Performance

- Cache cart count in localStorage
- Optimistic UI updates
- SWR / React Query
- Image optimization
- Code splitting

### 12.3 Security

- Rate limiting on add to cart
- Validate ownership on all actions
- Sanitize user inputs
- CSRF protection

---

## ENDE DES DOKUMENTS
