import Link from "next/link";
import { BRAND } from "@/app/lib/constants/brand";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t">
      <div className="container mx-auto px-4 py-12">
        {/* 4-Spalten Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Spalte 1 - Über TailorMarket */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">{BRAND.name}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {BRAND.mission}
            </p>
          </div>

          {/* Spalte 2 - Links */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Entdecken</h4>
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
                <Link href="/vietnam" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">
                  Warum Vietnam?
                </Link>
              </li>
              <li>
                <Link href="/quality" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">
                  Qualität & Garantien
                </Link>
              </li>
              <li>
                <Link href="/tailors/apply" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">
                  Schneider werden
                </Link>
              </li>
            </ul>
          </div>

          {/* Spalte 3 - Rechtliches */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Rechtliches</h4>
            <ul className="space-y-2">
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

          {/* Spalte 4 - Kontakt */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Kontakt</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={`mailto:${BRAND.contact.email}`}
                  className="text-slate-600 hover:text-slate-900 text-sm transition-colors"
                >
                  {BRAND.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BRAND.contact.supportEmail}`}
                  className="text-slate-600 hover:text-slate-900 text-sm transition-colors"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <p className="text-center text-sm text-slate-600">
            © {currentYear} {BRAND.name}. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
