"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SuitConfiguration, SuitMeasurements } from "@/app/types/suit";

interface SuitConfigContextType {
  config: Partial<SuitConfiguration>;
  updateModel: (modelId: string) => void;
  updateFabric: (fabricId: string) => void;
  updateFitType: (fitType: "slim" | "regular" | "relaxed") => void;
  updateLapelStyle: (lapelStyle: "notch" | "peak" | "shawl") => void;
  updateVentStyle: (ventStyle: "single" | "double" | "none") => void;
  updateButtonCount: (count: 1 | 2 | 3) => void;
  updatePocketStyle: (pocketStyle: "flap" | "patch" | "welted") => void;
  updateMeasurements: (measurements: SuitMeasurements) => void;
  updateCustomizations: (customizations: {
    lining?: boolean;
    monogram?: boolean;
    monogramText?: string;
    extraTrousers?: boolean;
  }) => void;
  resetConfig: () => void;
}

const SuitConfigContext = createContext<SuitConfigContextType | undefined>(undefined);

const STORAGE_KEY = "suit-config";

export function SuitConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<Partial<SuitConfiguration>>({});

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved config:", e);
      }
    }
  }, []);

  // Save to localStorage whenever config changes
  useEffect(() => {
    if (Object.keys(config).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }
  }, [config]);

  const updateModel = (modelId: string) => {
    setConfig((prev) => ({ ...prev, modelId: modelId as any }));
  };

  const updateFabric = (fabricId: string) => {
    setConfig((prev) => ({ ...prev, fabricId }));
  };

  const updateFitType = (fitType: "slim" | "regular" | "relaxed") => {
    setConfig((prev) => ({ ...prev, fitType }));
  };

  const updateLapelStyle = (lapelStyle: "notch" | "peak" | "shawl") => {
    setConfig((prev) => ({ ...prev, lapelStyle }));
  };

  const updateVentStyle = (ventStyle: "single" | "double" | "none") => {
    setConfig((prev) => ({ ...prev, ventStyle }));
  };

  const updateButtonCount = (count: 1 | 2 | 3) => {
    setConfig((prev) => ({ ...prev, buttonCount: count }));
  };

  const updatePocketStyle = (pocketStyle: "flap" | "patch" | "welted") => {
    setConfig((prev) => ({ ...prev, pocketStyle }));
  };

  const updateMeasurements = (measurements: SuitMeasurements) => {
    setConfig((prev) => ({ ...prev, measurements }));
  };

  const updateCustomizations = (customizations: {
    lining?: boolean;
    monogram?: boolean;
    monogramText?: string;
    extraTrousers?: boolean;
  }) => {
    setConfig((prev) => ({ ...prev, customizations }));
  };

  const resetConfig = () => {
    setConfig({});
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <SuitConfigContext.Provider
      value={{
        config,
        updateModel,
        updateFabric,
        updateFitType,
        updateLapelStyle,
        updateVentStyle,
        updateButtonCount,
        updatePocketStyle,
        updateMeasurements,
        updateCustomizations,
        resetConfig,
      }}
    >
      {children}
    </SuitConfigContext.Provider>
  );
}

export function useSuitConfig() {
  const context = useContext(SuitConfigContext);
  if (!context) {
    throw new Error("useSuitConfig must be used within SuitConfigProvider");
  }
  return context;
}
