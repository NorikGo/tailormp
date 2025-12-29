import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/app/lib/prisma";
import { z } from "zod";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/cart/checkout - Create Stripe Checkout Session for entire cart
// ═══════════════════════════════════════════════════════════════════════════

const checkoutSchema = z.object({
  shippingAddress: z.object({
    name: z.string().min(2),
    street: z.string().min(5),
    city: z.string().min(2),
    zip: z.string().min(4),
    country: z.string().length(2), // ISO country code
  }),
});

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate request body
    const body = await request.json();
    const validatedData = checkoutSchema.parse(body);

    // Get user's cart with all items
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                tailor: true,
              },
            },
            measurementSession: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Validate all items have measurements
    const itemsWithoutMeasurements = cart.items.filter(
      (item) => !item.measurementSessionId || !item.measurementSession
    );

    if (itemsWithoutMeasurements.length > 0) {
      return NextResponse.json(
        {
          error: "Some items are missing measurements",
          itemsWithoutMeasurements: itemsWithoutMeasurements.map((item) => ({
            id: item.id,
            productId: item.productId,
            productTitle: item.product.title,
          })),
        },
        { status: 400 }
      );
    }

    // Validate all measurement sessions are completed
    const itemsWithIncompleteMeasurements = cart.items.filter(
      (item) => item.measurementSession?.status !== "completed"
    );

    if (itemsWithIncompleteMeasurements.length > 0) {
      return NextResponse.json(
        {
          error: "Some measurements are not completed yet",
          itemsWithIncompleteMeasurements:
            itemsWithIncompleteMeasurements.map((item) => ({
              id: item.id,
              productId: item.productId,
              productTitle: item.product.title,
              measurementStatus: item.measurementSession?.status,
            })),
        },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.priceAtAdd * item.quantity,
      0
    );
    const platformFeePercentage =
      parseFloat(process.env.PLATFORM_COMMISSION_PERCENTAGE || "10") / 100;
    const platformFee = subtotal * platformFeePercentage;
    const total = subtotal + platformFee;

    // Create Stripe line items (Anzug-spezifisch)
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      cart.items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: `Maßanzug: ${item.product.title}`,
            description: `Handgefertigt von ${item.product.tailor.name} in Vietnam | Maßanfertigung nach Ihren Maßen${
              item.notes ? ` | ${item.notes}` : ""
            }`,
            images: [], // TODO: Add product images if available
          },
          unit_amount: Math.round(item.priceAtAdd * 100), // Convert to cents
        },
        quantity: item.quantity,
      }));

    // Add platform fee as separate line item
    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: "Plattform-Gebühr",
          description: `${(platformFeePercentage * 100).toFixed(0)}% Service-Gebühr`,
        },
        unit_amount: Math.round(platformFee * 100),
      },
      quantity: 1,
    });

    // Create metadata for webhook
    const metadata: Record<string, string> = {
      type: "cart_checkout",
      userId: user.id,
      cartId: cart.id,
      itemCount: cart.items.length.toString(),
      subtotal: subtotal.toFixed(2),
      platformFee: platformFee.toFixed(2),
      total: total.toFixed(2),
      shippingAddress: JSON.stringify(validatedData.shippingAddress),
    };

    // Add each cart item to metadata
    cart.items.forEach((item, index) => {
      metadata[`item_${index}_id`] = item.id;
      metadata[`item_${index}_productId`] = item.productId;
      metadata[`item_${index}_tailorId`] = item.tailorId;
      metadata[`item_${index}_measurementSessionId`] =
        item.measurementSessionId!;
      metadata[`item_${index}_priceAtAdd`] = item.priceAtAdd.toFixed(2);
      metadata[`item_${index}_quantity`] = item.quantity.toString();
      metadata[`item_${index}_productTitle`] = item.product.title;
      metadata[`item_${index}_productDescription`] =
        item.product.description || "";
      metadata[`item_${index}_notes`] = item.notes || "";
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
      customer_email: user.email,
      metadata,
    });

    return NextResponse.json(
      {
        sessionId: session.id,
        url: session.url,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid shipping address", details: error.issues },
        { status: 400 }
      );
    }

    // console.error("POST /api/cart/checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
