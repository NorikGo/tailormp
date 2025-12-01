import { z } from "zod";

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein"),
});

export const registerSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein"),
  role: z.enum(["customer", "tailor"], {
    required_error: "Bitte wähle eine Rolle",
  }),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
});

// ───────────────────────────────────────────
// ORDER SCHEMAS (NEU für Phase 5)
// ───────────────────────────────────────────

export const shippingAddressSchema = z.object({
  name: z.string().min(2, 'Name erforderlich'),
  street: z.string().min(5, 'Straße und Hausnummer erforderlich'),
  city: z.string().min(2, 'Stadt erforderlich'),
  zip: z.string().min(4, 'PLZ erforderlich'),
  country: z.string().min(2, 'Land erforderlich'),
  phone: z.string().optional(),
});

export const checkoutSchema = z.object({
  productId: z.string().cuid('Ungültige Produkt-ID'),
  quantity: z.number().int().min(1).max(10).default(1),
  measurementSessionId: z.string().cuid().optional(),
  shippingAddress: shippingAddressSchema,
  shippingMethod: z.enum(['standard', 'express']).default('standard'),
  customNotes: z.string().max(500).optional(),
  fabricChoice: z.string().max(200).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'pending',
    'paid',
    'processing',
    'shipped',
    'completed',
    'cancelled',
  ]),
  trackingNumber: z.string().optional(),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
