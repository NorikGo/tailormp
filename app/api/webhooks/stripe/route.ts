import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/app/lib/stripe/config';
import prisma from '@/app/lib/prisma';
import { sendOrderConfirmation } from '@/app/lib/email';
import type Stripe from 'stripe';

/**
 * POST /api/webhooks/stripe
 *
 * Stripe Webhook Handler
 * Verarbeitet Events von Stripe (Payment Success, Failed, etc.)
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verifiziere Webhook Signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    // console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle verschiedene Event Types
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      default:
        // console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    // console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle Checkout Session Completed
 * Wird aufgerufen wenn User die Zahlung abgeschlossen hat
 * Unterstützt sowohl Single-Product als auch Cart-Checkout
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const metadata = session.metadata!;

  // Check if this is a cart checkout or single product checkout
  if (metadata.type === 'cart_checkout') {
    return await handleCartCheckout(session);
  } else {
    return await handleSingleProductCheckout(session);
  }
}

/**
 * Handle Cart Checkout (Multiple Items)
 */
async function handleCartCheckout(session: Stripe.Checkout.Session) {
  const metadata = session.metadata!;
  const { userId, cartId, itemCount, shippingAddress: shippingAddressJson } = metadata;

  const shippingAddress = JSON.parse(shippingAddressJson);
  const totalAmount = session.amount_total! / 100; // Convert from cents to EUR

  // Parse cart items from metadata
  const items = [];
  for (let i = 0; i < parseInt(itemCount); i++) {
    items.push({
      id: metadata[`item_${i}_id`],
      productId: metadata[`item_${i}_productId`],
      tailorId: metadata[`item_${i}_tailorId`],
      productTitle: metadata[`item_${i}_productTitle`],
      productDescription: metadata[`item_${i}_productDescription`],
      measurementSessionId: metadata[`item_${i}_measurementSessionId`] || null,
      quantity: parseInt(metadata[`item_${i}_quantity`]),
      unitPrice: parseFloat(metadata[`item_${i}_unitPrice`]),
      subtotal: parseFloat(metadata[`item_${i}_subtotal`]),
      notes: metadata[`item_${i}_notes`] || null,
    });
  }

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const platformFeePercentage = parseFloat(process.env.PLATFORM_COMMISSION_PERCENTAGE || '10') / 100;
  const platformFee = subtotal * platformFeePercentage;
  const tailorAmount = subtotal;

  // Create separate order for EACH cart item (one order per tailor)
  const orders = [];
  for (const item of items) {
    // Get measurements if available
    let measurements = null;
    if (item.measurementSessionId) {
      const measurementSession = await prisma.measurementSession.findUnique({
        where: { id: item.measurementSessionId },
      });
      measurements = measurementSession?.measurements ?? null;
    }

    // Calculate individual item platform fee
    const itemPlatformFee = item.subtotal * platformFeePercentage;
    const itemTailorAmount = item.subtotal;

    // Create order for this item
    const order = await prisma.order.create({
      data: {
        userId,
        status: 'paid',
        stripeSessionId: session.id,
        stripePaymentIntent: session.payment_intent as string,
        totalAmount: item.subtotal + itemPlatformFee,
        platformFee: itemPlatformFee,
        tailorAmount: itemTailorAmount,
        currency: 'eur',
        shippingAddress,
        shippingMethod: 'standard',
        measurementSessionId: item.measurementSessionId,
        measurements: measurements as any,
        paidAt: new Date(),
        items: {
          create: [
            {
              productId: item.productId,
              tailorId: item.tailorId,
              productTitle: item.productTitle,
              productDescription: item.productDescription,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.subtotal,
              customNotes: item.notes,
              fabricChoice: null,
            },
          ],
        },
      },
      include: {
        items: true,
      },
    });

    // Update MeasurementSession with orderId if available
    if (item.measurementSessionId) {
      await prisma.measurementSession.update({
        where: { id: item.measurementSessionId },
        data: { orderId: order.id },
      });
    }

    orders.push(order);
  }

  // Clear cart after successful payment
  if (cartId) {
    await prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }

  // console.log(`Cart checkout completed: ${orders.length} orders created`);

  // Send Email Notifications
  // Fetch user data for email
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, id: true },
  });

  if (user) {
    // Send confirmation email for each order
    for (const order of orders) {
      await sendOrderConfirmation({
        orderId: order.id,
        customerEmail: user.email,
        customerName: shippingAddress.name,
        items: order.items.map((item) => ({
          title: item.productTitle,
          quantity: item.quantity,
          price: item.unitPrice,
        })),
        totalAmount: order.totalAmount,
        shippingAddress,
      });
    }
  }
  // - Email an Schneider: Neue Bestellung (jeweils einzeln)

  return orders;
}

