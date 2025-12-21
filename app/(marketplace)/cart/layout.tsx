import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warenkorb",
  description:
    "Ihr Warenkorb bei TailorMarket. Überprüfen Sie Ihre ausgewählten maßgeschneiderten Produkte und schließen Sie Ihre Bestellung ab.",
  robots: {
    index: false, // Cart pages should not be indexed
    follow: true,
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
