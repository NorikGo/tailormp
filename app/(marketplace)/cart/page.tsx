"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { useCart } from "@/app/hooks/useCart";
import { CartItem } from "@/app/components/cart/CartItem";
import { CartSummary } from "@/app/components/cart/CartSummary";
import { EmptyCart } from "@/app/components/cart/EmptyCart";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// ═══════════════════════════════════════════════════════════════════════════
// Cart Page
// ═══════════════════════════════════════════════════════════════════════════

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, isLoading, clearCart } = useCart();

  // ───────────────────────────────────────────
  // Loading State
  // ───────────────────────────────────────────
  if (isLoading) {
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
  // Not Authenticated
  // ───────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Anmeldung erforderlich
            </h1>
            <p className="text-slate-600 mb-8">
              Bitte melden Sie sich an, um Ihren Warenkorb zu sehen.
            </p>
            <Button onClick={() => router.push("/login")}>Anmelden</Button>
          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────
  // Empty Cart
  // ───────────────────────────────────────────
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <EmptyCart />
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────
  // Cart with Items
  // ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück
        </Button>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          Warenkorb ({cart.itemCount} {cart.itemCount === 1 ? "Artikel" : "Artikel"})
        </h1>

        {/* Cart Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              {cart.items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}

              {/* Clear Cart Button */}
              {cart.items.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={async () => {
                      if (
                        window.confirm(
                          "Möchten Sie wirklich alle Artikel aus dem Warenkorb entfernen?"
                        )
                      ) {
                        await clearCart();
                      }
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    Warenkorb leeren
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CartSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
