import { Sparkles, Ruler, CreditCard, Package, Plane } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";
import { BRAND } from "@/app/lib/constants/brand";

export const metadata: Metadata = {
  title: "So funktioniert's – TailorMarket | Maßanzüge aus Vietnam",
  description: "In 5 einfachen Schritten zu deinem Maßanzug aus Vietnam. Von der Konfiguration bis zur Lieferung – transparent, fair und hochwertig.",
  openGraph: {
    title: "So funktioniert TailorMarket – Dein Maßanzug aus Vietnam",
    description: "Modell wählen, Maße angeben, fertigen lassen. In 4-6 Wochen zu dir nach Hause geliefert.",
    url: "/how-it-works",
  },
};

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          So funktioniert's
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          In 5 einfachen Schritten zu deinem Maßanzug aus Vietnam.
          Transparent, fair und hochwertig – in 4-6 Wochen bei dir.
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-5xl mx-auto space-y-16 mb-16">
        {/* Step 1: Modell & Stoff wählen */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                1
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                {BRAND.howItWorks[0].title}
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed mb-4">
              {BRAND.howItWorks[0].description}
            </p>
            <p className="text-slate-600 text-sm">
              Du hast die Wahl zwischen verschiedenen Anzugmodellen (Classic, Business, Premium)
              und einer Auswahl von 10-20 hochwertigen Stoffen aus Wolle, Wolle-Kaschmir-Mix und mehr.
            </p>
          </div>
          <div className="md:w-1/2">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-8 text-center">
                <Sparkles className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <p className="text-sm text-slate-700">
                  3 Anzugmodelle × 10-20 Premium-Stoffe
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Step 2: Maße digital erfassen */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
          <div className="md:w-1/2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                2
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                {BRAND.howItWorks[1].title}
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed mb-4">
              {BRAND.howItWorks[1].description}
            </p>
            <p className="text-slate-600 text-sm">
              Du musst nicht zum Schneider gehen! Unser digitales Tool führt dich durch
              alle notwendigen Maße (Jacke: Brust, Taille, Schultern, Ärmellänge;
              Hose: Taille, Hüfte, Innenbeinlänge). Mit Hilfe-Icons und Messanleitungen.
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

        {/* Step 3: Bestellung & Zahlung */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                3
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Bestellung & Zahlung
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed mb-4">
              Bezahle sicher über Stripe. <strong className="text-blue-600">60% des Verkaufspreises
              gehen direkt an deinen Schneider</strong> – deutlich mehr als bei traditionellen
              Marken (10-20%). Die restlichen 40% decken Plattformkosten, Qualitätskontrolle
              und Support.
            </p>
            <p className="text-slate-600 text-sm">
              Dein Geld wird sicher aufbewahrt und erst nach erfolgreicher Lieferung
              an den Schneider ausgezahlt.
            </p>
          </div>
          <div className="md:w-1/2">
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-8 text-center">
                <CreditCard className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <p className="text-sm text-slate-700">
                  Sichere Zahlung via Stripe + 60% faire Bezahlung
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Step 4: Fertigung in Vietnam */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
          <div className="md:w-1/2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                4
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Fertigung in Vietnam
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed mb-4">
              Dein Schneider in Vietnam fertigt deinen Anzug handwerklich an.
              Der Prozess dauert <strong>3-4 Wochen</strong> und umfasst Maßprüfung (1-2 Tage),
              handwerkliche Fertigung, Qualitätskontrolle und professionellen Versand.
            </p>
            <p className="text-slate-600 text-sm">
              Du kannst den Status jederzeit in deinem Dashboard verfolgen und erhältst
              Updates vom Schneider bei wichtigen Meilensteinen.
            </p>
          </div>
          <div className="md:w-1/2">
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-8 text-center">
                <Package className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                <p className="text-sm text-slate-700">
                  Handwerkliche Fertigung in 3-4 Wochen
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Step 5: Lieferung & Passform-Check */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                5
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Lieferung & Passform-Check
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed mb-4">
              Dein Anzug wird per <strong>DHL Express</strong> direkt zu dir nach Hause geliefert.
              Geschätzte Gesamtdauer: <strong>4-6 Wochen</strong> (Fertigung + Versand).
            </p>
            <p className="text-slate-600 text-sm">
              <strong>Passform-Garantie:</strong> Sollte der Anzug nicht perfekt sitzen,
              übernehmen wir die Kosten für lokale Anpassungen bei einem Schneider deiner
              Wahl (bis zu 100€). Außerdem hast du 14 Tage Rückgaberecht.
            </p>
          </div>
          <div className="md:w-1/2">
            <Card className="bg-pink-50 border-pink-200">
              <CardContent className="p-8 text-center">
                <Plane className="w-16 h-16 text-pink-600 mx-auto mb-4" />
                <p className="text-sm text-slate-700">
                  DHL Express Lieferung + Passform-Garantie
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-3xl mx-auto text-center">
        <Card className="bg-linear-to-r from-blue-50 to-purple-50 border-none">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Bereit für deinen Maßanzug?
            </h2>
            <p className="text-slate-700 mb-6">
              Starte jetzt die Konfiguration und wähle Modell, Stoff und deine Maße
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/suits/configure">
                <Button size="lg">
                  Anzug konfigurieren
                </Button>
              </Link>
              <Link href="/tailors">
                <Button size="lg" variant="outline">
                  Unsere Schneider
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
