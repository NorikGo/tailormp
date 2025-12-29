"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Info } from "lucide-react";
import { ConfigProgress } from "@/app/components/suits/ConfigProgress";
import { useSuitConfig } from "@/app/contexts/SuitConfigContext";
import { SUIT_MODELS } from "@/app/lib/constants/suit-models";
import { SuitMeasurements } from "@/app/types/suit";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Tooltip component (inline for now)
function Tooltip({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function TooltipTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) {
  return <>{children}</>;
}

function TooltipContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return null; // Hidden for now
}

const steps = [
  { number: 1, name: "Modell" },
  { number: 2, name: "Stoff" },
  { number: 3, name: "Maße" },
  { number: 4, name: "Extras" },
  { number: 5, name: "Übersicht" },
];

const measurementGuides = {
  chest: "Messe den Brustumfang an der breitesten Stelle, locker um den Körper",
  waist: "Messe den Taillenumfang an der schmalsten Stelle",
  hips: "Messe den Hüftumfang an der breitesten Stelle",
  shoulderWidth: "Messe von Schulternaht zu Schulternaht über den Rücken",
  sleeveLength: "Messe vom Schulterpunkt bis zum Handgelenk",
  jacketLength: "Messe vom Nacken bis zur gewünschten Saumlänge",
  backLength: "Messe vom Nacken bis zur Taille über den Rücken",
  pantWaist: "Messe den Bundumfang der Hose",
  pantInseam: "Messe die Innenbeinlänge vom Schritt bis zum Boden",
  pantOutseam: "Messe die Außenbeinlänge vom Bund bis zum Boden",
  thigh: "Messe den Oberschenkelumfang an der dicksten Stelle",
};

