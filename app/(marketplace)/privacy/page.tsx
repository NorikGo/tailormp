import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung von TailorMarket - Informationen zum Umgang mit Ihren personenbezogenen Daten.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          Datenschutzerklärung
        </h1>

        <p className="text-slate-600 mb-8">
          Stand: {new Date().toLocaleDateString("de-DE", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                1. Verantwortlicher
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Verantwortlich für die Datenverarbeitung auf dieser Website ist:
              </p>
              <p className="text-slate-700 leading-relaxed">
                TailorMarket GmbH<br />
                Musterstraße 123<br />
                12345 Musterstadt<br />
                Deutschland<br />
                <br />
                E-Mail: datenschutz@tailormarket.com<br />
                Telefon: +49 (0) 123 456789
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                2. Erhebung und Speicherung personenbezogener Daten
              </h2>
              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-4">
                2.1 Beim Besuch der Website
              </h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Beim Aufrufen unserer Website werden durch den auf Ihrem Endgerät zum Einsatz kommenden Browser
                automatisch Informationen an den Server unserer Website gesendet. Diese Informationen werden
                temporär in einem sog. Logfile gespeichert. Folgende Informationen werden dabei erfasst:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>IP-Adresse des anfragenden Rechners</li>
                <li>Datum und Uhrzeit des Zugriffs</li>
                <li>Name und URL der abgerufenen Datei</li>
                <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
                <li>Verwendeter Browser und ggf. das Betriebssystem Ihres Rechners</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">
                2.2 Bei Registrierung und Nutzung des Services
              </h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Wenn Sie sich auf unserer Plattform registrieren, erheben wir folgende Daten:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>E-Mail-Adresse</li>
                <li>Name und Vorname</li>
                <li>Adressdaten (bei Bestellungen)</li>
                <li>Zahlungsinformationen (über unseren Zahlungsdienstleister Stripe)</li>
                <li>Profilinformationen (bei Schneidern: Portfolio, Spezialisierungen, etc.)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                3. Weitergabe von Daten
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Eine Übermittlung Ihrer persönlichen Daten an Dritte zu anderen als den im Folgenden
                aufgeführten Zwecken findet nicht statt. Wir geben Ihre persönlichen Daten nur an Dritte weiter, wenn:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Sie Ihre ausdrückliche Einwilligung dazu erteilt haben</li>
                <li>die Weitergabe zur Abwicklung von Verträgen erforderlich ist (z.B. an Schneider bei Bestellungen)</li>
                <li>die Weitergabe zur Zahlungsabwicklung erforderlich ist (Stripe)</li>
                <li>eine gesetzliche Verpflichtung zur Weitergabe besteht</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                4. Cookies
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Wir setzen auf unserer Seite Cookies ein. Hierbei handelt es sich um kleine Dateien,
                die Ihr Browser automatisch erstellt und die auf Ihrem Endgerät gespeichert werden,
                wenn Sie unsere Seite besuchen. Cookies richten auf Ihrem Endgerät keinen Schaden an,
                enthalten keine Viren, Trojaner oder sonstige Schadsoftware.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Wir verwenden:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mt-2">
                <li>Session-Cookies zur Aufrechterhaltung Ihrer Anmeldung</li>
                <li>Funktionale Cookies zur Speicherung Ihrer Einstellungen</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                5. Stripe Zahlungsabwicklung
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Für die Zahlungsabwicklung nutzen wir den Dienstleister Stripe Inc., 510 Townsend Street,
                San Francisco, CA 94103, USA. Wenn Sie eine Zahlung über Stripe durchführen, werden Ihre
                Zahlungsdaten direkt an Stripe übermittelt. Wir erhalten keine vollständigen Zahlungsinformationen.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Weitere Informationen finden Sie in der Datenschutzerklärung von Stripe:
                https://stripe.com/de/privacy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                6. Ihre Rechte
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Recht auf Auskunft</li>
                <li>Recht auf Berichtigung oder Löschung</li>
                <li>Recht auf Einschränkung der Verarbeitung</li>
                <li>Recht auf Widerspruch gegen die Verarbeitung</li>
                <li>Recht auf Datenübertragbarkeit</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">
                Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung
                Ihrer personenbezogenen Daten durch uns zu beschweren.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                7. Datensicherheit
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Wir verwenden innerhalb des Website-Besuchs das verbreitete SSL-Verfahren (Secure Socket Layer)
                in Verbindung mit der jeweils höchsten Verschlüsselungsstufe, die von Ihrem Browser unterstützt wird.
                Ob eine einzelne Seite unseres Internetauftrittes verschlüsselt übertragen wird, erkennen Sie an der
                geschlossenen Darstellung des Schüssel- beziehungsweise Schloss-Symbols in der unteren Statusleiste
                Ihres Browsers.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Wir bedienen uns im Übrigen geeigneter technischer und organisatorischer Sicherheitsmaßnahmen,
                um Ihre Daten gegen zufällige oder vorsätzliche Manipulationen, teilweisen oder vollständigen Verlust,
                Zerstörung oder gegen den unbefugten Zugriff Dritter zu schützen.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                8. Aktualität und Änderung dieser Datenschutzerklärung
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Diese Datenschutzerklärung ist aktuell gültig. Durch die Weiterentwicklung unserer Website und
                Angebote darüber oder aufgrund geänderter gesetzlicher beziehungsweise behördlicher Vorgaben kann
                es notwendig werden, diese Datenschutzerklärung zu ändern. Die jeweils aktuelle Datenschutzerklärung
                kann jederzeit auf der Website unter diesem Link von Ihnen abgerufen und ausgedruckt werden.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
