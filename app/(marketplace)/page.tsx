import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Ruler, ShoppingBag } from "lucide-react";
import TailorGrid from "@/app/components/marketplace/TailorGrid";
import ProductGrid from "@/app/components/marketplace/ProductGrid";
import { dummyTailors, dummyProducts } from "@/app/lib/dummyData";
import { Metadata } from "next";
import { BRAND, TERMINOLOGY } from "@/app/lib/constants/brand";

export const metadata: Metadata = {
  title: `${BRAND.name} - ${BRAND.tagline}`,
  description: BRAND.mission,
  keywords: ["Maßanzüge Vietnam", "faire Maßschneider", "Anzüge aus Vietnam", "custom suits", "Maßanfertigung fair"],
  openGraph: {
    title: `${BRAND.name} - ${BRAND.tagline}`,
    description: BRAND.mission,
    url: "/",
    type: "website",
    siteName: BRAND.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} - ${BRAND.tagline}`,
    description: BRAND.mission,
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
          {BRAND.slogan}
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-6 md:mb-8 max-w-2xl leading-relaxed px-4">
          Hochwertige Handarbeit von erfahrenen Schneidern aus Vietnam – zu {BRAND.pricing.savingsVsLocal} günstigeren Preisen als in Deutschland.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4">
          <Button size="lg" asChild>
            <Link href="/products">
              {TERMINOLOGY.buyNow}
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/tailors">
              {TERMINOLOGY.exploreTailors}
            </Link>
          </Button>
        </div>

        {/* Trust Signals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 w-full max-w-3xl px-4">
          {BRAND.guarantees.map((guarantee) => (
            <div key={guarantee.title} className="text-center">
              <p className="text-sm font-semibold text-slate-900">{guarantee.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Wie es funktioniert Section */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-8 md:mb-12">
            {TERMINOLOGY.howItWorks}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {BRAND.howItWorks.map((step) => (
              <Card key={step.step} className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <span className="text-4xl">{step.icon}</span>
                  </div>
                  <div className="text-sm font-semibold text-blue-600 mb-2">
                    Schritt {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Vietnam Story */}
          <div className="mt-16 text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              {BRAND.vietnam.title}
            </h3>
            <p className="text-lg text-slate-600 mb-4">{BRAND.vietnam.why}</p>
            <p className="text-slate-600">{BRAND.vietnam.quality}</p>
          </div>
        </div>
      </section>

      {/* Fairness Section */}
      <section className="py-12 md:py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BRAND.values.map((value) => (
              <div key={value.id} className="text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Price Transparency Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Transparente Preise
            </h2>
            <p className="text-lg text-slate-600">
              Bei uns siehst du genau, wohin dein Geld fließt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Bei uns */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <p className="text-sm font-semibold text-green-700 mb-2">
                    Bei TailorMarket
                  </p>
                  <p className="text-4xl font-bold text-slate-900">
                    {BRAND.pricing.min}-{BRAND.pricing.max}€
                  </p>
                  <p className="text-sm text-slate-600 mt-1">pro Maßanzug</p>
                </div>
                <div className="space-y-2 text-sm mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Schneider</span>
                    <span className="font-semibold text-green-700">60%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Plattform & Logistik</span>
                    <span className="font-semibold text-slate-700">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Qualitätssicherung</span>
                    <span className="font-semibold text-slate-700">15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* In Deutschland */}
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <p className="text-sm font-semibold text-slate-500 mb-2">
                    Vergleich Deutschland
                  </p>
                  <p className="text-4xl font-bold text-slate-900">
                    1.200-2.500€
                  </p>
                  <p className="text-sm text-slate-600 mt-1">pro Maßanzug</p>
                </div>
                <div className="text-center mt-6">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {BRAND.pricing.savingsVsLocal} günstiger
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center bg-slate-50 rounded-lg p-6">
            <p className="text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Faire Bezahlung garantiert:</strong>{" "}
              {BRAND.vietnam.fairness}
            </p>
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
                Beliebte {TERMINOLOGY.products}
              </h2>
              <p className="text-sm md:text-base text-slate-600">
                Unsere meistgefragten {TERMINOLOGY.products}
              </p>
            </div>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/products">Alle anzeigen</Link>
            </Button>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Vertrauen durch Transparenz
            </h2>
            <p className="text-lg text-slate-600">
              Gemeinsam bauen wir eine faire Alternative zu Fast Fashion
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                {topTailors.length}+
              </div>
              <div className="text-sm text-slate-600">Verifizierte Schneider</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                {featuredProducts.length}+
              </div>
              <div className="text-sm text-slate-600">Anzüge verfügbar</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                60%
              </div>
              <div className="text-sm text-slate-600">Gehen an Schneider</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                4.8/5
              </div>
              <div className="text-sm text-slate-600">Kundenbewertung</div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <p className="text-lg text-slate-700 italic mb-4">
              "Endlich eine Plattform, die Qualität und Fairness vereint. Mein Anzug sitzt perfekt, und ich weiß genau, dass der Schneider fair bezahlt wurde."
            </p>
            <p className="text-sm font-semibold text-slate-900">Michael S.</p>
            <p className="text-xs text-slate-500">Kunde seit 2024</p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Bereit für deinen perfekten Maßanzug?
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Starte jetzt die Konfiguration und erhalte deinen individuell gefertigten Anzug in 3-4 Wochen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-blue-50">
              <Link href="/products">
                {TERMINOLOGY.buyNow}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-blue-600">
              <Link href="/tailors">
                {TERMINOLOGY.exploreTailors}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
