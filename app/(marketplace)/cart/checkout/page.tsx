"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/app/contexts/AuthContext";
import { useCart } from "@/app/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, CreditCard, Package, Shield, Clock } from "lucide-react";
import { BRAND } from "@/app/lib/constants/brand";
import Image from "next/image";

// ═══════════════════════════════════════════════════════════════════════════
// Validation Schema
// ═══════════════════════════════════════════════════════════════════════════

const shippingAddressSchema = z.object({
  fullName: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein"),
  street: z.string().min(3, "Straße muss mindestens 3 Zeichen lang sein"),
  city: z.string().min(2, "Stadt muss mindestens 2 Zeichen lang sein"),
  postalCode: z.string().min(4, "Bitte geben Sie eine gültige Postleitzahl ein"),
  country: z.string().min(2, "Bitte geben Sie ein Land ein"),
  phone: z.string().optional(),
});

type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// Checkout Page
// ═══════════════════════════════════════════════════════════════════════════

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, isLoading: cartLoading, subtotal, platformFee, total } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingAddressFormData>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      fullName: "",
      street: "",
      city: "",
      postalCode: "",
      country: "Deutschland",
      phone: "",
    },
  });

  // ───────────────────────────────────────────
  // Handle Checkout
  // ───────────────────────────────────────────
  const onSubmit = async (data: ShippingAddressFormData) => {
    if (!cart || cart.items.length === 0) {
      toast({
        title: "Fehler",
        description: "Ihr Warenkorb ist leer.",
        variant: "destructive",
      });
      router.push("/cart");
      return;
    }

    // Check if all items have completed measurements
    const allItemsHaveMeasurements = cart.items.every(
      (item) =>
        item.measurementSession &&
        item.measurementSession.status === "completed"
    );

    if (!allItemsHaveMeasurements) {
      toast({
        title: "Maße erforderlich",
        description: "Bitte fügen Sie für alle Produkte vollständige Maße hinzu.",
        variant: "destructive",
      });
      router.push("/cart");
      return;
    }

    setIsSubmitting(true);

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

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Checkout fehlgeschlagen");
      }

      // Redirect to Stripe Checkout
      if (result.url) {
        window.location.href = result.url;
      } else {
        throw new Error("Keine Checkout-URL erhalten");
      }
    } catch (error) {
      // console.error("Checkout error:", error);

      toast({
        title: "Checkout-Fehler",
        description:
          error instanceof Error
            ? error.message
            : "Es ist ein Fehler beim Checkout aufgetreten.",
        variant: "destructive",
      });

      setIsSubmitting(false);
    }
  };

  // ───────────────────────────────────────────
  // Loading State
  // ───────────────────────────────────────────
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────
  // Not Authenticated or Empty Cart
  // ───────────────────────────────────────────
  if (!user || !cart || cart.items.length === 0) {
    router.push("/cart");
    return null;
  }

  // ───────────────────────────────────────────
  // Checkout Form
  // ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push("/cart")}
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück zum Warenkorb
        </Button>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Kasse</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Lieferadresse
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Full Name */}
                <div>
                  <Label htmlFor="fullName">Vollständiger Name *</Label>
                  <Input
                    id="fullName"
                    {...register("fullName")}
                    disabled={isSubmitting}
                    className={errors.fullName ? "border-red-500" : ""}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Street */}
                <div>
                  <Label htmlFor="street">Straße und Hausnummer *</Label>
                  <Input
                    id="street"
                    {...register("street")}
                    disabled={isSubmitting}
                    className={errors.street ? "border-red-500" : ""}
                  />
                  {errors.street && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.street.message}
                    </p>
                  )}
                </div>

                {/* City & Postal Code */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postalCode">Postleitzahl *</Label>
                    <Input
                      id="postalCode"
                      {...register("postalCode")}
                      disabled={isSubmitting}
                      className={errors.postalCode ? "border-red-500" : ""}
                    />
                    {errors.postalCode && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.postalCode.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="city">Stadt *</Label>
                    <Input
                      id="city"
                      {...register("city")}
                      disabled={isSubmitting}
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Country */}
                <div>
                  <Label htmlFor="country">Land *</Label>
                  <Input
                    id="country"
                    {...register("country")}
                    disabled={isSubmitting}
                    className={errors.country ? "border-red-500" : ""}
                  />
                  {errors.country && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone">Telefon (optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Weiterleitung zu Stripe...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Zur Zahlung
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Bestellübersicht Card */}
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Ihre Bestellung
                </h2>

                {/* Items - Anzug-spezifisch */}
                <div className="space-y-4 mb-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="pb-4 border-b border-slate-100 last:border-0">
                      {/* Product Image & Title */}
                      <div className="flex gap-3 mb-2">
                        {item.product.images[0] && (
                          <div className="relative w-16 h-16 rounded overflow-hidden bg-slate-100 flex-shrink-0">
                            <Image
                              src={item.product.images[0].url}
                              alt={item.product.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-900 text-sm">
                            {item.product.title}
                          </h3>
                          <p className="text-xs text-slate-600 mt-0.5">
                            von {item.product.tailor.name}
                            {item.product.tailor.isVerified && (
                              <span className="ml-1">✓</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Anzug Details */}
                      {item.measurementSession && (
                        <div className="bg-slate-50 rounded p-2 mb-2">
                          <p className="text-xs text-slate-600">
                            <Package className="w-3 h-3 inline mr-1" />
                            Maßanfertigung nach Ihren Maßen
                          </p>
                        </div>
                      )}

                      {/* Notizen */}
                      {item.notes && (
                        <p className="text-xs text-slate-500 italic mt-1">
                          "{item.notes}"
                        </p>
                      )}

                      {/* Preis */}
                      <div className="flex justify-between mt-2">
                        <span className="text-sm text-slate-600">
                          Anzug × {item.quantity}
                        </span>
                        <span className="text-sm font-semibold text-slate-900">
                          {(item.priceAtAdd * item.quantity).toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  {/* Subtotal */}
                  <div className="flex justify-between text-slate-600">
                    <span>Zwischensumme</span>
                    <span>{subtotal.toFixed(2)} €</span>
                  </div>

                  {/* Platform Fee */}
                  <div className="flex justify-between text-slate-600">
                    <span>Plattform-Gebühr</span>
                    <span>{platformFee.toFixed(2)} €</span>
                  </div>

                  <div className="border-t pt-2" />

                  {/* Total */}
                  <div className="flex justify-between text-lg font-semibold text-slate-900">
                    <span>Gesamt</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>
                </div>

                {/* Info */}
                <p className="mt-4 text-xs text-slate-500">
                  Sichere Zahlung über Stripe. Nach Bestätigung werden Sie zur
                  Stripe-Checkout-Seite weitergeleitet.
                </p>
              </div>

              {/* Anzug-Informationen Card */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 p-5">
                <h3 className="font-semibold text-slate-900 mb-3 text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  Was Sie erwartet
                </h3>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-900">
                        Fertigung in Vietnam
                      </p>
                      <p className="text-xs text-slate-600">
                        Geschätzte Lieferzeit: 4-6 Wochen
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Package className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-900">
                        100% Maßanfertigung
                      </p>
                      <p className="text-xs text-slate-600">
                        Jeder Anzug wird individuell gefertigt
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-900">
                        Passform-Garantie
                      </p>
                      <p className="text-xs text-slate-600">
                        Kostenlose Anpassung bei lokalem Schneider
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fairness Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-blue-900 font-medium mb-1">
                  💙 Faire Bezahlung garantiert
                </p>
                <p className="text-xs text-blue-700">
                  {BRAND.values[0].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
