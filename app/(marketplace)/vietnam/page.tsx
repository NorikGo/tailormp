import { MapPin, Award, Heart, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "next";
import { BRAND } from "@/app/lib/constants/brand";

export const metadata: Metadata = {
  title: "Warum Vietnam? – TailorMarket | Jahrhunderte Schneidertradition",
  description: "Vietnam hat eine jahrhundertelange Schneidertradition. Erfahre, warum vietnamesische Schneider für Hugo Boss und Armani fertigen und was das für deinen Maßanzug bedeutet.",
  openGraph: {
    title: "Warum Vietnam? Die Tradition der Schneiderkunst",
    description: "Hochwertige Maßanzüge aus Vietnam. Faire Bezahlung, erstklassige Qualität.",
    url: "/vietnam",
  },
};

export default function VietnamPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          Warum Vietnam?
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          {BRAND.vietnam.why}
        </p>
      </div>

      {/* Tradition */}
      <div className="max-w-5xl mx-auto mb-16">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Award className="w-8 h-8 text-blue-600" />
              Jahrhunderte alte Schneidertradition
            </h2>
            <div className="space-y-4 text-slate-700">
              <p className="text-lg">
                {BRAND.vietnam.tradition}
              </p>
              <p>
                Die vietnamesische Schneidertradition reicht Jahrhunderte zurück und ist
                besonders in Städten wie <strong>Hoi An</strong>, <strong>Ho Chi Minh City</strong> und{" "}
                <strong>Hanoi</strong> lebendig. Hoi An gilt als die "Stadt der Schneider" und
                zieht jährlich tausende Kunden aus aller Welt an.
              </p>
              <p>
                Was früher nur durch Reisen nach Vietnam möglich war, bringen wir jetzt zu dir
                nach Hause – mit der gleichen Qualität, aber deutlich weniger Aufwand.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quality */}
      <div className="max-w-5xl mx-auto mb-16">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              Qualität auf internationalem Niveau
            </h2>
            <div className="space-y-4 text-slate-700">
              <p className="text-lg font-semibold text-green-800">
                {BRAND.vietnam.quality}
              </p>
              <p>
                Die Schneider, mit denen wir zusammenarbeiten, haben alle mindestens{" "}
                <strong>10 Jahre Erfahrung</strong> in der Fertigung von Maßanzügen.
                Viele von ihnen haben für internationale Luxusmarken gearbeitet und
                bringen dieses Know-how in jeden einzelnen Anzug ein.
              </p>
              <div className="bg-slate-50 rounded-lg p-6 mt-6">
                <h3 className="font-semibold text-slate-900 mb-3">
                  Qualitätsstandards unserer Partner-Schneider:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Mindestens 10 Jahre Erfahrung in Maßschneiderei</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Arbeit für internationale Luxusmarken (Hugo Boss, Armani, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Handwerkliche Fertigung mit Liebe zum Detail</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Verwendung hochwertiger Stoffe (Wolle, Wolle-Kaschmir, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Professionelle Qualitätskontrolle vor Versand</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fairness */}
      <div className="max-w-5xl mx-auto mb-16">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Heart className="w-8 h-8 text-blue-600" />
              Faire Bezahlung – ein echter Unterschied
            </h2>
            <div className="space-y-4 text-slate-700">
              <p className="text-lg font-semibold text-blue-800">
                {BRAND.vietnam.fairness}
              </p>
              <p>
                Bei traditionellen Modemarken erhalten Schneider oft nur{" "}
                <strong>10-20% des Verkaufspreises</strong>. Der Rest geht an Zwischenhändler,
                Marketing und hohe Gewinnmargen.
              </p>
              <p>
                Bei TailorMarket setzen wir auf <strong>transparente Wertschöpfung:</strong>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="font-semibold text-red-900 mb-3">
                    Traditionelle Marken
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Schneider erhält:</span>
                      <span className="font-bold text-red-700">10-20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Zwischenhändler:</span>
                      <span className="font-bold">30-40%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marketing & Gewinn:</span>
                      <span className="font-bold">40-60%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-3">
                    TailorMarket
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Schneider erhält:</span>
                      <span className="font-bold text-blue-700">60%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plattform & Support:</span>
                      <span className="font-bold">30%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Qualitätskontrolle:</span>
                      <span className="font-bold">10%</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-600 italic mt-6">
                Ein Schneider in Vietnam verdient mit TailorMarket das <strong>3-4-fache</strong> eines
                lokalen Durchschnittseinkommens – und du zahlst trotzdem nur 550-750€
                statt 1.200-2.500€ in Deutschland.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cities */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">
          Unsere Schneider-Städte
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BRAND.vietnam.cities.map((city, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-900">
                  {city}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
