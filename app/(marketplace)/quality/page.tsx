import { Shield, CheckCircle, Award, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "next";
import { BRAND } from "@/app/lib/constants/brand";

export const metadata: Metadata = {
  title: "Qualität & Garantien – TailorMarket | Passform-Garantie",
  description: "100% Maßanfertigung, Passform-Garantie bis 100€, 14 Tage Rückgaberecht. Erfahre mehr über unsere Qualitätsversprechen und was uns von anderen unterscheidet.",
  openGraph: {
    title: "Qualität & Garantien – TailorMarket",
    description: "Passform-Garantie, 14 Tage Rückgaberecht, faire Bezahlung garantiert.",
    url: "/quality",
  },
};

export default function QualityPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          Qualität & Garantien
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Wir versprechen nicht nur hochwertige Maßanzüge – wir garantieren sie.
          Deine Zufriedenheit steht an erster Stelle.
        </p>
      </div>

      {/* Guarantees Grid */}
      <div className="max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
          Unsere Garantien
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BRAND.guarantees.map((guarantee, index) => {
            const icons = [Shield, CheckCircle, Award, RefreshCw];
            const Icon = icons[index] || Shield;
            const colors = [
              "bg-blue-100 text-blue-600",
              "bg-green-100 text-green-600",
              "bg-purple-100 text-purple-600",
              "bg-yellow-100 text-yellow-600"
            ];

            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${colors[index]} rounded-full flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {guarantee.title}
                  </h3>
                  <p className="text-slate-600">
                    {guarantee.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Passform-Garantie Details */}
      <div className="max-w-5xl mx-auto mb-16">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Shield className="w-8 h-8 text-green-600" />
              Passform-Garantie – So funktioniert's
            </h2>
            <div className="space-y-4 text-slate-700">
              <p className="text-lg">
                Sollte dein Anzug nicht perfekt sitzen, übernehmen wir die Kosten für
                lokale Anpassungen bei einem Schneider deiner Wahl – bis zu <strong>100€</strong>.
              </p>

              <div className="bg-white rounded-lg p-6 mt-6">
                <h3 className="font-semibold text-slate-900 mb-4">Wie läuft es ab?</h3>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <span>
                      <strong>Anzug erhalten:</strong> Du erhältst deinen Maßanzug und stellst fest,
                      dass kleine Anpassungen nötig sind (z.B. Ärmel kürzen, Taille enger machen).
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <span>
                      <strong>Lokalen Schneider finden:</strong> Gehe zu einem Schneider deiner Wahl
                      in deiner Stadt (du hast die freie Wahl!).
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <span>
                      <strong>Anpassungen durchführen lassen:</strong> Lass die notwendigen Änderungen
                      vornehmen und bezahle vor Ort.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      4
                    </span>
                    <span>
                      <strong>Rechnung einreichen:</strong> Sende uns die Rechnung per E-Mail
                      (support@tailormarket.com) und wir erstatten dir die Kosten – bis zu 100€.
                    </span>
                  </li>
                </ol>
              </div>

              <p className="text-sm text-slate-600 italic mt-6">
                Diese Garantie gilt für 3 Monate nach Erhalt deines Anzugs.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Material Quality */}
      <div className="max-w-5xl mx-auto mb-16">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Award className="w-8 h-8 text-purple-600" />
              Material & Verarbeitung
            </h2>
            <div className="space-y-4 text-slate-700">
              <p>
                Wir verwenden ausschließlich hochwertige Stoffe von renommierten Herstellern:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">Premium Wolle</h3>
                  <p className="text-sm text-slate-600">
                    100% Schurwolle aus Italien und England. Atmungsaktiv, langlebig
                    und knitterfrei.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">Wolle-Kaschmir Mix</h3>
                  <p className="text-sm text-slate-600">
                    90% Wolle, 10% Kaschmir. Besonders weich und luxuriös – perfekt
                    für besondere Anlässe.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">Leinen-Mix</h3>
                  <p className="text-sm text-slate-600">
                    Perfekt für den Sommer. Leicht, atmungsaktiv und elegant.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">Handwerkliche Details</h3>
                  <p className="text-sm text-slate-600">
                    Echte Hornknöpfe, handgenähte Knopflöcher, funktionale Ärmelknöpfe
                    (auf Wunsch).
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quality Control Process */}
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-blue-600" />
              Qualitätskontrolle
            </h2>
            <div className="space-y-4 text-slate-700">
              <p>
                Jeder Anzug durchläuft vor dem Versand eine mehrstufige Qualitätskontrolle:
              </p>

              <ul className="space-y-3 mt-6">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1">✓</span>
                  <div>
                    <strong>Maßkontrolle:</strong> Überprüfung aller Maße gegen deine Angaben
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1">✓</span>
                  <div>
                    <strong>Nahtqualität:</strong> Prüfung aller Nähte auf Gleichmäßigkeit und Haltbarkeit
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1">✓</span>
                  <div>
                    <strong>Stoffqualität:</strong> Kontrolle auf Fehler, Flecken oder Beschädigungen
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1">✓</span>
                  <div>
                    <strong>Details:</strong> Überprüfung von Knöpfen, Knopflöchern, Innenfutter
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1">✓</span>
                  <div>
                    <strong>Endkontrolle:</strong> Finale visuelle Inspektion vor professioneller Verpackung
                  </div>
                </li>
              </ul>

              <p className="text-sm text-slate-600 italic mt-6">
                Nur Anzüge, die alle Qualitätskriterien erfüllen, werden an dich versendet.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
