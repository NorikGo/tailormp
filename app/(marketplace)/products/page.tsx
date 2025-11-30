"use client";

import { Loader2 } from "lucide-react";
import ProductGrid from "@/app/components/marketplace/ProductGrid";
import { useProducts } from "@/app/hooks/useProducts";
import { dummyProducts } from "@/app/lib/dummyData";

export default function ProductsPage() {
  const { products, loading, error, pagination } = useProducts();

  // Fallback to dummy data if API fails or returns empty
  const displayProducts = products.length > 0 ? products : dummyProducts;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Produkte entdecken
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Durchsuche unsere Auswahl an maßgeschneiderten Produkten von
          talentierten Schneidern aus aller Welt.
        </p>
      </div>

      {/* Stats Section */}
      <div className="mb-8 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          {pagination ? (
            <span>
              {pagination.total} Produkte gefunden
            </span>
          ) : (
            <span>{displayProducts.length} Produkte gefunden</span>
          )}
        </div>
        {/* TODO: Filter & Sort will be added later */}
        <div className="text-sm text-slate-500">Filter & Sortierung kommt bald...</div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center max-w-md mx-auto mb-8">
          <p className="text-red-600 font-medium">{error}</p>
          <p className="text-sm text-red-500 mt-2">
            Zeige Beispieldaten zur Demonstration
          </p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && displayProducts.length > 0 && (
        <ProductGrid products={displayProducts} />
      )}

      {/* Empty State */}
      {!loading && displayProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-600 text-lg">
            Keine Produkte gefunden. Bitte versuche es später erneut.
          </p>
        </div>
      )}
    </div>
  );
}
