"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, ChevronLeft } from "lucide-react";
import { ConfigProgress } from "@/app/components/suits/ConfigProgress";
import { useSuitConfig } from "@/app/contexts/SuitConfigContext";
import { SUIT_MODELS } from "@/app/lib/constants/suit-models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const steps = [
  { number: 1, name: "Modell" },
  { number: 2, name: "Stoff" },
  { number: 3, name: "Maße" },
  { number: 4, name: "Extras" },
  { number: 5, name: "Übersicht" },
];

interface Fabric {
  id: string;
  name: string;
  description: string | null;
  material: string;
  weight: string | null;
  pattern: string | null;
  color: string;
  season: string | null;
  imageUrl: string | null;
  priceCategory: string;
  priceAdd: number;
  isActive: boolean;
}

export default function ConfigureStep2() {
  const router = useRouter();
  const params = useParams();
  const modelId = params.modelId as string;
  const { config, updateFabric } = useSuitConfig();

  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFabric, setSelectedFabric] = useState<string | null>(
    config.fabricId || null
  );

  // Filters
  const [materialFilter, setMaterialFilter] = useState<string>("all");
  const [patternFilter, setPatternFilter] = useState<string>("all");
  const [colorFilter, setColorFilter] = useState<string>("all");
  const [priceCategoryFilter, setPriceCategoryFilter] = useState<string>("all");

  const model = SUIT_MODELS.find((m) => m.id === modelId);

  useEffect(() => {
    fetchFabrics();
  }, []);

  const fetchFabrics = async () => {
    try {
      const response = await fetch("/api/fabrics?active=true");
      const data = await response.json();
      setFabrics(data.fabrics || []);
    } catch (error) {
      console.error("Error fetching fabrics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const filteredFabrics = fabrics.filter((fabric) => {
    if (materialFilter !== "all" && fabric.material !== materialFilter) return false;
    if (patternFilter !== "all" && fabric.pattern !== patternFilter) return false;
    if (colorFilter !== "all" && fabric.color !== colorFilter) return false;
    if (priceCategoryFilter !== "all" && fabric.priceCategory !== priceCategoryFilter)
      return false;
    return true;
  });

  // Get unique filter values
  const uniqueMaterials = Array.from(new Set(fabrics.map((f) => f.material)));
  const uniquePatterns = Array.from(new Set(fabrics.map((f) => f.pattern).filter(Boolean)));
  const uniqueColors = Array.from(new Set(fabrics.map((f) => f.color)));
  const uniquePriceCategories = Array.from(new Set(fabrics.map((f) => f.priceCategory)));

  const handleSelectFabric = (fabricId: string) => {
    setSelectedFabric(fabricId);
    updateFabric(fabricId);
  };

  const handleContinue = () => {
    if (selectedFabric) {
      router.push(`/suits/configure/${modelId}/measurements`);
    }
  };

  const handleBack = () => {
    router.push("/suits/configure");
  };

  if (!model) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Ungültiges Modell</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <ConfigProgress currentStep={2} steps={steps} />

        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            {model.name}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Wähle deinen Stoff
          </h1>
          <p className="text-lg text-slate-600">
            Alle Stoffe werden sorgfältig kuratiert und von höchster Qualität
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-slate-900">Filter</h3>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Material
                  </label>
                  <Select value={materialFilter} onValueChange={setMaterialFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle</SelectItem>
                      {uniqueMaterials.map((material) => (
                        <SelectItem key={material} value={material}>
                          {material}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Muster
                  </label>
                  <Select value={patternFilter} onValueChange={setPatternFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle</SelectItem>
                      {uniquePatterns.map((pattern) => (
                        <SelectItem key={pattern} value={pattern!}>
                          {pattern}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Farbe
                  </label>
                  <Select value={colorFilter} onValueChange={setColorFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle</SelectItem>
                      {uniqueColors.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Preis-Kategorie
                  </label>
                  <Select
                    value={priceCategoryFilter}
                    onValueChange={setPriceCategoryFilter}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle</SelectItem>
                      {uniquePriceCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === "standard"
                            ? "Standard"
                            : category === "premium"
                            ? "Premium"
                            : "Luxus"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {(materialFilter !== "all" ||
                  patternFilter !== "all" ||
                  colorFilter !== "all" ||
                  priceCategoryFilter !== "all") && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setMaterialFilter("all");
                      setPatternFilter("all");
                      setColorFilter("all");
                      setPriceCategoryFilter("all");
                    }}
                  >
                    Filter zurücksetzen
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Fabric Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            ) : filteredFabrics.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-600">
                  Keine Stoffe gefunden. Versuche andere Filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                {filteredFabrics.map((fabric) => (
                  <Card
                    key={fabric.id}
                    className={`relative cursor-pointer transition-all hover:shadow-md ${
                      selectedFabric === fabric.id
                        ? "ring-2 ring-blue-600 shadow-md"
                        : ""
                    }`}
                    onClick={() => handleSelectFabric(fabric.id)}
                  >
                    {selectedFabric === fabric.id && (
                      <div className="absolute top-3 right-3 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center z-10">
                        <Check size={16} className="text-white" />
                      </div>
                    )}

                    <CardContent className="p-4">
                      {/* Image */}
                      <div className="w-full h-32 bg-slate-200 rounded-lg mb-3 flex items-center justify-center">
                        {fabric.imageUrl ? (
                          <img
                            src={fabric.imageUrl}
                            alt={fabric.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-slate-400 text-xs">Bild folgt</span>
                        )}
                      </div>

                      {/* Info */}
                      <h4 className="font-semibold text-slate-900 mb-1">
                        {fabric.name}
                      </h4>
                      <div className="space-y-1 mb-3">
                        <p className="text-xs text-slate-600">
                          {fabric.material}
                          {fabric.weight && ` • ${fabric.weight}`}
                        </p>
                        {fabric.pattern && (
                          <p className="text-xs text-slate-600">{fabric.pattern}</p>
                        )}
                        <p className="text-xs text-slate-600">{fabric.color}</p>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <Badge
                          variant={
                            fabric.priceCategory === "luxury"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {fabric.priceCategory === "standard"
                            ? "Standard"
                            : fabric.priceCategory === "premium"
                            ? "Premium"
                            : "Luxus"}
                        </Badge>
                        <span className="text-sm font-semibold text-slate-900">
                          {fabric.priceAdd > 0 ? `+${fabric.priceAdd}€` : "Inklusive"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8 max-w-6xl mx-auto">
          <Button variant="outline" onClick={handleBack}>
            <ChevronLeft size={16} className="mr-2" />
            Zurück
          </Button>
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedFabric}
            className="px-8"
          >
            Weiter zu Maßen
          </Button>
        </div>
      </div>
    </div>
  );
}
