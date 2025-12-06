import Stripe from 'stripe';

/**
 * Stripe Server-Side Configuration
 */
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-11-17.clover',
  typescript: true,
});

/**
 * Platform Commission Percentage (from .env)
 */
export const PLATFORM_COMMISSION_PERCENTAGE = parseInt(
  process.env.PLATFORM_COMMISSION_PERCENTAGE || '10',
  10
);

/**
 * Calculate Platform Fee and Tailor Amount
 */
export function calculateFees(totalAmount: number) {
  const platformFee = (totalAmount * PLATFORM_COMMISSION_PERCENTAGE) / 100;
  const tailorAmount = totalAmount - platformFee;

  return {
    totalAmount,
    platformFee: Math.round(platformFee * 100) / 100, // Round to 2 decimals
    tailorAmount: Math.round(tailorAmount * 100) / 100,
  };
}

/**
 * Convert EUR to Stripe Cents
 * Stripe expects amounts in smallest currency unit (cents)
 */
export function toCents(amountInEur: number): number {
  return Math.round(amountInEur * 100);
}

/**
 * Convert Stripe Cents to EUR
 */
export function fromCents(amountInCents: number): number {
  return amountInCents / 100;
}
