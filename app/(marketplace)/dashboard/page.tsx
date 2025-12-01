"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Package, ChevronRight, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Order } from "@/app/types/order";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  completed: "bg-slate-100 text-slate-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels = {
  pending: "Ausstehend",
  paid: "Bezahlt",
  processing: "In Bearbeitung",
  shipped: "Versendet",
  completed: "Abgeschlossen",
  cancelled: "Storniert",
};

export default function CustomerDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/orders", {
          headers: {
            "x-user-id": "dummy-user-id", // TODO: Replace with real auth
            "x-user-role": "customer",
          },
        });

        if (!response.ok) {
          throw new Error("Fehler beim Laden der Bestellungen");
        }

        const data = await response.json();
        setOrders(data.orders);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError(err.message || "Ein Fehler ist aufgetreten");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Meine Bestellungen
          </h1>
          <p className="text-slate-600">
            Verwalte und verfolge deine Bestellungen
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Noch keine Bestellungen
              </h3>
              <p className="text-slate-600 mb-6">
                Du hast noch keine Bestellungen aufgegeben.
              </p>
              <Link href="/products">
                <Button>Produkte entdecken</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Orders List */}
        {orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Left: Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-600">
                            Bestellung vom{" "}
                            {new Date(order.createdAt).toLocaleDateString(
                              "de-DE"
                            )}
                          </p>
                          <p className="text-xs text-slate-500 font-mono">
                            {order.id}
                          </p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="ml-8 space-y-1">
                        {order.items.map((item) => (
                          <p
                            key={item.id}
                            className="text-sm font-medium text-slate-900"
                          >
                            {item.quantity}x {item.productTitle}
                          </p>
                        ))}
                      </div>

                      {/* Status & Amount */}
                      <div className="ml-8 mt-3 flex items-center gap-3">
                        <Badge
                          className={
                            statusColors[order.status as keyof typeof statusColors]
                          }
                        >
                          {statusLabels[order.status as keyof typeof statusLabels]}
                        </Badge>
                        <span className="text-sm font-semibold text-slate-900">
                          €{order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Right: Action Button */}
                    <Link href={`/dashboard/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
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
