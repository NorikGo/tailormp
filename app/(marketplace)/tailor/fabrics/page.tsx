"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Check, X, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/app/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Fabric {
  id: string;
  name: string;
  description: string | null;
  material: string;
  weight: string | null;
  pattern: string | null;
  color: string;
  season: string | null;
  imageUrl: string | null;
  priceCategory: string;
  priceAdd: number;
  tailorFabric: {
    id: string;
    isAvailable: boolean;
    stockQuantity: number | null;
    customPriceAdd: number | null;
  } | null;
}

export default function TailorFabricsPage() {
  const { user, isTailor } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !isTailor) {
      return;
    }
    fetchFabrics();
  }, [user, isTailor]);

  const fetchFabrics = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tailor/fabrics");

      if (!response.ok) {
        throw new Error("Fehler beim Laden der Stoffe");
      }

      const data = await response.json();
      setFabrics(data.fabrics || []);
    } catch (error) {
      console.error("Error fetching fabrics:", error);
      toast({
        title: "Fehler",
        description: "Stoffe konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFabric = async (fabricId: string, currentStatus: boolean) => {
    setUpdatingId(fabricId);
    try {
      const response = await fetch("/api/tailor/fabrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fabricId,
          isAvailable: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Aktualisieren");
      }

      // Refresh fabrics
      await fetchFabrics();

      toast({
        title: "Erfolgreich",
        description: currentStatus
          ? "Stoff wurde deaktiviert"
          : "Stoff wurde aktiviert",
      });
    } catch (error) {
      console.error("Error toggling fabric:", error);
      toast({
        title: "Fehler",
        description: "Stoff konnte nicht aktualisiert werden",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveFabric = async (tailorFabricId: string) => {
    if (!confirm("Möchtest du diesen Stoff aus deinem Angebot entfernen?")) {
      return;
    }

    setUpdatingId(tailorFabricId);
    try {
      const response = await fetch(`/api/tailor/fabrics/${tailorFabricId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Fehler beim Entfernen");
      }

      await fetchFabrics();

      toast({
        title: "Erfolgreich",
        description: "Stoff wurde aus deinem Angebot entfernt",
      });
    } catch (error) {
      console.error("Error removing fabric:", error);
      toast({
        title: "Fehler",
        description: "Stoff konnte nicht entfernt werden",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddFabric = async (fabricId: string) => {
    setUpdatingId(fabricId);
    try {
      const response = await fetch("/api/tailor/fabrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fabricId,
          isAvailable: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Hinzufügen");
      }

      await fetchFabrics();

      toast({
        title: "Erfolgreich",
        description: "Stoff wurde zu deinem Angebot hinzugefügt",
      });
    } catch (error) {
      console.error("Error adding fabric:", error);
      toast({
        title: "Fehler",
        description: "Stoff konnte nicht hinzugefügt werden",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const getPriceCategoryBadge = (category: string) => {
    switch (category) {
      case "standard":
        return <Badge variant="secondary">Standard</Badge>;
      case "premium":
        return <Badge className="bg-blue-600">Premium</Badge>;
      case "luxury":
        return <Badge className="bg-purple-600">Luxury</Badge>;
      default:
        return <Badge>{category}</Badge>;
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

  if (!user || !isTailor) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Zugriff verweigert
          </h1>
          <p className="text-slate-600 mb-8">
            Sie haben keinen Zugriff auf diese Seite.
          </p>
          <Button onClick={() => router.push("/")}>Zur Startseite</Button>
        </div>
      </div>
    );
  }

  const availableFabrics = fabrics.filter((f) => f.tailorFabric !== null);
  const unavailableFabrics = fabrics.filter((f) => f.tailorFabric === null);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Meine verfügbaren Stoffe
          </h1>
          <p className="text-slate-600">
            Wähle aus, welche Stoffe du für die Anfertigung von Anzügen verwenden kannst
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Verfügbare Stoffe</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {availableFabrics.length}
                  </p>
                </div>
                <Package className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Gesamt in Bibliothek</p>
                  <p className="text-2xl font-bold text-slate-900">{fabrics.length}</p>
                </div>
                <Package className="w-8 h-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Nicht ausgewählt</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {unavailableFabrics.length}
                  </p>
                </div>
                <Package className="w-8 h-8 text-slate-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Fabrics */}
        {availableFabrics.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Deine verfügbaren Stoffe ({availableFabrics.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableFabrics.map((fabric) => (
                <Card key={fabric.id} className="overflow-hidden">
                  {/* Fabric Image */}
                  <div className="relative h-32 bg-slate-100">
                    {fabric.imageUrl ? (
                      <img
                        src={fabric.imageUrl}
                        alt={fabric.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-slate-300" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      {fabric.tailorFabric?.isAvailable ? (
                        <Badge className="bg-green-600">
                          <Check className="w-3 h-3 mr-1" />
                          Verfügbar
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <X className="w-3 h-3 mr-1" />
                          Inaktiv
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base line-clamp-1">
                        {fabric.name}
                      </CardTitle>
                      {getPriceCategoryBadge(fabric.priceCategory)}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="text-sm text-slate-600 space-y-1">
                      <p>
                        <span className="font-medium">Material:</span> {fabric.material}
                      </p>
                      {fabric.weight && (
                        <p>
                          <span className="font-medium">Gewicht:</span> {fabric.weight}
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Farbe:</span> {fabric.color}
                      </p>
                      {fabric.pattern && (
                        <p>
                          <span className="font-medium">Muster:</span> {fabric.pattern}
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Aufpreis:</span> +€
                        {fabric.priceAdd.toFixed(2)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={fabric.tailorFabric?.isAvailable ?? false}
                          onCheckedChange={() =>
                            handleToggleFabric(
                              fabric.id,
                              fabric.tailorFabric?.isAvailable ?? false
                            )
                          }
                          disabled={updatingId === fabric.id}
                        />
                        <Label className="text-sm">
                          {fabric.tailorFabric?.isAvailable ? "Aktiv" : "Inaktiv"}
                        </Label>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          fabric.tailorFabric &&
                          handleRemoveFabric(fabric.tailorFabric.id)
                        }
                        disabled={updatingId === fabric.id || !fabric.tailorFabric}
                      >
                        {updatingId === fabric.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Entfernen"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available to Add */}
        {unavailableFabrics.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Weitere Stoffe hinzufügen ({unavailableFabrics.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unavailableFabrics.map((fabric) => (
                <Card key={fabric.id} className="overflow-hidden opacity-75 hover:opacity-100 transition-opacity">
                  {/* Fabric Image */}
                  <div className="relative h-32 bg-slate-100">
                    {fabric.imageUrl ? (
                      <img
                        src={fabric.imageUrl}
                        alt={fabric.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-slate-300" />
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base line-clamp-1">
                        {fabric.name}
                      </CardTitle>
                      {getPriceCategoryBadge(fabric.priceCategory)}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="text-sm text-slate-600 space-y-1">
                      <p>
                        <span className="font-medium">Material:</span> {fabric.material}
                      </p>
                      {fabric.weight && (
                        <p>
                          <span className="font-medium">Gewicht:</span> {fabric.weight}
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Farbe:</span> {fabric.color}
                      </p>
                      {fabric.pattern && (
                        <p>
                          <span className="font-medium">Muster:</span> {fabric.pattern}
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Aufpreis:</span> +€
                        {fabric.priceAdd.toFixed(2)}
                      </p>
                    </div>

                    {/* Add Button */}
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => handleAddFabric(fabric.id)}
                      disabled={updatingId === fabric.id}
                    >
                      {updatingId === fabric.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Wird hinzugefügt...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Hinzufügen
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {availableFabrics.length === 0 && unavailableFabrics.length === 0 && (
          <Card>
            <CardContent className="py-16">
              <div className="text-center">
                <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Keine Stoffe verfügbar
                </h3>
                <p className="text-slate-600">
                  Es sind noch keine Stoffe in der Bibliothek vorhanden.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
