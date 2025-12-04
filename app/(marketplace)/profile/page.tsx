"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Redirect tailors to their profile edit page
  useEffect(() => {
    if (user?.role === "tailor") {
      router.push("/tailor/profile/edit");
    }
  }, [user, router]);

  const [emailData, setEmailData] = useState({
    newEmail: "",
    password: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/user/email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Email-Änderung fehlgeschlagen");
      }

      setMessage({ type: "success", text: "Email erfolgreich geändert. Bitte bestätige deine neue Email-Adresse." });
      setEmailData({ newEmail: "", password: "" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Ein Fehler ist aufgetreten",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Passwörter stimmen nicht überein" });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({ type: "error", text: "Passwort muss mindestens 8 Zeichen lang sein" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Passwort-Änderung fehlgeschlagen");
      }

      setMessage({ type: "success", text: "Passwort erfolgreich geändert" });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Ein Fehler ist aufgetreten",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Möchten Sie Ihr Konto wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.")) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/user/account", {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Account-Löschung fehlgeschlagen");
      }

      // Logout and redirect
      router.push("/");
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Ein Fehler ist aufgetreten",
      });
    } finally {
      setLoading(false);
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted || authLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Don't render content for tailors (they'll be redirected)
  if (user.role === "tailor") {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Mein Profil</h1>

      {message && (
        <Alert className={`mb-6 ${message.type === "error" ? "border-red-500 text-red-900" : "border-green-500 text-green-900"}`}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* Current Email Display */}
        <Card>
          <CardHeader>
            <CardTitle>Account-Informationen</CardTitle>
            <CardDescription>Ihre aktuellen Account-Details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Email-Adresse</Label>
              <Input value={user.email} disabled className="bg-slate-50" />
            </div>
          </CardContent>
        </Card>

        {/* Email Change Form */}
        <Card>
          <CardHeader>
            <CardTitle>Email-Adresse ändern</CardTitle>
            <CardDescription>Ändern Sie Ihre Email-Adresse. Sie erhalten eine Bestätigungs-Email.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newEmail">Neue Email-Adresse</Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={emailData.newEmail}
                  onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailPassword">Aktuelles Passwort (zur Bestätigung)</Label>
                <Input
                  id="emailPassword"
                  type="password"
                  value={emailData.password}
                  onChange={(e) => setEmailData({ ...emailData, password: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird geändert...
                  </>
                ) : (
                  "Email ändern"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Change Form */}
        <Card>
          <CardHeader>
            <CardTitle>Passwort ändern</CardTitle>
            <CardDescription>Ändern Sie Ihr Passwort. Mindestens 8 Zeichen erforderlich.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Neues Passwort</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  disabled={loading}
                  minLength={8}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Neues Passwort bestätigen</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                  disabled={loading}
                  minLength={8}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird geändert...
                  </>
                ) : (
                  "Passwort ändern"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Delete Account */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Gefahrenzone</CardTitle>
            <CardDescription>Irreversible Account-Aktionen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Das Löschen Ihres Accounts ist permanent und kann nicht rückgängig gemacht werden. Alle Ihre Daten werden gelöscht.
              </p>
              <Button variant="destructive" onClick={handleDeleteAccount} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird gelöscht...
                  </>
                ) : (
                  "Account löschen"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
