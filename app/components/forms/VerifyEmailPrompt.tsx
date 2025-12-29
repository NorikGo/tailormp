"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/app/lib/supabaseClient";
import { useAuth } from "@/app/contexts/AuthContext";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";

export default function VerifyEmailPrompt() {
  const router = useRouter();
  const { user } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Check if email is already verified
    const checkVerification = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser?.email_confirmed_at) {
        setIsVerified(true);
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    };

    checkVerification();

    // Listen for auth changes (when user clicks verification link)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user?.email_confirmed_at) {
          setIsVerified(true);
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleResendEmail = async () => {
    try {
      setIsResending(true);
      setResendError(null);
      setResendSuccess(false);

      // Get current user email
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser?.email) {
        throw new Error("Keine E-Mail-Adresse gefunden");
      }

      // Resend verification email
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: authUser.email,
      });

      if (error) throw error;

      setResendSuccess(true);
    } catch (err: any) {
      setResendError(
        err.message || "Fehler beim Senden der E-Mail. Bitte versuche es später erneut."
      );
    } finally {
      setIsResending(false);
    }
  };

  // If already verified
  if (isVerified) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              E-Mail bestätigt!
            </h2>
            <p className="text-slate-600 mb-6">
              Deine E-Mail-Adresse wurde erfolgreich bestätigt. Du wirst
              weitergeleitet...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Verification pending
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Bestätige deine E-Mail
          </h2>
          <p className="text-slate-600 mb-4">
            Wir haben dir eine E-Mail an{" "}
            <span className="font-medium">{user?.email}</span> gesendet.
          </p>
          <p className="text-sm text-slate-500 mb-6">
            Bitte klicke auf den Link in der E-Mail, um deine Registrierung
            abzuschließen. Überprüfe auch deinen Spam-Ordner.
          </p>

          {resendSuccess && (
            <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
              E-Mail wurde erfolgreich erneut versendet!
            </div>
          )}

          {resendError && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{resendError}</span>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleResendEmail}
              disabled={isResending || resendSuccess}
              variant="outline"
              className="w-full"
            >
              {isResending ? "Wird gesendet..." : "E-Mail erneut senden"}
            </Button>

            <Button
              onClick={() => router.push("/dashboard")}
              variant="ghost"
              className="w-full"
            >
              Zum Dashboard
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              Du kannst dich bereits anmelden, aber einige Funktionen (wie
              Bestellungen) sind erst nach der E-Mail-Bestätigung verfügbar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
