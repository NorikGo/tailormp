"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { SUIT_MODELS } from "@/app/lib/constants/suit-models";
import { ConfigProgress } from "@/app/components/suits/ConfigProgress";
import { useSuitConfig } from "@/app/contexts/SuitConfigContext";

const steps = [
  { number: 1, name: "Modell" },
  { number: 2, name: "Stoff" },
  { number: 3, name: "Maße" },
  { number: 4, name: "Extras" },
  { number: 5, name: "Übersicht" },
];

export default function ConfigureStep1() {
  const router = useRouter();
  const { config, updateModel } = useSuitConfig();
  const [selectedModel, setSelectedModel] = useState<string | null>(
    config.modelId || null
  );

  const handleSelectModel = (modelId: string) => {
    setSelectedModel(modelId);
    updateModel(modelId);
  };

  const handleContinue = () => {
    if (selectedModel) {
      router.push(`/suits/configure/${selectedModel}/fabric`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <ConfigProgress currentStep={1} steps={steps} />

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Wähle dein Anzugmodell
          </h1>
          <p className="text-lg text-slate-600">
            Jedes Modell kann individuell angepasst werden
          </p>
        </div>

        {/* Model Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
          {SUIT_MODELS.filter((model) => model.isActive).map((model) => (
            <Card
              key={model.id}
              className={`relative cursor-pointer transition-all hover:shadow-lg ${
                selectedModel === model.id
                  ? "ring-2 ring-blue-600 shadow-lg"
                  : ""
              }`}
              onClick={() => handleSelectModel(model.id)}
            >
              {selectedModel === model.id && (
                <div className="absolute top-4 right-4 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Check size={20} className="text-white" />
                </div>
              )}

              <CardContent className="p-6">
                {/* Image Placeholder */}
                <div className="w-full h-48 bg-slate-200 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">Bild folgt</span>
                </div>

                {/* Model Info */}
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {model.name}
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  {model.description}
                </p>

                {/* Features */}
                <ul className="space-y-1 mb-4">
                  {model.features.map((feature, index) => (
                    <li key={index} className="text-sm text-slate-700 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Price */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Ab</span>
                    <span className="text-2xl font-bold text-slate-900">
                      {model.basePrice}€
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedModel}
            className="px-8"
          >
            Weiter zum Stoff
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-12 max-w-2xl mx-auto bg-white rounded-lg border p-6">
          <h4 className="font-semibold text-slate-900 mb-2">Unsicher?</h4>
          <p className="text-sm text-slate-600">
            Alle Modelle können individuell angepasst werden. Der Classic Suit ist perfekt für Business-Anlässe,
            der Business Suit für einen modernen Look, und der Premium Suit bietet maximale Individualisierung.
          </p>
        </div>
      </div>
    </div>
  );
}
