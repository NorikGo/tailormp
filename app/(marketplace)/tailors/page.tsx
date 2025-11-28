"use client";

import TailorGrid from "@/app/components/marketplace/TailorGrid";
import { useTailors } from "@/app/hooks/useTailors";
import { dummyTailors } from "@/app/lib/dummyData";
import { Loader2 } from "lucide-react";

export default function TailorsPage() {
  const { tailors, loading, error, pagination } = useTailors();

  // Fallback to dummy data if API returns empty (no data in DB yet)
  const displayTailors = tailors.length > 0 ? tailors : dummyTailors;
  const totalTailors = pagination?.total || displayTailors.length;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="mb-12 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Unsere Schneider
        </h1>
        <p className="text-lg text-slate-600">
          Entdecke talentierte Schneider aus der ganzen Welt. Jeder Schneider
          bringt einzigartige Fähigkeiten und jahrelange Erfahrung mit.
        </p>
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

      {/* Error State */}
      {error && !loading && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <p className="text-sm text-red-500 mt-2">
            Bitte versuche es später erneut.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && displayTailors.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-600 text-lg">Keine Schneider gefunden.</p>
        </div>
      )}

      {/* Tailor Grid */}
      {!loading && !error && displayTailors.length > 0 && (
        <TailorGrid tailors={displayTailors} />
      )}
    </div>
  );
}
