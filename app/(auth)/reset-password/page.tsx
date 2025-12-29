import ResetPasswordForm from "@/app/components/forms/ResetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Passwort zurücksetzen - TailorMarket",
  description: "Neues Passwort festlegen",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <ResetPasswordForm />
    </div>
  );
}
