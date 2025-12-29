"use client";

import TailorGrid from "@/app/components/marketplace/TailorGrid";
import { TailorFilters } from "@/components/marketplace/TailorFilters";
import { useTailors } from "@/app/hooks/useTailors";
import { dummyTailors } from "@/app/lib/dummyData";
import { Loader2 } from "lucide-react";
import { TERMINOLOGY } from "@/app/lib/constants/brand";

export default function TailorsPage() {
  const { tailors, loading, pagination } = useTailors();

  // Fallback to dummy data if API fails or returns empty
  const displayTailors = tailors.length > 0 ? tailors : dummyTailors;
  const totalTailors = pagination?.total || displayTailors.length;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="mb-12 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          {TERMINOLOGY.exploreTailors}
        </h1>
        <p className="text-lg text-slate-600">
          Lerne unsere erfahrenen Schneider aus Vietnam kennen. Jeder bringt jahrelange Expertise in der Maßanfertigung mit und wird fair bezahlt.
        </p>
      </div>

      {/* Filters Section */}
      <div className="mb-8">
        <TailorFilters />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-slate-900">
            {loading ? "..." : totalTailors}
          </div>
          <div className="text-sm text-slate-600">Schneider</div>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-slate-900">
            {loading ? "..." : displayTailors.filter((t) => t.isVerified).length}
          </div>
          <div className="text-sm text-slate-600">Verifiziert</div>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-slate-900">
            {loading
              ? "..."
              : new Set(displayTailors.map((t) => t.country)).size}
          </div>
          <div className="text-sm text-slate-600">Länder</div>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-slate-900">
            {loading
              ? "..."
              : displayTailors.reduce((sum, t) => sum + t.totalOrders, 0)}
          </div>
          <div className="text-sm text-slate-600">Bestellungen</div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      )}

      {/* Tailor Grid */}
      {!loading && displayTailors.length > 0 && (
        <TailorGrid tailors={displayTailors} />
      )}

      {/* Empty State */}
      {!loading && displayTailors.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-600 text-lg">
            Keine Schneider gefunden. Bitte versuche es später erneut.
          </p>
        </div>
      )}
    </div>
  );
}
