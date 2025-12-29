import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unsere Schneider – TailorMarket | Erfahrene Schneider aus Vietnam",
  description:
    "Lerne unsere 12 erfahrenen Schneider aus Vietnam kennen. Alle Partner haben 10+ Jahre Erfahrung und fertigen für internationale Luxusmarken wie Hugo Boss und Armani. Fair bezahlt mit 60% des Verkaufspreises.",
  keywords: [
    "Schneider Vietnam",
    "Hoi An Schneider",
    "Maßschneider Vietnam",
    "Tailor Vietnam",
    "Fair Trade Schneider",
    "Handwerk Vietnam",
    "Schneider Ho Chi Minh City",
    "Schneider Hanoi"
  ],
  openGraph: {
    title: "Unsere Schneider – TailorMarket",
    description:
      "12 erfahrene Schneider aus Vietnam. Fair bezahlt. 10+ Jahre Erfahrung.",
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
