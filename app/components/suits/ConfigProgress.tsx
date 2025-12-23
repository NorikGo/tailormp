"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  name: string;
  href?: string;
}

interface ConfigProgressProps {
  currentStep: number;
  steps: Step[];
}

export function ConfigProgress({ currentStep, steps }: ConfigProgressProps) {
  return (
    <div className="w-full py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center relative">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                    currentStep > step.number
                      ? "bg-green-600 border-green-600 text-white"
                      : currentStep === step.number
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-slate-300 text-slate-400"
                  )}
                >
                  {currentStep > step.number ? (
                    <Check size={20} />
                  ) : (
                    <span className="font-semibold">{step.number}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs mt-2 text-center hidden sm:block",
                    currentStep >= step.number ? "text-slate-900 font-medium" : "text-slate-500"
                  )}
                >
                  {step.name}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-2 transition-colors",
                    currentStep > step.number ? "bg-green-600" : "bg-slate-300"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
