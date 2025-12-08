"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Star, MapPin, Award, Languages, Briefcase, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tailor } from "@/app/types/tailor";
import { dummyTailors } from "@/app/lib/dummyData";

interface TailorProfileData {
  tailor: Tailor;
  products: any[];
}

export default function TailorProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<TailorProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTailor = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/tailors/${id}`);

        if (!response.ok) {
          // Fallback to dummy data if API fails or returns 404
          const dummyTailor = dummyTailors.find((t) => t.id === id);
          if (dummyTailor) {
            setData({ tailor: dummyTailor, products: [] });
          } else {
            throw new Error("Schneider nicht gefunden");
          }
        } else {
          const result = await response.json();
          setData(result);
        }
      } catch (err: any) {
        // console.error("Fetch tailor error:", err);
        setError(err.message || "Fehler beim Laden des Profils");
      } finally {
        setLoading(false);
      }
    };

    fetchTailor();
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
            {error || "Schneider nicht gefunden"}
          </p>
        </div>
      </div>
    );
  }

  const { tailor, products } = data;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
              <span className="text-4xl md:text-5xl font-bold text-slate-600">
                {tailor.name.charAt(0)}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                  {tailor.name}
                </h1>
                {tailor.isVerified && (
                  <Award className="w-6 h-6 text-blue-600" />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-4 text-slate-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{tailor.country}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{tailor.rating.toFixed(1)}</span>
                  <span className="text-sm">({tailor.totalOrders} Bestellungen)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  <span>{tailor.yearsExperience} Jahre Erfahrung</span>
                </div>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2 mb-4">
                {tailor.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>

              {/* Languages */}
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Languages className="w-4 h-4" />
                <span>{tailor.languages.join(", ")}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="about" className="mb-8">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="about">Über mich</TabsTrigger>
          <TabsTrigger value="products">
            Produkte ({products.length})
          </TabsTrigger>
          <TabsTrigger value="reviews">Bewertungen</TabsTrigger>
        </TabsList>

        {/* About Tab */}
        <TabsContent value="about" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Über {tailor.name}
              </h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {tailor.bio}
              </p>

              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Spezialisierungen
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tailor.specialties.map((specialty) => (
                    <div
                      key={specialty}
                      className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                      <span className="font-medium text-slate-900">
                        {specialty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="mt-6">
          <Card>
            <CardContent className="p-6">
              {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-slate-900 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-2">
                        {product.description}
                      </p>
                      <p className="text-lg font-bold text-slate-900">
                        €{product.price}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-600">
                  <p>Noch keine Produkte vorhanden.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12 text-slate-600">
                <p>Bewertungen kommen bald...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Contact CTA */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Interessiert an einer Zusammenarbeit?
              </h3>
              <p className="text-slate-600">
                Kontaktiere {tailor.name} für dein maßgeschneidertes Projekt.
              </p>
            </div>
            <Button size="lg">Nachricht senden</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
