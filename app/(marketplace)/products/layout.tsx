import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maßgeschneiderte Produkte entdecken",
  description:
    "Durchsuche unsere Auswahl an maßgeschneiderten Produkten von talentierten Schneidern aus aller Welt. Anzüge, Hemden, Hosen und mehr - individuell für dich gefertigt.",
  keywords: [
    "maßgeschneiderte Produkte",
    "Maßanzüge",
    "custom Hemden",
    "Schneider Produkte",
    "handgefertigte Kleidung",
  ],
  openGraph: {
    title: "Maßgeschneiderte Produkte entdecken | TailorMarket",
    description:
      "Durchsuche unsere Auswahl an maßgeschneiderten Produkten von talentierten Schneidern aus aller Welt.",
    url: "/products",
    type: "website",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
