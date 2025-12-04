"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/tailor/ImageUpload";
import { productSchema, type ProductInput } from "@/app/lib/validations";
import { getSimpleAuthHeaders } from "@/app/lib/auth/client-helpers";

interface ProductImage {
  id: string;
  url: string;
  position: number;
}

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string | null;
  images: ProductImage[];
}

export default function ProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [newImages, setNewImages] = useState<
    { url: string; fileName: string }[]
  >([]);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const authHeaders = await getSimpleAuthHeaders();
      const response = await fetch(`/api/tailor/products/${productId}`, {
        headers: {
          ...authHeaders,
          "x-user-role": "tailor",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const prod = data.product;
        setProduct(prod);
        setImages(prod.images);

        // Pre-fill form
        setValue("title", prod.title);
        setValue("description", prod.description || "");
        setValue("price", prod.price);
        setValue("category", prod.category || "");
      } else {
        throw new Error("Produkt nicht gefunden");
      }
    } catch (err: any) {
      console.error("Error fetching product:", err);
      setError(err.message || "Ein Fehler ist aufgetreten");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProductInput) => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      const authHeaders = await getSimpleAuthHeaders();
      const response = await fetch(`/api/tailor/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
          "x-user-role": "tailor",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler beim Aktualisieren");
      }

      const result = await response.json();
      setSuccessMessage(result.message || "Produkt erfolgreich aktualisiert!");

      // Redirect back to product management
      setTimeout(() => {
        router.push("/tailor/products");
      }, 1500);
    } catch (err: any) {
      console.error("Error updating product:", err);
      setError(err.message || "Ein Fehler ist aufgetreten");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = (url: string, fileName: string) => {
    setNewImages((prev) => [...prev, { url, fileName }]);
  };

  const handleImageError = (error: string) => {
    setError(error);
  };

  const handleDeleteImage = async (imageId: string, fileName: string) => {
    if (!confirm("Möchtest du dieses Bild wirklich löschen?")) {
      return;
    }

    try {
      setDeletingImageId(imageId);

      const authHeaders = await getSimpleAuthHeaders();
      const response = await fetch("/api/upload/product-image", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
          "x-user-role": "tailor",
        },
        body: JSON.stringify({
          fileName: fileName.split("/").pop(), // Extract filename from URL
          productImageId: imageId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler beim Löschen");
      }

      // Remove from local state
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err: any) {
      console.error("Error deleting image:", err);
      alert(err.message || "Fehler beim Löschen des Bildes");
    } finally {
      setDeletingImageId(null);
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

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Produkt nicht gefunden
          </h2>
          <Link href="/tailor/products">
            <Button>Zurück zur Produktliste</Button>
          </Link>
        </div>
      </div>
    );
  }

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
            Produkt bearbeiten
          </h1>
          <p className="text-slate-600">Aktualisiere dein Produkt</p>
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
              <CardContent className="space-y-4">
                {/* Existing Images */}
                {images.length > 0 && (
                  <div>
                    <Label className="mb-2 block">Vorhandene Bilder</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.url}
                            alt="Product"
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteImage(image.id, image.url)}
                            disabled={deletingImageId === image.id}
                          >
                            {deletingImageId === image.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {image.position === 0
                              ? "Hauptbild"
                              : `Bild ${image.position + 1}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload New Images */}
                {images.length + newImages.length < 5 && (
                  <div>
                    <Label className="mb-2 block">Neue Bilder hochladen</Label>
                    <ImageUpload
                      onUploadSuccess={handleImageUpload}
                      onUploadError={handleImageError}
                      productId={productId}
                      position={images.length + newImages.length}
                      maxSize={5}
                    />
                  </div>
                )}

                <p className="text-xs text-slate-500">
                  {images.length + newImages.length}/5 Bilder
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
                    Wird gespeichert...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Änderungen speichern
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
