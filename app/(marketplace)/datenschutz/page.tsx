import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung von TailorMarket",
};

export default function DatenschutzPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">
        Datenschutzerklärung
      </h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-lg text-slate-600 mb-8">
          Letzte Aktualisierung: {new Date().toLocaleDateString("de-DE")}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            1. Datenschutz auf einen Blick
          </h2>
          <h3 className="text-xl font-medium text-slate-800 mb-3">
            Allgemeine Hinweise
          </h3>
          <p className="text-slate-700 leading-relaxed mb-4">
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was
            mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website
            besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie
            persönlich identifiziert werden können.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            2. Datenerfassung auf dieser Website
          </h2>
          <h3 className="text-xl font-medium text-slate-800 mb-3">
            Wer ist verantwortlich für die Datenerfassung auf dieser Website?
          </h3>
          <p className="text-slate-700 leading-relaxed mb-4">
            Die Datenverarbeitung auf dieser Website erfolgt durch den
            Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum
            dieser Website entnehmen.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            3. Analytics und Drittanbieter-Tools
          </h2>
          <h3 className="text-xl font-medium text-slate-800 mb-3">
            Plausible Analytics
          </h3>
          <p className="text-slate-700 leading-relaxed mb-4">
            Diese Website nutzt Plausible Analytics, einen datenschutzfreundlichen
            Webanalysedienst. Plausible Analytics:
          </p>
          <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
            <li>Verwendet <strong>keine Cookies</strong></li>
            <li>Sammelt <strong>keine personenbezogenen Daten</strong></li>
            <li>Speichert <strong>keine IP-Adressen</strong></li>
            <li>Ist <strong>DSGVO-konform</strong></li>
            <li>Alle Daten werden in der EU gespeichert</li>
          </ul>
          <p className="text-slate-700 leading-relaxed mb-4">
            Wir verwenden Plausible Analytics, um anonyme Nutzungsstatistiken zu
            erheben und unsere Website zu verbessern. Die erfassten Daten umfassen:
          </p>
          <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
            <li>Seitenaufrufe</li>
            <li>Referrer (woher Besucher kommen)</li>
            <li>Gerätekategorie (Desktop, Tablet, Mobile)</li>
            <li>Betriebssystem</li>
            <li>Browser</li>
          </ul>
          <p className="text-slate-700 leading-relaxed">
            Weitere Informationen: <a href="https://plausible.io/data-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Plausible Data Policy</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            4. Allgemeine Hinweise und Pflichtinformationen
          </h2>
          <h3 className="text-xl font-medium text-slate-800 mb-3">
            Datenschutz
          </h3>
          <p className="text-slate-700 leading-relaxed mb-4">
            Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten
            sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und
            entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser
            Datenschutzerklärung.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            5. Ihre Rechte
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Sie haben jederzeit das Recht:
          </p>
          <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
            <li>Auskunft über Ihre gespeicherten personenbezogenen Daten zu erhalten</li>
            <li>Berichtigung unrichtiger Daten zu verlangen</li>
            <li>Löschung Ihrer gespeicherten Daten zu verlangen</li>
            <li>Einschränkung der Datenverarbeitung zu verlangen</li>
            <li>Widerspruch gegen die Verarbeitung Ihrer Daten einzulegen</li>
            <li>Datenübertragbarkeit zu verlangen</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            6. Kontakt
          </h2>
          <p className="text-slate-700 leading-relaxed">
            Bei Fragen zum Datenschutz können Sie sich jederzeit an uns wenden:
          </p>
          <p className="text-slate-700 mt-2">
            <strong>E-Mail:</strong> datenschutz@tailormarket.com
          </p>
        </section>

        <div className="mt-12 p-6 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-sm text-slate-700">
            <strong>Hinweis:</strong> Dies ist eine vereinfachte Datenschutzerklärung
            für Development-Zwecke. Für Production sollten Sie eine vollständige
            Datenschutzerklärung von einem Rechtsanwalt erstellen lassen.
          </p>
        </div>
      </div>
    </div>
  );
}
