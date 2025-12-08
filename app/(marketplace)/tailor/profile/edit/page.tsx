"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { tailorProfileSchema, type TailorProfileInput } from "@/app/lib/validations";
import { getSimpleAuthHeaders } from "@/app/lib/auth/client-helpers";
import ImageUpload from "@/components/shared/ImageUpload";

export default function TailorProfileEditPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TailorProfileInput>({
    resolver: zodResolver(tailorProfileSchema),
  });

  const specialtiesInput = watch("specialties");
  const languagesInput = watch("languages");

  // Fetch existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const authHeaders = await getSimpleAuthHeaders();
        const response = await fetch("/api/tailor/profile", {
          headers: {
            ...authHeaders,
            "x-user-role": "tailor",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const tailor = data.tailor;

          // Pre-fill form
          setValue("name", tailor.name || "");
          setValue("businessName", tailor.businessName || "");
          setValue("bio", tailor.bio || "");
          setValue("country", tailor.country || "");
          setValue("city", tailor.city || "");
          setValue("location", tailor.location || "");
          setValue("specialties", tailor.specialties || []);
          setValue("languages", tailor.languages || []);
          setValue("yearsExperience", tailor.yearsExperience || undefined);
          setValue("phone", tailor.phone || "");
          setValue("website", tailor.website || "");
          setPortfolioImages(tailor.portfolioImages || []);
        }
      } catch (err: any) {
        // console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setValue]);

  const onSubmit = async (data: TailorProfileInput) => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      const authHeaders = await getSimpleAuthHeaders();
      const response = await fetch("/api/tailor/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
          "x-user-role": "tailor",
        },
        body: JSON.stringify({
          ...data,
          portfolioImages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler beim Speichern");
      }

      const result = await response.json();
      setSuccessMessage(result.message || "Profil erfolgreich gespeichert!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
        router.push("/tailor/orders"); // Redirect to dashboard
      }, 2000);
    } catch (err: any) {
      // console.error("Error updating profile:", err);
      setError(err.message || "Ein Fehler ist aufgetreten");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/tailor/orders">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zum Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Profil bearbeiten
          </h1>
          <p className="text-slate-600">
            Vervollständige dein Profil, um mehr Kunden zu erreichen
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Grundinformationen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Max Mustermann"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="businessName">Geschäftsname (optional)</Label>
                    <Input
                      id="businessName"
                      {...register("businessName")}
                      placeholder="Maßschneiderei Mustermann"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Über mich</Label>
                  <Textarea
                    id="bio"
                    {...register("bio")}
                    placeholder="Beschreibe deine Erfahrung und Spezialisierung..."
                    rows={4}
                  />
                  {errors.bio && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.bio.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Standort</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">Land</Label>
                    <Input
                      id="country"
                      {...register("country")}
                      placeholder="Deutschland"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">Stadt</Label>
                    <Input
                      id="city"
                      {...register("city")}
                      placeholder="Berlin"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Vollständige Adresse (optional)</Label>
                  <Input
                    id="location"
                    {...register("location")}
                    placeholder="Musterstraße 123, 12345 Berlin"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills & Experience */}
            <Card>
              <CardHeader>
                <CardTitle>Fähigkeiten & Erfahrung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="specialties">
                    Spezialisierungen (kommagetrennt)
                  </Label>
                  <Input
                    id="specialties"
                    placeholder="Anzüge, Kleider, Änderungen"
                    onChange={(e) => {
                      const value = e.target.value;
                      const arr = value ? value.split(",").map((s) => s.trim()) : [];
                      setValue("specialties", arr);
                    }}
                    defaultValue={specialtiesInput?.join(", ") || ""}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Beispiel: Anzüge, Kleider, Hemden, Hosen, Änderungen
                  </p>
                </div>

                <div>
                  <Label htmlFor="languages">Sprachen (kommagetrennt)</Label>
                  <Input
                    id="languages"
                    placeholder="Deutsch, Englisch, Türkisch"
                    onChange={(e) => {
                      const value = e.target.value;
                      const arr = value ? value.split(",").map((s) => s.trim()) : [];
                      setValue("languages", arr);
                    }}
                    defaultValue={languagesInput?.join(", ") || ""}
                  />
                </div>

                <div>
                  <Label htmlFor="yearsExperience">Jahre Erfahrung</Label>
                  <Input
                    id="yearsExperience"
                    type="number"
                    {...register("yearsExperience", { valueAsNumber: true })}
                    placeholder="10"
                  />
                  {errors.yearsExperience && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.yearsExperience.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Kontaktinformationen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    placeholder="+49 123 456789"
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    {...register("website")}
                    placeholder="https://example.com"
                  />
                  {errors.website && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.website.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  bucket="portfolios"
                  currentImages={portfolioImages}
                  maxImages={10}
                  onUploadComplete={setPortfolioImages}
                />
                <p className="text-sm text-slate-500 mt-2">
                  Zeige deine besten Arbeiten. Max. 10 Bilder.
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="flex-1 sm:flex-initial"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Speichern...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Profil speichern
                  </>
                )}
              </Button>

              <Link href="/tailor/orders">
                <Button variant="outline" size="lg" type="button">
                  Abbrechen
                </Button>
              </Link>
            </div>

            {/* Success/Error Messages */}
            {successMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded text-green-600">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600">
                {error}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
