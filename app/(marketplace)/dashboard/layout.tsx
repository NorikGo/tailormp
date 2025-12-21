import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mein Dashboard",
  description:
    "Ihr persönliches Dashboard bei TailorMarket. Verwalten Sie Ihre Bestellungen, Maße und Profileinstellungen.",
  robots: {
    index: false, // Private dashboards should not be indexed
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
