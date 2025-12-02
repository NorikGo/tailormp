import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Allgemeine Geschäftsbedingungen",
  description: "Allgemeine Geschäftsbedingungen (AGB) von TailorMarket - Die Nutzungsbedingungen unserer Plattform.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          Allgemeine Geschäftsbedingungen
        </h1>

        <p className="text-slate-600 mb-8">
          Stand: {new Date().toLocaleDateString("de-DE", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                1. Geltungsbereich
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Online-Plattform
                TailorMarket (im Folgenden "Plattform" genannt), betrieben von der TailorMarket GmbH
                (im Folgenden "Betreiber" genannt).
              </p>
              <p className="text-slate-700 leading-relaxed">
                Die Plattform dient als Vermittler zwischen Kunden, die maßgeschneiderte Kleidung wünschen,
                und Schneidern, die diese Dienstleistungen anbieten. Der Betreiber ist nicht Partei der
                zwischen Kunden und Schneidern geschlossenen Verträge.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                2. Vertragsschluss
              </h2>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                2.1 Registrierung
              </h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Zur Nutzung der Plattform ist eine Registrierung erforderlich. Mit der Registrierung
                kommt ein Nutzungsvertrag zwischen dem Nutzer und dem Betreiber zustande.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Der Nutzer muss volljährig sein und die Geschäftsfähigkeit besitzen.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">
                2.2 Bestellung
              </h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Wenn ein Kunde eine Bestellung bei einem Schneider aufgibt, kommt der Vertrag direkt
                zwischen Kunde und Schneider zustande. Die Plattform stellt lediglich die technische
                Infrastruktur zur Verfügung und wickelt die Zahlungen ab.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Mit dem Absenden der Bestellung gibt der Kunde ein verbindliches Angebot zum Abschluss
                eines Vertrages mit dem Schneider ab. Der Schneider kann das Angebot durch eine
                Bestätigungsnachricht annehmen.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                3. Pflichten der Nutzer
              </h2>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                3.1 Allgemeine Pflichten
              </h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Der Nutzer verpflichtet sich:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>wahrheitsgemäße Angaben bei der Registrierung zu machen</li>
                <li>seine Zugangsdaten vertraulich zu behandeln</li>
                <li>keine rechtswidrigen Inhalte zu veröffentlichen</li>
                <li>die Rechte Dritter nicht zu verletzen</li>
                <li>die Plattform nicht missbräuchlich zu nutzen</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">
                3.2 Pflichten der Schneider
              </h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Schneider verpflichten sich zusätzlich:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>qualitativ hochwertige Arbeit zu leisten</li>
                <li>die vereinbarten Lieferfristen einzuhalten</li>
                <li>realistische Produktbeschreibungen und -bilder bereitzustellen</li>
                <li>Kundenkommunikation zeitnah zu beantworten</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                4. Zahlung und Preise
              </h2>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                4.1 Preisgestaltung
              </h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Die Preise für die maßgeschneiderten Produkte werden von den Schneidern festgelegt.
                Alle angegebenen Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">
                4.2 Zahlungsabwicklung
              </h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Die Zahlung erfolgt über unseren Zahlungsdienstleister Stripe. Der Kunde zahlt den
                vollständigen Betrag beim Bestellabschluss.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Der Schneider erhält 90% des Verkaufspreises nach erfolgreicher Lieferung. 10% behält
                die Plattform als Vermittlungsgebühr ein.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                5. Widerrufsrecht
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Verbrauchern steht grundsätzlich ein gesetzliches Widerrufsrecht zu. Da es sich jedoch
                um maßgefertigte Produkte handelt, die nach Kundenspezifikation angefertigt werden,
                ist das Widerrufsrecht gemäß § 312g Abs. 2 Nr. 1 BGB ausgeschlossen.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Bei offensichtlichen Mängeln oder Nichterfüllung der vereinbarten Spezifikationen
                gelten die gesetzlichen Gewährleistungsrechte.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                6. Gewährleistung und Haftung
              </h2>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                6.1 Gewährleistung
              </h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Für die Qualität der maßgefertigten Produkte ist ausschließlich der jeweilige Schneider
                verantwortlich. Der Betreiber der Plattform übernimmt keine Gewährleistung für die
                Produkte oder Dienstleistungen der Schneider.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">
                6.2 Haftung des Betreibers
              </h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Der Betreiber haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit. Bei leichter
                Fahrlässigkeit haftet der Betreiber nur bei Verletzung wesentlicher Vertragspflichten.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Die Haftung für Datenverlust wird auf den typischen Wiederherstellungsaufwand beschränkt,
                der bei regelmäßiger und gefahrentsprechender Anfertigung von Sicherungskopien eingetreten wäre.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                7. Bewertungen
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Kunden können nach Abschluss einer Bestellung Bewertungen für Schneider abgeben.
                Diese Bewertungen müssen wahrheitsgemäß sein und dürfen keine beleidigenden oder
                rechtswidrigen Inhalte enthalten.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Der Betreiber behält sich vor, Bewertungen zu löschen, die gegen diese Grundsätze verstoßen.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                8. Beendigung des Nutzungsvertrags
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Beide Parteien können den Nutzungsvertrag jederzeit ohne Angabe von Gründen kündigen.
                Die Kündigung muss in Textform erfolgen.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
                Ein wichtiger Grund liegt insbesondere vor bei Verstoß gegen diese AGB.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                9. Änderung der AGB
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Der Betreiber behält sich vor, diese AGB jederzeit zu ändern. Registrierte Nutzer werden
                über Änderungen per E-Mail informiert. Widerspricht der Nutzer der Geltung der neuen AGB
                nicht innerhalb von 4 Wochen nach der Benachrichtigung, gelten die geänderten AGB als angenommen.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Auf das Widerspruchsrecht und die Bedeutung der Widerrufsfrist wird in der
                Änderungsmitteilung besonders hingewiesen.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                10. Schlussbestimmungen
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
                Bei Verbrauchern gilt diese Rechtswahl nur insoweit, als nicht der gewährte Schutz durch
                zwingende Bestimmungen des Rechts des Staates, in dem der Verbraucher seinen gewöhnlichen
                Aufenthalt hat, entzogen wird.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Sofern der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder
                öffentlich-rechtliches Sondervermögen ist, ist Gerichtsstand für alle Streitigkeiten
                aus Vertragsverhältnissen zwischen dem Kunden und dem Betreiber der Sitz des Betreibers.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
