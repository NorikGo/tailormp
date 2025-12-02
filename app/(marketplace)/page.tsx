import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Ruler, ShoppingBag } from "lucide-react";
import TailorGrid from "@/app/components/marketplace/TailorGrid";
import ProductGrid from "@/app/components/marketplace/ProductGrid";
import { dummyTailors, dummyProducts } from "@/app/lib/dummyData";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maßgeschneiderte Anzüge weltweit",
  description: "Entdecke talentierte Schneider aus aller Welt und lass dir deinen Traumanzug maßschneidern. Fair für Handwerker, erschwinglich für dich.",
  openGraph: {
    title: "TailorMarket - Maßgeschneiderte Anzüge weltweit",
    description: "Entdecke talentierte Schneider aus aller Welt und lass dir deinen Traumanzug maßschneidern.",
    url: "/",
    type: "website",
  },
};

export default async function HomePage() {
  // TODO: Replace with API calls when database is ready
  // For now, use dummy data sorted appropriately
  const topTailors = [...dummyTailors]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  const featuredProducts = [...dummyProducts]
    .filter((p) => p.featured)
    .slice(0, 6);
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-12 md:py-20 lg:py-32 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 md:mb-6 leading-tight px-4">
          Maßgeschneiderte Anzüge. Weltweit.
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-6 md:mb-8 max-w-2xl leading-relaxed px-4">
          Entdecke talentierte Schneider aus aller Welt und lass dir deinen Traumanzug maßschneidern.
          Fair für Handwerker, erschwinglich für dich.
        </p>

        <Button size="lg" asChild className="w-full sm:w-auto mx-4">
          <Link href="/tailors">
            Schneider entdecken
          </Link>
        </Button>
      </section>

      {/* Wie es funktioniert Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-8 md:mb-12">
            So funktioniert&apos;s
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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

      {/* Top Schneider Section */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                Top Schneider
              </h2>
              <p className="text-sm md:text-base text-slate-600">
                Entdecke unsere am besten bewerteten Schneider
              </p>
            </div>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/tailors">Alle anzeigen</Link>
            </Button>
          </div>
          <TailorGrid tailors={topTailors} />
        </div>
      </section>

      {/* Beliebte Produkte Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                Beliebte Produkte
              </h2>
              <p className="text-sm md:text-base text-slate-600">
                Unsere meistgefragten maßgeschneiderten Stücke
              </p>
            </div>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/products">Alle anzeigen</Link>
            </Button>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>
    </div>
  );
}
