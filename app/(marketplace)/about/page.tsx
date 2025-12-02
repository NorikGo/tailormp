import { Heart, Globe, Award, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Über uns",
  description: "Wir verbinden talentierte Schneider aus aller Welt mit Kunden, die Wert auf Qualität und individuelle Maßanfertigung legen.",
  openGraph: {
    title: "Über TailorMarket",
    description: "Unsere Mission ist es, traditionelles Schneiderhandwerk in die digitale Welt zu bringen.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          Über TailorMarket
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Wir verbinden talentierte Schneider aus aller Welt mit Kunden, die
          Wert auf Qualität und individuelle Maßanfertigung legen.
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
              TailorMarket wurde gegründet, um das traditionelle Schneiderhandwerk
              in die digitale Welt zu bringen. Wir glauben, dass jeder Zugang zu
              hochwertiger, maßgeschneiderter Kleidung haben sollte – unabhängig
              vom Standort.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Unsere Plattform ermöglicht es Schneidern, ihre Fähigkeiten einem
              globalen Publikum zu präsentieren, während Kunden von individueller
              Beratung und perfekt sitzender Kleidung profitieren.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Values */}
      <div className="max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
          Unsere Werte
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Qualität
              </h3>
              <p className="text-sm text-slate-600">
                Wir arbeiten nur mit verifizierten Schneidern zusammen, die
                höchste Qualitätsstandards erfüllen.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Global
              </h3>
              <p className="text-sm text-slate-600">
                Entdecke Schneider aus der ganzen Welt und lass dir deine
                Traumkleidung anfertigen.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Handwerk
              </h3>
              <p className="text-sm text-slate-600">
                Wir fördern traditionelles Handwerk und faire Bezahlung für
                Schneider.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Community
              </h3>
              <p className="text-sm text-slate-600">
                Wir bauen eine Community von Schneider-Enthusiasten und
                zufriedenen Kunden auf.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
            <div className="text-sm text-slate-600">Verifizierte Schneider</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
            <div className="text-sm text-slate-600">Zufriedene Kunden</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">1000+</div>
            <div className="text-sm text-slate-600">Maßanfertigungen</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-600 mb-2">20+</div>
            <div className="text-sm text-slate-600">Länder</div>
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Unsere Geschichte
            </h2>
            <div className="space-y-4 text-slate-700">
              <p>
                TailorMarket wurde 2024 von einem Team aus Fashion-Enthusiasten
                und Tech-Experten gegründet. Die Idee entstand aus der
                Frustration, hochwertige Maßanfertigungen zu fairen Preisen zu
                finden.
              </p>
              <p>
                Wir erkannten, dass viele talentierte Schneider weltweit keine
                Möglichkeit hatten, ihre Dienstleistungen einem breiteren
                Publikum anzubieten. Gleichzeitig suchten Kunden nach Alternativen
                zu teurer Massenware.
              </p>
              <p>
                Heute verbinden wir Schneider aus über 20 Ländern mit Kunden
                weltweit. Unsere Plattform macht maßgeschneiderte Kleidung
                zugänglich, transparent und fair für alle Beteiligten.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
