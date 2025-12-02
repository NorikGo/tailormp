"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════════════════
// EmptyCart Component
// ═══════════════════════════════════════════════════════════════════════════

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon */}
      <div className="mb-6 rounded-full bg-slate-100 p-6">
        <ShoppingCart className="h-16 w-16 text-slate-400" />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-slate-900 mb-3">
        Ihr Warenkorb ist leer
      </h2>

      {/* Description */}
      <p className="text-slate-600 mb-8 max-w-md">
        Sie haben noch keine Produkte in Ihren Warenkorb gelegt. Entdecken Sie
        unsere handgefertigten Maßanfertigungen von verifizierten Schneidern.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild size="lg">
          <Link href="/products">Produkte entdecken</Link>
        </Button>

        <Button asChild variant="outline" size="lg">
          <Link href="/tailors">Schneider finden</Link>
        </Button>
      </div>
    </div>
  );
}
