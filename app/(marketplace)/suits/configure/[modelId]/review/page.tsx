"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Loader2, ShoppingCart } from "lucide-react";
import { ConfigProgress } from "@/app/components/suits/ConfigProgress";
import { useSuitConfig } from "@/app/contexts/SuitConfigContext";
import { SUIT_MODELS } from "@/app/lib/constants/suit-models";
import { useAuth } from "@/app/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/app/lib/pricing/suit-pricing";

const steps = [
  { number: 1, name: "Modell" },
  { number: 2, name: "Stoff" },
  { number: 3, name: "Maße" },
  { number: 4, name: "Extras" },
  { number: 5, name: "Übersicht" },
];

const CUSTOMIZATION_PRICES = {
  lining: 50,
  monogram: 30,
  extraTrousers: 120,
};

interface Fabric {
  id: string;
  name: string;
  description: string | null;
  material: string;
  weight: string | null;
  pattern: string | null;
  color: string;
  priceAdd: number;
}

interface PriceBreakdown {
  basePrice: number;
  fabricAdd: number;
  customizationAdd: number;
  totalPrice: number;
}

export default function ConfigureStep5() {
  const router = useRouter();
  const params = useParams();
  const modelId = params.modelId as string;
  const { config, resetConfig } = useSuitConfig();
  const { user } = useAuth();
  const { toast } = useToast();

  const [fabric, setFabric] = useState<Fabric | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);

  const model = SUIT_MODELS.find((m) => m.id === modelId);

  useEffect(() => {
    // Validate that all steps are completed
    if (!config.modelId || !config.fabricId || !config.measurements) {
      toast({
        title: "Unvollständige Konfiguration",
        description: "Bitte vervollständige alle Schritte",
        variant: "destructive",
      });
      router.push("/suits/configure");
      return;
    }

    fetchFabric();
  }, [config]);

  const fetchFabric = async () => {
    if (!config.fabricId) return;

    try {
      const response = await fetch("/api/fabrics?active=true");
      const data = await response.json();
      const foundFabric = data.fabrics.find((f: Fabric) => f.id === config.fabricId);
      setFabric(foundFabric || null);

      // Calculate price
      if (model && foundFabric) {
        const basePrice = model.basePrice;
        const fabricAdd = foundFabric.priceAdd;
        let customizationAdd = 0;

        if (config.customizations?.lining) customizationAdd += CUSTOMIZATION_PRICES.lining;
        if (config.customizations?.monogram) customizationAdd += CUSTOMIZATION_PRICES.monogram;
        if (config.customizations?.extraTrousers)
          customizationAdd += CUSTOMIZATION_PRICES.extraTrousers;

        setPriceBreakdown({
          basePrice,
          fabricAdd,
          customizationAdd,
          totalPrice: basePrice + fabricAdd + customizationAdd,
        });
      }
    } catch (error) {
      console.error("Error fetching fabric:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Bitte melden Sie sich an, um fortzufahren.",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    if (!priceBreakdown || !model || !fabric) {
      toast({
        title: "Fehler",
        description: "Konfiguration ist unvollständig",
        variant: "destructive",
      });
      return;
    }

    setIsAddingToCart(true);

    try {
      // Create a configured suit product
      const response = await fetch("/api/suits/configured", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          configuration: config,
          price: priceBreakdown.totalPrice,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create configured suit");
      }

      // Add to cart
      const cartResponse = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: result.product.id,
          quantity: 1,
          notes: `${model.name} - ${fabric.name}`,
        }),
      });

      if (!cartResponse.ok) {
        throw new Error("Failed to add to cart");
      }

      toast({
        title: "Erfolgreich hinzugefügt",
        description: "Dein konfigurierter Anzug wurde zum Warenkorb hinzugefügt.",
      });

      // Reset config and redirect to cart
      resetConfig();
      router.push("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Fehler",
        description:
          error instanceof Error ? error.message : "Konnte nicht zum Warenkorb hinzufügen",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBack = () => {
    router.push(`/suits/configure/${modelId}/customizations`);
  };

  if (!model || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!fabric || !priceBreakdown) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Fehler beim Laden der Konfiguration</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <ConfigProgress currentStep={5} steps={steps} />

        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            {model.name}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Überprüfe deine Konfiguration
          </h1>
          <p className="text-lg text-slate-600">
            Stelle sicher, dass alles korrekt ist, bevor du bestellst
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6 mb-8">
          {/* Model Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Anzugmodell</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/suits/configure")}
                >
                  Ändern
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-slate-400">Bild</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-slate-900">{model.name}</h3>
                  <p className="text-sm text-slate-600 mb-2">{model.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {model.features.map((feature, index) => (
                      <Badge key={index} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fabric Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Stoff</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/suits/configure/${modelId}/fabric`)}
                >
                  Ändern
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-slate-400">Bild</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-slate-900">{fabric.name}</h3>
                  <div className="space-y-1 text-sm text-slate-600">
                    <p>{fabric.material}</p>
                    {fabric.pattern && <p>Muster: {fabric.pattern}</p>}
                    <p>Farbe: {fabric.color}</p>
                    {fabric.weight && <p>Gewicht: {fabric.weight}</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Measurements */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Maße</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/suits/configure/${modelId}/measurements`)}
                >
                  Ändern
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {config.measurements ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <MeasurementItem
                    label="Brustumfang"
                    value={config.measurements.chest}
                    unit={config.measurements.unit}
                  />
                  <MeasurementItem
                    label="Taillenumfang"
                    value={config.measurements.waist}
                    unit={config.measurements.unit}
                  />
                  <MeasurementItem
                    label="Hüftumfang"
                    value={config.measurements.hips}
                    unit={config.measurements.unit}
                  />
                  <MeasurementItem
                    label="Schulterbreite"
                    value={config.measurements.shoulderWidth}
                    unit={config.measurements.unit}
                  />
                  <MeasurementItem
                    label="Armlänge"
                    value={config.measurements.sleeveLength}
                    unit={config.measurements.unit}
                  />
                  <MeasurementItem
                    label="Sakkolänge"
                    value={config.measurements.jacketLength}
                    unit={config.measurements.unit}
                  />
                  <MeasurementItem
                    label="Bundweite"
                    value={config.measurements.pantWaist}
                    unit={config.measurements.unit}
                  />
                  <MeasurementItem
                    label="Innenbeinlänge"
                    value={config.measurements.pantInseam}
                    unit={config.measurements.unit}
                  />
                  <MeasurementItem
                    label="Außenbeinlänge"
                    value={config.measurements.pantOutseam}
                    unit={config.measurements.unit}
                  />
                </div>
              ) : (
                <p className="text-slate-600">Keine Maße vorhanden</p>
              )}
            </CardContent>
          </Card>

          {/* Customizations */}
          {(config.customizations?.lining ||
            config.customizations?.monogram ||
            config.customizations?.extraTrousers) && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Extras</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/suits/configure/${modelId}/customizations`)}
                  >
                    Ändern
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {config.customizations.lining && (
                    <li className="flex items-center justify-between">
                      <span className="text-slate-700">Premium-Futter</span>
                      <span className="font-semibold">+{CUSTOMIZATION_PRICES.lining}€</span>
                    </li>
                  )}
                  {config.customizations.monogram && (
                    <li className="flex items-center justify-between">
                      <span className="text-slate-700">
                        Monogramm ({config.customizations.monogramText})
                      </span>
                      <span className="font-semibold">+{CUSTOMIZATION_PRICES.monogram}€</span>
                    </li>
                  )}
                  {config.customizations.extraTrousers && (
                    <li className="flex items-center justify-between">
                      <span className="text-slate-700">Zweite Hose</span>
                      <span className="font-semibold">+{CUSTOMIZATION_PRICES.extraTrousers}€</span>
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Price Breakdown */}
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
            <CardHeader>
              <CardTitle>Preisübersicht</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-slate-700">
                  <span>Basispreis ({model.name})</span>
                  <span>{formatPrice(priceBreakdown.basePrice)}</span>
                </div>
                {priceBreakdown.fabricAdd > 0 && (
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Stoff-Aufschlag</span>
                    <span>+{formatPrice(priceBreakdown.fabricAdd)}</span>
                  </div>
                )}
                {priceBreakdown.customizationAdd > 0 && (
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Extras</span>
                    <span>+{formatPrice(priceBreakdown.customizationAdd)}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900">Gesamt</span>
                    <span className="text-3xl font-bold text-blue-600">
                      {formatPrice(priceBreakdown.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Box */}
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="p-6">
              <h4 className="font-semibold text-slate-900 mb-2">Was passiert als Nächstes?</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Dein Anzug wird maßgefertigt von erfahrenen Schneidern in Vietnam</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Produktionszeit: 4-6 Wochen (inkl. Versand)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>60% des Preises gehen direkt an den Schneider</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Passform-Garantie: Bis zu 100€ für lokale Anpassungen</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Button variant="outline" onClick={handleBack}>
            <ChevronLeft size={16} className="mr-2" />
            Zurück
          </Button>
          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="px-8"
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Wird hinzugefügt...
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                In den Warenkorb
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function MeasurementItem({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="font-semibold text-slate-900">
        {value} {unit}
      </p>
    </div>
  );
}