export default function ConfigureStep3() {
  const router = useRouter();
  const params = useParams();
  const modelId = params.modelId as string;
  const { config, updateMeasurements } = useSuitConfig();

  const model = SUIT_MODELS.find((m) => m.id === modelId);

  const [measurements, setMeasurements] = useState<SuitMeasurements>(
    config.measurements || {
      chest: 0,
      waist: 0,
      hips: 0,
      shoulderWidth: 0,
      sleeveLength: 0,
      jacketLength: 0,
      backLength: 0,
      pantWaist: 0,
      pantInseam: 0,
      pantOutseam: 0,
      thigh: 0,
      unit: "cm",
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleMeasurementChange = (field: keyof SuitMeasurements, value: string) => {
    const numValue = parseFloat(value) || 0;
    setMeasurements((prev) => ({
      ...prev,
      [field]: numValue,
    }));
    // Clear error for this field
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleUnitChange = (unit: "cm" | "inch") => {
    setMeasurements((prev) => ({
      ...prev,
      unit,
    }));
  };

  const validateMeasurements = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Check all fields are filled
    if (measurements.chest <= 0) newErrors.chest = "Bitte eingeben";
    if (measurements.waist <= 0) newErrors.waist = "Bitte eingeben";
    if (measurements.hips <= 0) newErrors.hips = "Bitte eingeben";
    if (measurements.shoulderWidth <= 0) newErrors.shoulderWidth = "Bitte eingeben";
    if (measurements.sleeveLength <= 0) newErrors.sleeveLength = "Bitte eingeben";
    if (measurements.jacketLength <= 0) newErrors.jacketLength = "Bitte eingeben";
    if (measurements.backLength <= 0) newErrors.backLength = "Bitte eingeben";
    if (measurements.pantWaist <= 0) newErrors.pantWaist = "Bitte eingeben";
    if (measurements.pantInseam <= 0) newErrors.pantInseam = "Bitte eingeben";
    if (measurements.pantOutseam <= 0) newErrors.pantOutseam = "Bitte eingeben";
    if (measurements.thigh <= 0) newErrors.thigh = "Bitte eingeben";

    // Plausibility checks
    if (measurements.chest > 0 && measurements.waist > 0) {
      if (measurements.waist > measurements.chest) {
        newErrors.waist = "Taille sollte kleiner als Brust sein";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateMeasurements()) {
      updateMeasurements(measurements);
      router.push(`/suits/configure/${modelId}/customizations`);
    }
  };

  const handleBack = () => {
    router.push(`/suits/configure/${modelId}/fabric`);
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
        <ConfigProgress currentStep={3} steps={steps} />

        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            {model.name}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Deine Maße
          </h1>
          <p className="text-lg text-slate-600 mb-4">
            Gib deine Maße genau ein für die perfekte Passform
          </p>

          {/* Unit Selector */}
          <div className="inline-flex items-center gap-2">
            <span className="text-sm text-slate-600">Einheit:</span>
            <Select value={measurements.unit} onValueChange={handleUnitChange}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cm">cm</SelectItem>
                <SelectItem value="inch">inch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6 mb-8">
          {/* Jacket Measurements */}
          <Card>
            <CardHeader>
              <CardTitle>Sakko-Maße</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MeasurementField
                label="Brustumfang"
                value={measurements.chest}
                unit={measurements.unit}
                onChange={(v) => handleMeasurementChange("chest", v)}
                error={errors.chest}
                guide={measurementGuides.chest}
              />
              <MeasurementField
                label="Taillenumfang"
                value={measurements.waist}
                unit={measurements.unit}
                onChange={(v) => handleMeasurementChange("waist", v)}
                error={errors.waist}
                guide={measurementGuides.waist}
              />
              <MeasurementField
                label="Hüftumfang"
                value={measurements.hips}
                unit={measurements.unit}
                onChange={(v) => handleMeasurementChange("hips", v)}
                error={errors.hips}
                guide={measurementGuides.hips}
              />
              <MeasurementField
                label="Schulterbreite"
                value={measurements.shoulderWidth}
                unit={measurements.unit}
                onChange={(v) => handleMeasurementChange("shoulderWidth", v)}
                error={errors.shoulderWidth}
                guide={measurementGuides.shoulderWidth}
              />
              <MeasurementField
                label="Armlänge"
                value={measurements.sleeveLength}
                unit={measurements.unit}
                onChange={(v) => handleMeasurementChange("sleeveLength", v)}
                error={errors.sleeveLength}
                guide={measurementGuides.sleeveLength}
              />
              <MeasurementField
                label="Sakkolänge"
                value={measurements.jacketLength}
                unit={measurements.unit}
                onChange={(v) => handleMeasurementChange("jacketLength", v)}
                error={errors.jacketLength}
                guide={measurementGuides.jacketLength}
              />
              <MeasurementField
                label="Rückenlänge"
                value={measurements.backLength}
                unit={measurements.unit}
                onChange={(v) => handleMeasurementChange("backLength", v)}
                error={errors.backLength}
                guide={measurementGuides.backLength}
              />
            </CardContent>
          </Card>

          {/* Pants Measurements */}
          <Card>
            <CardHeader>
              <CardTitle>Hosen-Maße</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MeasurementField
                label="Bundweite"
                value={measurements.pantWaist}
                unit={measurements.unit}
                onChange={(v) => handleMeasurementChange("pantWaist", v)}
                error={errors.pantWaist}
                guide={measurementGuides.pantWaist}
              />
              <MeasurementField
                label="Innenbeinlänge"
                value={measurements.pantInseam}
                unit={measurements.unit}
                onChange={(v) => handleMeasurementChange("pantInseam", v)}
                error={errors.pantInseam}
                guide={measurementGuides.pantInseam}
              />
              <MeasurementField
                label="Außenbeinlänge"
                value={measurements.pantOutseam}
                unit={measurements.unit}
                onChange={(v) => handleMeasurementChange("pantOutseam", v)}
                error={errors.pantOutseam}
                guide={measurementGuides.pantOutseam}
              />
              <MeasurementField
                label="Oberschenkelumfang"
                value={measurements.thigh}
                unit={measurements.unit}
                onChange={(v) => handleMeasurementChange("thigh", v)}
                error={errors.thigh}
                guide={measurementGuides.thigh}
              />
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h4 className="font-semibold text-blue-900 mb-2">
                Hilfe beim Messen benötigt?
              </h4>
              <p className="text-sm text-blue-800">
                Für die genauesten Maße empfehlen wir, sich von einer zweiten Person helfen zu lassen.
                Verwende ein flexibles Maßband und messe locker, nicht zu straff.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Button variant="outline" onClick={handleBack}>
            <ChevronLeft size={16} className="mr-2" />
            Zurück
          </Button>
          <Button size="lg" onClick={handleContinue} className="px-8">
            Weiter zu Extras
          </Button>
        </div>
      </div>
    </div>
  );
}

function MeasurementField({
  label,
  value,
  unit,
  onChange,
  error,
  guide,
}: {
  label: string;
  value: number;
  unit: string;
  onChange: (value: string) => void;
  error?: string;
  guide: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Label>{label}</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info size={14} className="text-slate-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">{guide}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="relative">
        <Input
          type="number"
          step="0.1"
          value={value > 0 ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className={error ? "border-red-500" : ""}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
          {unit}
        </span>
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
