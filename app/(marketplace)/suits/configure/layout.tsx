import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anzug konfigurieren – TailorMarket | Maßanzug nach deinen Wünschen",
  description: "Konfiguriere deinen Maßanzug aus Vietnam. Wähle Modell, Stoff, gib deine Maße an und lass dir deinen perfekten Anzug fertigen. 550-750€.",
  keywords: [
    "Anzug konfigurieren",
    "Maßanzug erstellen",
    "Custom Suit",
    "Anzug Konfigurator",
    "Maßanzug online",
    "Suit Builder"
  ],
  openGraph: {
    title: "Anzug konfigurieren – TailorMarket",
    description: "Konfiguriere deinen perfekten Maßanzug aus Vietnam in 5 einfachen Schritten.",
    url: "/suits/configure",
  },
};

export default function ConfigureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
