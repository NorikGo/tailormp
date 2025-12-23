import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    </div>
  );
}
