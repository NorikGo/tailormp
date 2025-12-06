"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Package, MapPin, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { checkoutSchema, type CheckoutInput } from "@/app/lib/validations";
import { Product } from "@/app/types/product";
import { useAuth } from "@/app/hooks/useAuth";
import { dummyProducts } from "@/app/lib/dummyData";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = params.id as string;
  const measurementSessionId = searchParams.get("measurementSessionId");
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      productId,
      quantity: 1,
      measurementSessionId: measurementSessionId || undefined,
      shippingMethod: "standard",
    },
  });

  const quantity = watch("quantity");
  const shippingMethod = watch("shippingMethod");

  // Fetch Product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          // Fallback to dummy data
          const dummyProduct = dummyProducts.find((p) => p.id === productId);
          if (dummyProduct) {
            setProduct(dummyProduct);
            setLoading(false);
            return;
          }
          throw new Error("Produkt nicht gefunden");
        }
        const data = await response.json();
        setProduct(data.product);
      } catch (err: any) {
        setError(err.message || "Fehler beim Laden des Produkts");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const onSubmit = async (data: CheckoutInput) => {
    try {
      setSubmitting(true);
      setError(null);

      // Create Checkout Session
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (user) {
        headers["x-user-id"] = user.id;
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Checkout fehlgeschlagen");
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Ein Fehler ist aufgetreten");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center max-w-md mx-auto">
          <p className="text-red-600 font-medium">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.back()}
          >
            Zurück
          </Button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const subtotal = product.price * (quantity || 1);
  const shippingCost = shippingMethod === "express" ? 15 : 5;
  const total = subtotal + shippingCost;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Lieferadresse
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      {...register("shippingAddress.name")}
                      placeholder="Max Mustermann"
                    />
                    {errors.shippingAddress?.name && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.shippingAddress.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="street">Straße und Hausnummer *</Label>
                    <Input
                      id="street"
                      {...register("shippingAddress.street")}
                      placeholder="Musterstraße 123"
                    />
                    {errors.shippingAddress?.street && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.shippingAddress.street.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zip">PLZ *</Label>
                      <Input
                        id="zip"
                        {...register("shippingAddress.zip")}
                        placeholder="12345"
                      />
                      {errors.shippingAddress?.zip && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.shippingAddress.zip.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="city">Stadt *</Label>
                      <Input
                        id="city"
                        {...register("shippingAddress.city")}
                        placeholder="Berlin"
                      />
                      {errors.shippingAddress?.city && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.shippingAddress.city.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="country">Land *</Label>
                    <Input
                      id="country"
                      {...register("shippingAddress.country")}
                      placeholder="Deutschland"
                    />
                    {errors.shippingAddress?.country && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.shippingAddress.country.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefon (optional)</Label>
                    <Input
                      id="phone"
                      {...register("shippingAddress.phone")}
                      placeholder="+49 123 456789"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Versandart
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={shippingMethod}
                    onValueChange={(value) =>
                      setValue("shippingMethod", value as "standard" | "express")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">
                        Standard (5-7 Tage) - €5.00
                      </SelectItem>
                      <SelectItem value="express">
                        Express (2-3 Tage) - €15.00
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Optional Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Zusätzliche Informationen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fabricChoice">Stoffauswahl (optional)</Label>
                    <Input
                      id="fabricChoice"
                      {...register("fabricChoice")}
                      placeholder="z.B. Blau, Leinen, etc."
                    />
                  </div>

                  <div>
                    <Label htmlFor="customNotes">
                      Besondere Wünsche (optional)
                    </Label>
                    <Textarea
                      id="customNotes"
                      {...register("customNotes")}
                      placeholder="Hier kannst du besondere Wünsche angeben..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Bestellübersicht</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Product Info */}
                  <div className="pb-4 border-b border-slate-200">
                    <p className="font-medium text-slate-900">{product.name}</p>
                    <p className="text-sm text-slate-600 mt-1">
                      Menge: {quantity}
                    </p>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Zwischensumme</span>
                      <span className="text-slate-900">€{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Versand</span>
                      <span className="text-slate-900">
                        €{shippingCost.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-slate-900">
                        Gesamt
                      </span>
                      <span className="text-2xl font-bold text-slate-900">
                        €{total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Wird bearbeitet...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Zur Zahlung
                      </>
                    )}
                  </Button>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  {/* Security Note */}
                  <p className="text-xs text-slate-500 text-center">
                    Sichere Zahlung mit Stripe
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
