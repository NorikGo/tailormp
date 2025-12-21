import LoginForm from "@/app/components/forms/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anmelden",
  description:
    "Melden Sie sich bei TailorMarket an, um maßgeschneiderte Kleidung zu bestellen oder als Schneider Ihre Produkte anzubieten.",
  robots: {
    index: false, // Login pages should not be indexed
    follow: true,
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <LoginForm />
    </div>
  );
}
