"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

// ═══════════════════════════════════════════════════════════════════════════
// CartSummary Component
// ═══════════════════════════════════════════════════════════════════════════

export function CartSummary() {
  const router = useRouter();
  const { cart, subtotal, platformFee, total } = useCart();
  const { toast } = useToast();

  // Check if all items have completed measurements
  const allItemsHaveMeasurements = cart?.items.every(
    (item) =>
      item.measurementSession && item.measurementSession.status === "completed"
  );

  const handleCheckout = () => {
    if (!allItemsHaveMeasurements) {
      toast({
        title: "Maße erforderlich",
        description:
          "Bitte fügen Sie für alle Produkte vollständige Maße hinzu, bevor Sie zur Kasse gehen.",
        variant: "destructive",
      });
      return;
    }

    router.push("/cart/checkout");
  };

  if (!cart || cart.items.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">
        Bestellübersicht
      </h2>

      {/* Subtotal */}
      <div className="flex justify-between text-slate-600 mb-2">
        <span>Zwischensumme</span>
        <span>{subtotal.toFixed(2)} €</span>
      </div>

      {/* Platform Fee */}
      <div className="flex justify-between text-slate-600 mb-4">
        <span>Plattform-Gebühr</span>
        <span>{platformFee.toFixed(2)} €</span>
      </div>

      <div className="border-t my-4" />

      {/* Total */}
      <div className="flex justify-between text-lg font-semibold text-slate-900 mb-6">
        <span>Gesamt</span>
        <span>{total.toFixed(2)} €</span>
      </div>

      {/* Checkout Button */}
      <Button
        onClick={handleCheckout}
        disabled={!allItemsHaveMeasurements}
        className="w-full"
        size="lg"
      >
        Zur Kasse gehen
      </Button>

      {/* Measurement Warning */}
      {!allItemsHaveMeasurements && (
        <div className="mt-4 rounded-lg bg-orange-50 border border-orange-200 p-3">
          <p className="text-sm text-orange-800">
            ⚠ Bitte fügen Sie für alle Produkte vollständige Maße hinzu.
          </p>
        </div>
      )}

      {/* Info Text */}
      <p className="mt-4 text-xs text-slate-500 text-center">
        Sichere Zahlung über Stripe. Ihre Daten werden verschlüsselt übertragen.
      </p>
    </div>
  );
}
