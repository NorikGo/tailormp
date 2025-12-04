import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Custom 404 Not Found Page
 *
 * Displayed when a route doesn't exist
 * Provides friendly message and navigation back home
 */
export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-slate-400" />
          </div>
        </div>

        {/* 404 */}
        <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>

        {/* Headline */}
        <h2 className="text-2xl font-semibold text-slate-900 mb-3">
          Seite nicht gefunden
        </h2>

        {/* Description */}
        <p className="text-slate-600 mb-8 leading-relaxed">
          Die gesuchte Seite existiert leider nicht. Möglicherweise wurde sie
          verschoben oder gelöscht.
        </p>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/">Zurück zur Startseite</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/products">Produkte durchsuchen</Link>
          </Button>
        </div>

        {/* Additional Help */}
        <p className="text-sm text-slate-500 mt-8">
          Haben Sie einen defekten Link gefunden?{" "}
          <Link href="/kontakt" className="text-blue-600 hover:underline">
            Bitte melden Sie ihn uns
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
