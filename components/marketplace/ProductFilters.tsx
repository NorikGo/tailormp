"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, SlidersHorizontal, X } from "lucide-react";

const CATEGORIES = [
  { value: "all", label: "Alle Kategorien" },
  { value: "suits", label: "Anzüge" },
  { value: "shirts", label: "Hemden" },
  { value: "pants", label: "Hosen" },
  { value: "dresses", label: "Kleider" },
  { value: "jackets", label: "Jacken" },
  { value: "coats", label: "Mäntel" },
];

const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "Neueste zuerst" },
  { value: "price_asc", label: "Preis: Niedrig → Hoch" },
  { value: "price_desc", label: "Preis: Hoch → Niedrig" },
  { value: "title_asc", label: "Name: A → Z" },
];

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "createdAt_desc");

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (category && category !== "all") params.set("category", category);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sortBy) params.set("sort", sortBy);

    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("createdAt_desc");
    router.push("/products");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    (category && category !== "all") ||
    minPrice !== "" ||
    maxPrice !== "" ||
    sortBy !== "createdAt_desc";

  return (
    <div className="space-y-4">
      {/* Search Bar & Sort */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Produkte durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            className="pl-10"
          />
        </div>

        {/* Sort Dropdown */}
        <Select value={sortBy} onValueChange={(value) => {
          setSortBy(value);
          const params = new URLSearchParams(searchParams.toString());
          params.set("sort", value);
          router.push(`/products?${params.toString()}`);
        }}>
          <SelectTrigger className="w-full md:w-[220px]">
            <SelectValue placeholder="Sortieren nach" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Toggle Filters Button */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="md:w-auto"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filter {hasActiveFilters && `(${
            [searchQuery.trim(), category !== "all", minPrice, maxPrice].filter(Boolean).length
          })`}
        </Button>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <Label htmlFor="category" className="mb-2 block">
                  Kategorie
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Kategorie wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Min Price Filter */}
              <div>
                <Label htmlFor="minPrice" className="mb-2 block">
                  Min. Preis (€)
                </Label>
                <Input
                  id="minPrice"
                  type="number"
                  min="0"
                  step="10"
                  placeholder="z.B. 50"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>

              {/* Max Price Filter */}
              <div>
                <Label htmlFor="maxPrice" className="mb-2 block">
                  Max. Preis (€)
                </Label>
                <Input
                  id="maxPrice"
                  type="number"
                  min="0"
                  step="10"
                  placeholder="z.B. 500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button onClick={applyFilters} className="flex-1">
                Filter anwenden
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4 mr-2" />
                  Zurücksetzen
                </Button>
              )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium text-slate-700 mb-2">
                  Aktive Filter:
                </p>
                <div className="flex flex-wrap gap-2">
                  {searchQuery.trim() && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      Suche: "{searchQuery}"
                    </span>
                  )}
                  {category && category !== "all" && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      {CATEGORIES.find((c) => c.value === category)?.label}
                    </span>
                  )}
                  {minPrice && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      Ab {minPrice}€
                    </span>
                  )}
                  {maxPrice && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      Bis {maxPrice}€
                    </span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
