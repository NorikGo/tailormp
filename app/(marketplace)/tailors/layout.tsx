import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schneider weltweit entdecken",
  description:
    "Finde talentierte Schneider aus aller Welt. Verifizierte Handwerker mit jahrelanger Erfahrung in Maßanfertigung. Von Vietnam über Thailand bis Indien - entdecke die besten Schneider.",
  keywords: [
    "Schneider finden",
    "Maßschneider weltweit",
    "verifizierte Schneider",
    "Schneider Vietnam",
    "Schneider Thailand",
    "Schneider Indien",
  ],
  openGraph: {
    title: "Schneider weltweit entdecken | TailorMarket",
    description:
      "Finde talentierte Schneider aus aller Welt. Verifizierte Handwerker mit jahrelanger Erfahrung.",
    url: "/tailors",
    type: "website",
  },
};

export default function TailorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
