"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft } from "lucide-react";
import { ConfigProgress } from "@/app/components/suits/ConfigProgress";
import { useSuitConfig } from "@/app/contexts/SuitConfigContext";
import { SUIT_MODELS } from "@/app/lib/constants/suit-models";

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

export default function ConfigureStep4() {
  const router = useRouter();
  const params = useParams();
  const modelId = params.modelId as string;
  const { config, updateCustomizations } = useSuitConfig();

  const model = SUIT_MODELS.find((m) => m.id === modelId);

  const [customizations, setCustomizations] = useState({
    lining: config.customizations?.lining || false,
    monogram: config.customizations?.monogram || false,
    monogramText: config.customizations?.monogramText || "",
    extraTrousers: config.customizations?.extraTrousers || false,
  });

  const handleToggle = (key: "lining" | "monogram" | "extraTrousers") => {
    setCustomizations((prev) => ({
      ...prev,
      [key]: !prev[key],
      // Reset monogram text if unchecked
      ...(key === "monogram" && prev[key] ? { monogramText: "" } : {}),
    }));
  };

  const handleMonogramTextChange = (text: string) => {
    setCustomizations((prev) => ({
      ...prev,
      monogramText: text.slice(0, 4), // Max 4 characters
    }));
  };

  const calculateExtrasTotal = () => {
    let total = 0;
    if (customizations.lining) total += CUSTOMIZATION_PRICES.lining;
    if (customizations.monogram) total += CUSTOMIZATION_PRICES.monogram;
    if (customizations.extraTrousers) total += CUSTOMIZATION_PRICES.extraTrousers;
    return total;
  };

  const handleContinue = () => {
    updateCustomizations(customizations);
    router.push(`/suits/configure/${modelId}/review`);
  };

  const handleBack = () => {
    router.push(`/suits/configure/${modelId}/measurements`);
  };

  if (!model) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Ungültiges Modell</p>
      </div>
    );
  }

  const extrasTotal = calculateExtrasTotal();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <ConfigProgress currentStep={4} steps={steps} />

        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            {model.name}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Wähle deine Extras
          </h1>
          <p className="text-lg text-slate-600">
            Personalisiere deinen Anzug mit optionalen Extras
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4 mb-8">
          {/* Lining Option */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Checkbox
                  id="lining"
                  checked={customizations.lining}
                  onCheckedChange={() => handleToggle("lining")}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="lining" className="text-lg font-semibold cursor-pointer">
                      Premium-Futter
                    </Label>
                    <span className="text-lg font-bold text-slate-900">
                      +{CUSTOMIZATION_PRICES.lining}€
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Hochwertiges Seidenfutter für zusätzlichen Komfort und Stil. Das Futter ist in einer
                    passenden Farbe zum gewählten Stoff und verleiht dem Anzug eine luxuriöse Note.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monogram Option */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Checkbox
                  id="monogram"
                  checked={customizations.monogram}
                  onCheckedChange={() => handleToggle("monogram")}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="monogram" className="text-lg font-semibold cursor-pointer">
                      Monogramm
                    </Label>
                    <span className="text-lg font-bold text-slate-900">
                      +{CUSTOMIZATION_PRICES.monogram}€
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    Lasse deine Initialen dezent ins Innenfutter sticken. Bis zu 4 Zeichen.
                  </p>

                  {customizations.monogram && (
                    <div className="mt-4">
                      <Label htmlFor="monogramText" className="text-sm">
                        Initialen (max. 4 Zeichen)
                      </Label>
                      <Input
                        id="monogramText"
                        value={customizations.monogramText}
                        onChange={(e) => handleMonogramTextChange(e.target.value.toUpperCase())}
                        placeholder="z.B. NK"
                        maxLength={4}
                        className="mt-2 uppercase"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Extra Trousers Option */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Checkbox
                  id="extraTrousers"
                  checked={customizations.extraTrousers}
                  onCheckedChange={() => handleToggle("extraTrousers")}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="extraTrousers" className="text-lg font-semibold cursor-pointer">
                      Zweite Hose
                    </Label>
                    <span className="text-lg font-bold text-slate-900">
                      +{CUSTOMIZATION_PRICES.extraTrousers}€
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Erhalte eine zweite Hose zum Anzug im identischen Stoff. Perfekt für häufige Nutzung,
                    da Hosen schneller verschleißen als das Sakko.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Card */}
          {extrasTotal > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-blue-900">Extras Gesamt</p>
                    <p className="text-sm text-blue-800">
                      {[
                        customizations.lining && "Premium-Futter",
                        customizations.monogram && "Monogramm",
                        customizations.extraTrousers && "Zweite Hose",
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-blue-900">+{extrasTotal}€</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center max-w-3xl mx-auto">
          <Button variant="outline" onClick={handleBack}>
            <ChevronLeft size={16} className="mr-2" />
            Zurück
          </Button>
          <Button size="lg" onClick={handleContinue} className="px-8">
            Zur Übersicht
          </Button>
        </div>
      </div>
    </div>
  );
}
