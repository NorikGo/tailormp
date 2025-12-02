"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Package, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/app/hooks/useAuth";

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

interface OrderItem {
  id: string;
  productTitle: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: {
    id: string;
    title: string;
  };
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  platformFee: number;
  tailorAmount: number;
  currency: string;
  createdAt: string;
  paidAt: string | null;
  items: OrderItem[];
}

// ═══════════════════════════════════════════════════════════════════════════
// Orders Page
// ═══════════════════════════════════════════════════════════════════════════

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/orders");

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Fetch orders error:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // ───────────────────────────────────────────
  // Status Badge
  // ───────────────────────────────────────────
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
    > = {
      pending: { label: "Ausstehend", variant: "secondary" },
      paid: { label: "Bezahlt", variant: "default" },
      processing: { label: "In Bearbeitung", variant: "secondary" },
      shipped: { label: "Versendet", variant: "outline" },
      delivered: { label: "Zugestellt", variant: "default" },
      cancelled: { label: "Storniert", variant: "destructive" },
    };

    const config = statusConfig[status] || {
      label: status,
      variant: "secondary" as const,
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // ───────────────────────────────────────────
  // Loading State
  // ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────
  // Not Authenticated
  // ───────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Anmeldung erforderlich
            </h1>
            <p className="text-slate-600 mb-8">
              Bitte melden Sie sich an, um Ihre Bestellungen zu sehen.
            </p>
            <Button onClick={() => router.push("/login")}>Anmelden</Button>
          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────
  // Error State
  // ───────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Erneut versuchen
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────
  // Orders List
  // ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück
        </Button>

        {/* Page Title */}
        <div className="flex items-center gap-3 mb-8">
          <Package className="h-8 w-8 text-slate-700" />
          <h1 className="text-3xl font-bold text-slate-900">
            Meine Bestellungen
          </h1>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Keine Bestellungen
              </h2>
              <p className="text-slate-600 mb-6">
                Sie haben noch keine Bestellungen aufgegeben.
              </p>
              <Button asChild>
                <Link href="/products">Produkte entdecken</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">
                          Bestellung #{order.id.slice(0, 8)}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>

                      <div className="text-sm text-slate-600 space-y-1">
                        <p>
                          {order.items.length} {order.items.length === 1 ? "Artikel" : "Artikel"}
                        </p>
                        <p>
                          Bestellt am:{" "}
                          {new Date(order.createdAt).toLocaleDateString("de-DE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </p>
                        {order.paidAt && (
                          <p>
                            Bezahlt am:{" "}
                            {new Date(order.paidAt).toLocaleDateString("de-DE", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </p>
                        )}
                      </div>

                      {/* Items Preview */}
                      <div className="mt-3">
                        {order.items.slice(0, 2).map((item) => (
                          <p key={item.id} className="text-sm text-slate-700">
                            • {item.productTitle} ({item.quantity}x)
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-slate-500">
                            + {order.items.length - 2} weitere{" "}
                            {order.items.length - 2 === 1 ? "Artikel" : "Artikel"}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Total & Action */}
                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">
                          {order.totalAmount.toFixed(2)} €
                        </p>
                        <p className="text-sm text-slate-500">
                          inkl. {order.platformFee.toFixed(2)} € Gebühr
                        </p>
                      </div>

                      <Button variant="outline" asChild>
                        <Link href={`/orders/${order.id}`}>Details ansehen</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
