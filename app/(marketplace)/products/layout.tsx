import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maßanzüge entdecken – TailorMarket | Premium Anzüge aus Vietnam",
  description:
    "Entdecke hochwertige Maßanzüge von erfahrenen Schneidern aus Vietnam. Handgefertigt, fair produziert, 50-70% günstiger als in Deutschland. 550-750€.",
  keywords: [
    "Maßanzüge kaufen",
    "Anzug Vietnam",
    "Premium Anzüge",
    "Maßanzug online",
    "Custom Suits",
    "Handgefertigte Anzüge",
    "Fair Trade Anzüge"
  ],
  openGraph: {
    title: "Maßanzüge entdecken – TailorMarket",
    description:
      "Hochwertige Maßanzüge aus Vietnam. Handgefertigt. Fair produziert. 550-750€.",
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
