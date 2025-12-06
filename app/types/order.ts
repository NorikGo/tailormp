/**
 * Order Types & Enums
 */

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'completed'
  | 'cancelled';

export type ShippingMethod = 'standard' | 'express';

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  zip: string;
  country: string;
  phone?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  tailorId: string;
  productTitle: string;
  productDescription?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  customNotes?: string;
  fabricChoice?: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;

  // Payment Info
  stripeSessionId?: string;
  stripePaymentIntent?: string;
  totalAmount: number;
  platformFee: number;
  tailorAmount: number;
  currency: string;

  // Shipping
  shippingAddress?: ShippingAddress;
  shippingMethod?: ShippingMethod;
  trackingNumber?: string;

  // Measurements
  measurementSessionId?: string;
  measurements?: any; // JSON

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
  shippedAt?: Date;
  completedAt?: Date;

  // Relations
  items: OrderItem[];
  user?: {
    email: string;
  };
}

/**
 * Checkout Request Body
 */
export interface CheckoutRequest {
  productId: string;
  quantity?: number;
  measurementSessionId?: string;
  shippingAddress: ShippingAddress;
  shippingMethod?: ShippingMethod;
  customNotes?: string;
  fabricChoice?: string;
}

/**
 * Order Summary (für Listen-Ansichten)
 */
export interface OrderSummary {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  itemCount: number;
  createdAt: Date;
  product: {
    title: string;
    image?: string;
  };
  tailor: {
    name: string;
  };
}
