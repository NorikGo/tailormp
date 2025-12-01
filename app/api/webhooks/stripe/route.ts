import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/app/lib/stripe/config';
import prisma from '@/app/lib/prisma';
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
    console.error('Webhook signature verification failed:', err);
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
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle Checkout Session Completed
 * Wird aufgerufen wenn User die Zahlung abgeschlossen hat
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
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
    measurements = measurementSession?.measurements;
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
      measurements,
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

  console.log('Order created:', order.id);

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
  console.error('Payment failed:', paymentIntent.id);

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
