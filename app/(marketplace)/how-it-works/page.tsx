import { Search, Ruler, ShoppingBag, CheckCircle, MessageSquare, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          Wie es funktioniert
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Von der Suche bis zur perfekt sitzenden Kleidung –
          in wenigen einfachen Schritten zu deiner Maßanfertigung.
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-5xl mx-auto space-y-16 mb-16">
        {/* Step 1 */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                1
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Schneider finden
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed mb-4">
              Durchsuche unsere Auswahl an verifizierten Schneidern aus der ganzen
              Welt. Filtere nach Spezialisierung, Standort und Bewertungen, um den
              perfekten Schneider für dein Projekt zu finden.
            </p>
            <p className="text-slate-600 text-sm">
              Jeder Schneider hat ein detailliertes Profil mit Portfolio, Bewertungen
              und Informationen zu seiner Erfahrung.
            </p>
          </div>
          <div className="md:w-1/2">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-8 text-center">
                <Search className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <p className="text-sm text-slate-700">
                  Über 100 verifizierte Schneider aus 20+ Ländern
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
          <div className="md:w-1/2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                2
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Produkt wählen & Maße angeben
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed mb-4">
              Wähle aus dem Portfolio des Schneiders dein Wunschprodukt. Nach der
              Bestellung wirst du durch unseren Messprozess geführt – entweder mit
              unserem digitalen Measurement-Tool oder manueller Eingabe.
            </p>
            <p className="text-slate-600 text-sm">
              Detaillierte Messanleitungen und Support helfen dir dabei, präzise
              Maße anzugeben.
            </p>
          </div>
          <div className="md:w-1/2">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-8 text-center">
                <Ruler className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <p className="text-sm text-slate-700">
                  Digitales Measurement-Tool für präzise Maße
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                3
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Bezahlen & Kommunizieren
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed mb-4">
              Bezahle sicher über unsere Plattform. Der Schneider erhält 90% des
              Preises, während 10% als Plattformgebühr einbehalten werden. Du kannst
              direkt mit dem Schneider kommunizieren, um Details zu klären.
            </p>
            <p className="text-slate-600 text-sm">
              Sichere Zahlung via Stripe. Dein Geld wird erst nach erfolgreicher
              Lieferung an den Schneider ausgezahlt.
            </p>
          </div>
          <div className="md:w-1/2">
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-8 text-center">
                <ShoppingBag className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <p className="text-sm text-slate-700">
                  Sichere Bezahlung & faire Konditionen
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
          <div className="md:w-1/2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                4
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Anfertigung verfolgen
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed mb-4">
              Der Schneider beginnt mit der Anfertigung deines Produkts. Du erhältst
              regelmäßige Updates zum Status und kannst den Fortschritt in deinem
              Dashboard verfolgen.
            </p>
            <p className="text-slate-600 text-sm">
              Typische Produktionszeit: 2-4 Wochen, je nach Komplexität und Schneider.
            </p>
          </div>
          <div className="md:w-1/2">
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-8 text-center">
                <Package className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                <p className="text-sm text-slate-700">
                  Transparente Statusupdates vom Schneider
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Step 5 */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                5
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Erhalten & Bewerten
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed mb-4">
              Erhalte deine maßgeschneiderte Kleidung direkt zu dir nach Hause.
              Nach Erhalt kannst du eine Bewertung abgeben und deine Erfahrung
              mit anderen teilen.
            </p>
            <p className="text-slate-600 text-sm">
              Bei Problemen steht unser Support-Team bereit, um zu helfen.
            </p>
          </div>
          <div className="md:w-1/2">
            <Card className="bg-pink-50 border-pink-200">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-16 h-16 text-pink-600 mx-auto mb-4" />
                <p className="text-sm text-slate-700">
                  Perfekt sitzende Maßanfertigung für dich
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-3xl mx-auto text-center">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Bereit für deine Maßanfertigung?
            </h2>
            <p className="text-slate-700 mb-6">
              Starte jetzt und finde den perfekten Schneider für dein Projekt
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tailors">
                <Button size="lg">
                  Schneider entdecken
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline">
                  Produkte durchsuchen
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
