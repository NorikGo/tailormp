import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "TailorMarket - Maßgeschneiderte Anzüge weltweit",
    template: "%s | TailorMarket",
  },
  description:
    "Entdecke talentierte Schneider aus aller Welt und lass dir deinen Traumanzug maßschneidern. Fair für Handwerker, erschwinglich für dich.",
  keywords: [
    "Maßschneider",
    "maßgeschneiderte Anzüge",
    "Schneider online",
    "custom tailoring",
    "Maßanfertigung",
    "Herrenschneider",
    "Damenschneider",
  ],
  authors: [{ name: "TailorMarket Team" }],
  creator: "TailorMarket",
  publisher: "TailorMarket",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "/",
    siteName: "TailorMarket",
    title: "TailorMarket - Maßgeschneiderte Anzüge weltweit",
    description:
      "Entdecke talentierte Schneider aus aller Welt und lass dir deinen Traumanzug maßschneidern. Fair für Handwerker, erschwinglich für dich.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TailorMarket - Maßgeschneiderte Anzüge weltweit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TailorMarket - Maßgeschneiderte Anzüge weltweit",
    description:
      "Entdecke talentierte Schneider aus aller Welt und lass dir deinen Traumanzug maßschneidern.",
    images: ["/og-image.png"],
    creator: "@tailormarket",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
