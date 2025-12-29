import { Heart, Globe, Award, Users, Eye, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "next";
import { BRAND } from "@/app/lib/constants/brand";

export const metadata: Metadata = {
  title: "Über uns – TailorMarket | Maßanzüge aus Vietnam",
  description: "Faire Maßanzüge aus Vietnam. 60% des Verkaufspreises gehen direkt an die Schneider. Hochwertige Handwerkskunst zu fairen Preisen.",
  openGraph: {
    title: "Über TailorMarket – Maßanzüge aus Vietnam",
    description: "Unsere Mission: Faire Maßanzüge aus Vietnam mit höchster Qualität und 60% Bezahlung für die Schneider.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          Maßanzüge aus Vietnam.<br />Fair. Hochwertig. Erschwinglich.
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Wir verbinden talentierte Schneider aus Vietnam mit Menschen, die
          Qualität und Fairness schätzen. Dein Maßanzug – handgefertigt von
          erfahrenen Schneidern, die fair bezahlt werden.
        </p>
      </div>

      {/* Mission Statement */}
      <div className="max-w-3xl mx-auto mb-16">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Unsere Mission
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              TailorMarket macht hochwertige Maßanzüge aus Vietnam für jeden zugänglich.
              Wir glauben an faire Bezahlung und transparente Wertschöpfung:
              <strong className="text-blue-600"> 60% des Verkaufspreises gehen direkt an den Schneider</strong> –
              deutlich mehr als die branchenüblichen 10-20%.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Vietnam hat eine jahrhundertelange Schneidertradition. Unsere Partner-Schneider
              fertigen auch für internationale Luxusmarken wie Hugo Boss und Armani.
              Mit TailorMarket erhältst du diese Qualität direkt – ohne Zwischenhändler,
              zu fairen Preisen für dich und die Schneider.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Values */}
      <div className="max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
          Unsere Werte
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {BRAND.values[0].title}
              </h3>
              <p className="text-sm text-slate-600">
                {BRAND.values[0].description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {BRAND.values[1].title}
              </h3>
              <p className="text-sm text-slate-600">
                {BRAND.values[1].description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {BRAND.values[2].title}
              </h3>
              <p className="text-sm text-slate-600">
                {BRAND.values[2].description}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{BRAND.stats.tailors}</div>
            <div className="text-sm text-slate-600">Verifizierte Schneider</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">{BRAND.stats.orders}+</div>
            <div className="text-sm text-slate-600">Maßanzüge gefertigt</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">{BRAND.stats.rating}/5</div>
            <div className="text-sm text-slate-600">Kundenbewertung</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-600 mb-2">60%</div>
            <div className="text-sm text-slate-600">Faire Bezahlung</div>
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-3xl mx-auto mb-16">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Warum Vietnam?
            </h2>
            <div className="space-y-4 text-slate-700">
              <p>
                <strong>{BRAND.vietnam.why}</strong> Städte wie Hoi An sind weltberühmt
                als Zentren für Maßschneiderei – tausende Kunden besuchen sie jährlich,
                um sich hochwertige Anzüge anfertigen zu lassen.
              </p>
              <p>
                {BRAND.vietnam.quality} Die Schneider, mit denen wir zusammenarbeiten,
                haben alle mindestens 10 Jahre Erfahrung und liefern erstklassige
                Handwerkskunst.
              </p>
              <p>
                {BRAND.vietnam.fairness} Bei TailorMarket verdienen Schneider 60% des
                Verkaufspreises – das 3-4-fache eines lokalen Durchschnittseinkommens.
                Zum Vergleich: Bei traditionellen Marken erhalten Schneider nur 10-20%.
              </p>
              <p className="text-sm text-slate-600 italic mt-6">
                Für dich bedeutet das: Ein Maßanzug für 550-750€ statt 1.200-2.500€
                in Deutschland – bei gleicher oder besserer Qualität.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guarantees */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">
          Unsere Garantien
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BRAND.guarantees.map((guarantee, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {guarantee.title}
                </h3>
                <p className="text-sm text-slate-600">
                  {guarantee.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
