"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/shared/ImageUpload";
import { productSchema, type ProductInput } from "@/app/lib/validations";
import { getSimpleAuthHeaders } from "@/app/lib/auth/client-helpers";

export default function ProductCreatePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [productImages, setProductImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductInput) => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      const authHeaders = await getSimpleAuthHeaders();
      const response = await fetch("/api/tailor/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
          "x-user-role": "tailor",
        },
        body: JSON.stringify({
          ...data,
          imageUrls: productImages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler beim Erstellen");
      }

      const result = await response.json();
      setSuccessMessage(result.message || "Produkt erfolgreich erstellt!");

      // Redirect to product management page
      setTimeout(() => {
        router.push("/tailor/products");
      }, 1500);
    } catch (err: any) {
      // console.error("Error creating product:", err);
      setError(err.message || "Ein Fehler ist aufgetreten");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/tailor/products">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zur Produktliste
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Neues Produkt erstellen
          </h1>
          <p className="text-slate-600">
            Füge ein neues Produkt zu deinem Portfolio hinzu
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
                <div>
                  <Label htmlFor="title">Produktname *</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="z.B. Maßgeschneiderter Anzug"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Beschreibung</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Beschreibe dein Produkt im Detail..."
                    rows={6}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="category">Kategorie</Label>
                  <Input
                    id="category"
                    {...register("category")}
                    placeholder="z.B. Anzüge, Kleider, Hemden"
                  />
                  {errors.category && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Preisgestaltung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="price">Preis (EUR) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register("price", { valueAsNumber: true })}
                    placeholder="299.00"
                  />
                  {errors.price && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.price.message}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    Die Plattform behält 10% Provision ein
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Produktbilder</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  bucket="products"
                  currentImages={productImages}
                  maxImages={5}
                  onUploadComplete={setProductImages}
                />
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
                    Wird erstellt...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Produkt erstellen
                  </>
                )}
              </Button>

              <Link href="/tailor/products">
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
