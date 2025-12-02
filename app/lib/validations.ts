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

// ───────────────────────────────────────────
// TAILOR PROFILE SCHEMAS (Phase 6.1)
// ───────────────────────────────────────────

export const tailorProfileSchema = z.object({
  name: z.string().min(2, 'Name erforderlich').max(100),
  businessName: z.string().max(100).optional(),
  bio: z.string().max(1000).optional(),
  country: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  location: z.string().max(200).optional(),
  specialties: z.array(z.string()).max(10).optional(),
  languages: z.array(z.string()).max(10).optional(),
  yearsExperience: z.number().int().min(0).max(70).optional(),
  phone: z.string().max(50).optional(),
  website: z.string().url('Ungültige URL').optional().or(z.literal('')),
});

// ───────────────────────────────────────────
// PRODUCT SCHEMAS (Phase 6.2)
// ───────────────────────────────────────────

export const productSchema = z.object({
  title: z.string().min(3, 'Titel muss mindestens 3 Zeichen lang sein').max(200),
  description: z.string().max(2000).optional(),
  price: z.number().positive('Preis muss positiv sein').min(1).max(100000),
  category: z.string().max(100).optional(),
});

export const updateProductSchema = productSchema.partial();

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type TailorProfileInput = z.infer<typeof tailorProfileSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
