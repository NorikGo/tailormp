import RegisterForm from "@/app/components/forms/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrieren",
  description:
    "Erstellen Sie ein kostenloses Konto bei TailorMarket. Für Kunden: Maßgeschneiderte Kleidung bestellen. Für Schneider: Ihre Produkte weltweit anbieten.",
  robots: {
    index: false, // Registration pages should not be indexed
    follow: true,
  },
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <RegisterForm />
    </div>
  );
}
