import { stripe, toCents, calculateFees } from './config';
import type { CheckoutInput } from '../validations';

/**
 * Create Stripe Checkout Session
 *
 * Flow:
 * 1. User initiiert Checkout
 * 2. Wir erstellen eine Stripe Checkout Session
 * 3. User wird zu Stripe redirected
 * 4. Nach Payment → Webhook → Order wird erstellt
 */
export async function createCheckoutSession({
  productId,
  productTitle,
  productPrice,
  tailorId,
  customerId,
  checkoutData,
}: {
  productId: string;
  productTitle: string;
  productPrice: number;
  tailorId: string;
  customerId: string;
  checkoutData: CheckoutInput;
}) {
  const { quantity = 1 } = checkoutData;
  const subtotal = productPrice * quantity;
  const fees = calculateFees(subtotal);

  // Metadata für Webhook Processing
  const metadata = {
    productId,
    tailorId,
    customerId,
    quantity: quantity.toString(),
    measurementSessionId: checkoutData.measurementSessionId || '',
    shippingMethod: checkoutData.shippingMethod || 'standard',
    customNotes: checkoutData.customNotes || '',
    fabricChoice: checkoutData.fabricChoice || '',
    // Shipping Address als JSON String
    shippingAddress: JSON.stringify(checkoutData.shippingAddress),
    // Fees
    platformFee: fees.platformFee.toString(),
    tailorAmount: fees.tailorAmount.toString(),
  };

  // Erstelle Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: undefined, // Wird von Stripe erfasst
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: productTitle,
            description: `Maßgeschneidert von Tailor ${tailorId}`,
          },
          unit_amount: toCents(productPrice),
        },
        quantity,
      },
    ],
    metadata,
    success_url: `${process.env.NEXT_PUBLIC_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/products/${productId}?checkout=cancelled`,
    // Payment Intent Daten
    payment_intent_data: {
      metadata,
    },
  });

  return session;
}

/**
 * Retrieve Checkout Session
 */
export async function getCheckoutSession(sessionId: string) {
  return await stripe.checkout.sessions.retrieve(sessionId);
}
