import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t">
      <div className="container mx-auto px-4 py-12">
        {/* 3-Spalten Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Spalte 1 - Über TailorMarket */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">TailorMarket</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Verbindet talentierte Schneider weltweit mit Kunden, die maßgeschneiderte Qualität schätzen.
            </p>
          </div>

          {/* Spalte 2 - Links */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">
                  Über uns
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">
                  Wie es funktioniert
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">
                  AGB
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/impressum" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">
                  Impressum
                </Link>
              </li>
            </ul>
          </div>

          {/* Spalte 3 - Kontakt */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Kontakt</h4>
            <a
              href="mailto:info@tailormarket.com"
              className="text-slate-600 hover:text-slate-900 text-sm transition-colors"
            >
              info@tailormarket.com
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <p className="text-center text-sm text-slate-600">
            © {currentYear} TailorMarket. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
