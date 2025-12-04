"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Error Boundary Component
 *
 * Catches errors in components and displays friendly error page
 * Provides retry and navigation options
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console (or send to error tracking service)
    console.error("Error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-2xl font-semibold text-slate-900 mb-3">
          Etwas ist schiefgelaufen
        </h2>

        {/* Error Message */}
        <p className="text-slate-600 mb-2 leading-relaxed">
          {error.message || "Ein unerwarteter Fehler ist aufgetreten."}
        </p>

        {/* Error Digest (for debugging) */}
        {error.digest && (
          <p className="text-xs text-slate-400 mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        <p className="text-sm text-slate-500 mb-8">
          Bitte versuchen Sie es erneut. Sollte das Problem bestehen bleiben,
          kontaktieren Sie uns bitte.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} size="lg">
            Erneut versuchen
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Zur Startseite</Link>
          </Button>
        </div>

        {/* Development Hint */}
        {process.env.NODE_ENV === "development" && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700">
              Entwickler-Info (nur in Development sichtbar)
            </summary>
            <pre className="mt-2 p-4 bg-slate-100 rounded text-xs overflow-auto max-h-40">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
