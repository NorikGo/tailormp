import ForgotPasswordForm from "@/app/components/forms/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Passwort vergessen - TailorMarket",
  description: "Passwort zurücksetzen für TailorMarket",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <ForgotPasswordForm />
    </div>
  );
}
