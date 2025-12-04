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
import { Checkbox } from "@/components/ui/checkbox";

const COUNTRIES = [
  { value: "all", label: "Alle Länder" },
  { value: "Vietnam", label: "Vietnam" },
  { value: "Thailand", label: "Thailand" },
  { value: "India", label: "Indien" },
  { value: "Pakistan", label: "Pakistan" },
  { value: "Bangladesh", label: "Bangladesch" },
  { value: "Turkey", label: "Türkei" },
  { value: "Poland", label: "Polen" },
  { value: "Portugal", label: "Portugal" },
];

const SPECIALTIES = [
  { value: "suits", label: "Anzüge" },
  { value: "dresses", label: "Kleider" },
  { value: "shirts", label: "Hemden" },
  { value: "pants", label: "Hosen" },
  { value: "alterations", label: "Änderungen" },
  { value: "wedding", label: "Hochzeit" },
];

const SORT_OPTIONS = [
  { value: "rating_desc", label: "Beste Bewertung" },
  { value: "totalOrders_desc", label: "Meiste Bestellungen" },
  { value: "yearsExperience_desc", label: "Meiste Erfahrung" },
  { value: "name_asc", label: "Name: A → Z" },
];

export function TailorFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [country, setCountry] = useState(searchParams.get("country") || "all");
  const [minRating, setMinRating] = useState(searchParams.get("minRating") || "all");
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get("verified") === "true");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(
    searchParams.get("specialties")?.split(",").filter(Boolean) || []
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "rating_desc");

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (country && country !== "all") params.set("country", country);
    if (minRating && minRating !== "all") params.set("minRating", minRating);
    if (verifiedOnly) params.set("verified", "true");
    if (selectedSpecialties.length > 0) params.set("specialties", selectedSpecialties.join(","));
    if (sortBy) params.set("sort", sortBy);

    router.push(`/tailors?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCountry("all");
    setMinRating("all");
    setVerifiedOnly(false);
    setSelectedSpecialties([]);
    setSortBy("rating_desc");
    router.push("/tailors");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    (country && country !== "all") ||
    (minRating && minRating !== "all") ||
    verifiedOnly ||
    selectedSpecialties.length > 0 ||
    sortBy !== "rating_desc";

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
  };

  return (
    <div className="space-y-4">
      {/* Search Bar & Sort */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Schneider durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            className="pl-10"
          />
        </div>

        {/* Sort Dropdown */}
        <Select
          value={sortBy}
          onValueChange={(value) => {
            setSortBy(value);
            const params = new URLSearchParams(searchParams.toString());
            params.set("sort", value);
            router.push(`/tailors?${params.toString()}`);
          }}
        >
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
          Filter{" "}
          {hasActiveFilters &&
            `(${
              [
                searchQuery.trim(),
                country !== "all",
                minRating,
                verifiedOnly,
                selectedSpecialties.length > 0,
              ].filter(Boolean).length
            })`}
        </Button>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Row 1: Country & Rating */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Country Filter */}
                <div>
                  <Label htmlFor="country" className="mb-2 block">
                    Land
                  </Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Land wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Min Rating Filter */}
                <div>
                  <Label htmlFor="minRating" className="mb-2 block">
                    Mindestbewertung
                  </Label>
                  <Select value={minRating} onValueChange={setMinRating}>
                    <SelectTrigger id="minRating">
                      <SelectValue placeholder="Bewertung wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle</SelectItem>
                      <SelectItem value="4.5">4.5+ Sterne</SelectItem>
                      <SelectItem value="4.0">4.0+ Sterne</SelectItem>
                      <SelectItem value="3.5">3.5+ Sterne</SelectItem>
                      <SelectItem value="3.0">3.0+ Sterne</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Verified Only Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verified"
                  checked={verifiedOnly}
                  onCheckedChange={(checked) => setVerifiedOnly(checked === true)}
                />
                <Label
                  htmlFor="verified"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Nur verifizierte Schneider anzeigen
                </Label>
              </div>

              {/* Specialties */}
              <div>
                <Label className="mb-3 block">Spezialisierungen</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SPECIALTIES.map((specialty) => (
                    <div key={specialty.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={specialty.value}
                        checked={selectedSpecialties.includes(specialty.value)}
                        onCheckedChange={() => toggleSpecialty(specialty.value)}
                      />
                      <Label
                        htmlFor={specialty.value}
                        className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {specialty.label}
                      </Label>
                    </div>
                  ))}
                </div>
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
                  {country && country !== "all" && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      {COUNTRIES.find((c) => c.value === country)?.label}
                    </span>
                  )}
                  {minRating && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      Min. {minRating}★
                    </span>
                  )}
                  {verifiedOnly && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      Verifiziert
                    </span>
                  )}
                  {selectedSpecialties.map((spec) => (
                    <span
                      key={spec}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                    >
                      {SPECIALTIES.find((s) => s.value === spec)?.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