/**
 * Handle Single Product Checkout
 */
async function handleSingleProductCheckout(session: Stripe.Checkout.Session) {
  const metadata = session.metadata!;

  // Parse Metadata
  const {
    productId,
    tailorId,
    customerId,
    quantity,
    measurementSessionId,
    shippingMethod,
    customNotes,
    fabricChoice,
    shippingAddress: shippingAddressJson,
    platformFee,
    tailorAmount,
  } = metadata;

  const shippingAddress = JSON.parse(shippingAddressJson);
  const totalAmount = session.amount_total! / 100; // Convert from cents to EUR

  // Hole Produkt-Details
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error(`Product ${productId} not found`);
  }

  // Hole Measurements falls vorhanden
  let measurements = null;
  if (measurementSessionId) {
    const measurementSession = await prisma.measurementSession.findUnique({
      where: { id: measurementSessionId },
    });
    measurements = measurementSession?.measurements ?? null;
  }

  const qty = parseInt(quantity);
  const unitPrice = product.price;
  const subtotal = unitPrice * qty;

  // Erstelle Order in Database
  const order = await prisma.order.create({
    data: {
      userId: customerId,
      status: 'paid',
      stripeSessionId: session.id,
      stripePaymentIntent: session.payment_intent as string,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      platformFee: parseFloat(platformFee),
      tailorAmount: parseFloat(tailorAmount),
      currency: 'eur',
      shippingAddress,
      shippingMethod,
      measurementSessionId: measurementSessionId || null,
      measurements: measurements as any,
      paidAt: new Date(),
      items: {
        create: [
          {
            productId,
            tailorId,
            productTitle: product.title,
            productDescription: product.description,
            quantity: qty,
            unitPrice,
            subtotal,
            customNotes: customNotes || null,
            fabricChoice: fabricChoice || null,
          },
        ],
      },
    },
    include: {
      items: true,
    },
  });

  // Update MeasurementSession mit orderId falls vorhanden
  if (measurementSessionId) {
    await prisma.measurementSession.update({
      where: { id: measurementSessionId },
      data: { orderId: order.id },
    });
  }

  // console.log('Order created:', order.id);

  // TODO: Send Email Notifications
  // - Email an Kunden: Bestellbestätigung
  // - Email an Schneider: Neue Bestellung

  return order;
}

/**
 * Handle Payment Intent Succeeded
 */
async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
) {
  // Update Order status to paid (falls noch nicht geschehen)
  const order = await prisma.order.findUnique({
    where: { stripePaymentIntent: paymentIntent.id },
  });

  if (order && order.status === 'pending') {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'paid',
        paidAt: new Date(),
      },
    });
  }
}

/**
 * Handle Payment Intent Failed
 */
async function handlePaymentIntentFailed(
  paymentIntent: Stripe.PaymentIntent
) {
  // console.error('Payment failed:', paymentIntent.id);

  // Update Order status to cancelled
  const order = await prisma.order.findUnique({
    where: { stripePaymentIntent: paymentIntent.id },
  });

  if (order) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'cancelled' },
    });
  }

  // TODO: Send Email Notification to customer
}
