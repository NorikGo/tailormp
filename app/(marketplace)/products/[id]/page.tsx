"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  Star,
  MapPin,
  Award,
  Briefcase,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/app/types/product";
import { dummyProducts, dummyTailors } from "@/app/lib/dummyData";

interface ProductData {
  product: Product & {
    tailor?: {
      id: string;
      name: string;
      country: string;
      rating: number;
      isVerified: boolean;
      yearsExperience?: number;
      totalOrders?: number;
    };
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/products/${id}`);

        if (!response.ok) {
          // Fallback to dummy data if API fails or returns 404
          const dummyProduct = dummyProducts.find((p) => p.id === id);
          if (dummyProduct) {
            const tailor = dummyTailors.find(
              (t) => t.id === dummyProduct.tailorId
            );
            setData({
              product: {
                ...dummyProduct,
                tailor: tailor
                  ? {
                      id: tailor.id,
                      name: tailor.name,
                      country: tailor.country,
                      rating: tailor.rating,
                      isVerified: tailor.isVerified,
                      yearsExperience: tailor.yearsExperience,
                      totalOrders: tailor.totalOrders,
                    }
                  : undefined,
              },
            });
          } else {
            throw new Error("Produkt nicht gefunden");
          }
        } else {
          const result = await response.json();
          setData(result);
        }
      } catch (err: any) {
        console.error("Fetch product error:", err);
        setError(err.message || "Fehler beim Laden des Produkts");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center max-w-md mx-auto">
          <p className="text-red-600 font-medium">
            {error || "Produkt nicht gefunden"}
          </p>
          <Link href="/products">
            <Button variant="outline" className="mt-4">
              Zurück zu Produkten
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { product } = data;
  const tailor = product.tailor;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Left Column - Image */}
        <div>
          <div className="relative w-full aspect-[4/3] bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
            {product.featured && (
              <Badge className="absolute top-4 right-4 bg-yellow-500 text-white hover:bg-yellow-600">
                Featured
              </Badge>
            )}
            <ShoppingBag className="w-32 h-32 text-slate-300" />
          </div>
        </div>

        {/* Right Column - Details */}
        <div>
          {/* Category Badge */}
          <Badge variant="secondary" className="mb-4">
            {product.category}
          </Badge>

          {/* Product Title */}
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            {product.name}
          </h1>

          {/* Tailor Info */}
          {tailor && (
            <Link href={`/tailors/${tailor.id}`}>
              <Card className="mb-6 hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-slate-600">
                        {tailor.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-900 truncate">
                          {tailor.name}
                        </p>
                        {tailor.isVerified && (
                          <Award className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{tailor.country}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{tailor.rating.toFixed(1)}</span>
                        </div>
                        {tailor.yearsExperience && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            <span>{tailor.yearsExperience} Jahre</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}

          {/* Price */}
          <div className="mb-6">
            <div className="text-4xl font-bold text-slate-900">
              €{product.price}
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Inkl. MwSt., zzgl. Versand
            </p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Beschreibung
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="flex-1">
              Jetzt bestellen
            </Button>
            <Button size="lg" variant="outline" className="flex-1">
              Schneider kontaktieren
            </Button>
          </div>

          {/* Info Note */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Hinweis:</strong> Dieses Produkt wird maßgeschneidert
              angefertigt. Nach der Bestellung werden wir deine Maße abfragen.
            </p>
          </div>
        </div>
      </div>

      {/* Additional Information Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Details */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Produktdetails
            </h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-slate-600">Kategorie:</dt>
                <dd className="font-medium text-slate-900">
                  {product.category}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">Preis:</dt>
                <dd className="font-medium text-slate-900">€{product.price}</dd>
              </div>
              {product.featured && (
                <div className="flex justify-between">
                  <dt className="text-slate-600">Status:</dt>
                  <dd>
                    <Badge className="bg-yellow-500">Featured</Badge>
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        {/* Measurements Placeholder */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Benötigte Maße
            </h3>
            <p className="text-slate-600 mb-4">
              Für die Anfertigung dieses Produkts benötigen wir folgende Maße:
            </p>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
                <span>Schulterbreite</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
                <span>Brustumfang</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
                <span>Taillenumfang</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
                <span>Ärmellänge</span>
              </li>
            </ul>
            <p className="text-sm text-slate-500 mt-4">
              Eine detaillierte Messanleitung erhältst du nach der Bestellung.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
