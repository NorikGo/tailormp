"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Eye, Loader2, Package, BarChart3, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSimpleAuthHeaders } from "@/app/lib/auth/client-helpers";

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string | null;
  createdAt: string;
  images: {
    id: string;
    url: string;
    position: number;
  }[];
}

export default function ProductManagementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const authHeaders = await getSimpleAuthHeaders();
      const response = await fetch("/api/tailor/products", {
        headers: {
          ...authHeaders,
          "x-user-role": "tailor",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      } else {
        throw new Error("Fehler beim Laden der Produkte");
      }
    } catch (err: any) {
      // console.error("Error fetching products:", err);
      setError(err.message || "Ein Fehler ist aufgetreten");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Möchtest du dieses Produkt wirklich löschen?")) {
      return;
    }

    try {
      setDeletingId(productId);
      const authHeaders = await getSimpleAuthHeaders();
      const response = await fetch(`/api/tailor/products/${productId}`, {
        method: "DELETE",
        headers: {
          ...authHeaders,
          "x-user-role": "tailor",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler beim Löschen");
      }

      // Remove from local state
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err: any) {
      // console.error("Error deleting product:", err);
      alert(err.message || "Fehler beim Löschen");
    } finally {
      setDeletingId(null);
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
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Meine Produkte
          </h1>
          <p className="text-slate-600">
            Verwalte deine Produkte und Portfolio
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/tailor/analytics">
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </Link>
          <Link href="/tailor/orders">
            <Button variant="outline">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Bestellungen
            </Button>
          </Link>
          <Link href="/tailor/products/new">
            <Button size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Neues Produkt
            </Button>
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-600">
          {error}
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Noch keine Produkte
              </h3>
              <p className="text-slate-600 mb-6">
                Erstelle dein erstes Produkt, um es auf dem Marketplace anzubieten
              </p>
              <Link href="/tailor/products/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Produkt erstellen
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              {/* Product Image */}
              <div className="relative h-48 bg-slate-100">
                {product.images.length > 0 ? (
                  <img
                    src={product.images[0].url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-16 h-16 text-slate-300" />
                  </div>
                )}
              </div>

              <CardHeader>
                <CardTitle className="text-lg line-clamp-1">
                  {product.title}
                </CardTitle>
                {product.category && (
                  <p className="text-sm text-slate-500">{product.category}</p>
                )}
              </CardHeader>

              <CardContent>
                {product.description && (
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                )}

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-slate-900">
                    €{product.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(product.createdAt).toLocaleDateString("de-DE")}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/products/${product.id}`}
                    className="flex-1"
                    target="_blank"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      Ansehen
                    </Button>
                  </Link>
                  <Link href={`/tailor/products/${product.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                  >
                    {deletingId === product.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-red-600" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      {products.length > 0 && (
        <div className="mt-8">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">
                  Gesamt: {products.length} Produkte
                </span>
                <span className="text-slate-600">
                  Durchschnittspreis: €
                  {(
                    products.reduce((sum, p) => sum + p.price, 0) /
                    products.length
                  ).toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
