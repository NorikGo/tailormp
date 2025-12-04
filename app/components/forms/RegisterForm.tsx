"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { registerSchema, type RegisterInput } from "@/app/lib/validations";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "customer",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registrierung fehlgeschlagen");
      }

      setSuccess(true);
    } catch (err: any) {
      console.error("Register error:", err);
      setError(err.message || "Registrierung fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="p-6 text-center bg-green-50 border border-green-200 rounded-lg">
          <h2 className="text-2xl font-bold text-green-900 mb-2">
            Registrierung erfolgreich!
          </h2>
          <p className="text-green-700 mb-4">
            Bitte bestätige deine E-Mail-Adresse über den Link, den wir dir gesendet haben.
          </p>
          <p className="text-green-700 mb-4">
            Nach der Bestätigung kannst du dich anmelden.
          </p>
          <Link href="/login">
            <Button className="w-full">
              Zur Anmeldung
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Konto erstellen</h1>
        <p className="text-slate-600">Werde Teil von TailorMarket</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-Mail</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="deine@email.com"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passwort</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Mindestens 8 Zeichen
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ich bin...</FormLabel>
                <FormControl>
                  <div className="flex gap-4">
                    <label className="flex-1">
                      <input
                        type="radio"
                        value="customer"
                        checked={field.value === "customer"}
                        onChange={field.onChange}
                        disabled={isLoading}
                        className="sr-only peer"
                      />
                      <div className="p-4 text-center border-2 border-slate-200 rounded-lg cursor-pointer transition-all peer-checked:border-slate-900 peer-checked:bg-slate-50 hover:border-slate-300">
                        <div className="font-semibold text-slate-900">Kunde</div>
                        <div className="text-sm text-slate-600 mt-1">
                          Ich suche einen Schneider
                        </div>
                      </div>
                    </label>

                    <label className="flex-1">
                      <input
                        type="radio"
                        value="tailor"
                        checked={field.value === "tailor"}
                        onChange={field.onChange}
                        disabled={isLoading}
                        className="sr-only peer"
                      />
                      <div className="p-4 text-center border-2 border-slate-200 rounded-lg cursor-pointer transition-all peer-checked:border-slate-900 peer-checked:bg-slate-50 hover:border-slate-300">
                        <div className="font-semibold text-slate-900">Schneider</div>
                        <div className="text-sm text-slate-600 mt-1">
                          Ich biete meine Dienste an
                        </div>
                      </div>
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Registrieren..." : "Registrieren"}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center text-sm">
        <p className="text-slate-600">
          Bereits registriert?{" "}
          <Link href="/login" className="text-slate-900 font-medium hover:underline">
            Jetzt anmelden
          </Link>
        </p>
      </div>
    </div>
  );
}
