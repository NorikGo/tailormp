"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Update URL with current filters
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (category && category !== "all") params.set("category", category);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sort && sort !== "newest") params.set("sort", sort);

    const queryString = params.toString();
    router.push(`/products${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  }, [search, category, minPrice, maxPrice, sort]);

  const handleReset = () => {
    setSearch("");
    setCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    router.push("/products");
  };

  const hasActiveFilters =
    search || category !== "all" || minPrice || maxPrice || sort !== "newest";

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Produkte durchsuchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter
          {hasActiveFilters && (
            <span className="ml-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              •
            </span>
          )}
        </Button>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <Label htmlFor="sort" className="text-sm text-slate-600 whitespace-nowrap">
          Sortieren:
        </Label>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger id="sort" className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Neueste zuerst</SelectItem>
            <SelectItem value="price-asc">Preis: Niedrig → Hoch</SelectItem>
            <SelectItem value="price-desc">Preis: Hoch → Niedrig</SelectItem>
            <SelectItem value="rating">Beste Bewertung</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Category */}
              <div>
                <Label htmlFor="category">Kategorie</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Kategorien</SelectItem>
                    <SelectItem value="Anzüge">Anzüge</SelectItem>
                    <SelectItem value="Hemden">Hemden</SelectItem>
                    <SelectItem value="Hosen">Hosen</SelectItem>
                    <SelectItem value="Kleider">Kleider</SelectItem>
                    <SelectItem value="Jacken">Jacken</SelectItem>
                    <SelectItem value="Accessoires">Accessoires</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minPrice">Min. Preis (€)</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="mt-1"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="maxPrice">Max. Preis (€)</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="10000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="mt-1"
                    min="0"
                  />
                </div>
              </div>

              {/* Reset Button */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  Filter zurücksetzen
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
