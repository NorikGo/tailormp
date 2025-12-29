import VerifyEmailPrompt from "@/app/components/forms/VerifyEmailPrompt";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "E-Mail bestätigen - TailorMarket",
  description: "Bestätige deine E-Mail-Adresse",
  robots: {
    index: false,
    follow: true,
  },
};

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <VerifyEmailPrompt />
    </div>
  );
}
