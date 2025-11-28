import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Ruler, ShoppingBag } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 md:py-32 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Maßgeschneiderte Anzüge. Weltweit.
        </h1>

        <p className="text-xl text-slate-600 mb-8 max-w-2xl leading-relaxed">
          Entdecke talentierte Schneider aus aller Welt und lass dir deinen Traumanzug maßschneidern.
          Fair für Handwerker, erschwinglich für dich.
        </p>

        <Button size="lg" asChild>
          <Link href="/tailors">
            Schneider entdecken
          </Link>
        </Button>
      </section>

      {/* Wie es funktioniert Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">
            So funktioniert&apos;s
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Schritt 1 */}
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <Search className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Schneider finden
                </h3>
                <p className="text-slate-600">
                  Durchsuche hunderte verifizierte Schneider aus aller Welt und finde den perfekten Partner für dein Projekt.
                </p>
              </CardContent>
            </Card>

            {/* Schritt 2 */}
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <Ruler className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Maße angeben
                </h3>
                <p className="text-slate-600">
                  Nutze unser Measurement-Tool für präzise Maße oder sende deine bereits vorhandenen Maßangaben.
                </p>
              </CardContent>
            </Card>

            {/* Schritt 3 */}
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <ShoppingBag className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Bestellen & genießen
                </h3>
                <p className="text-slate-600">
                  Erhalte deine maßgeschneiderte Kleidung direkt nach Hause geliefert und genieße perfekte Passform.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
