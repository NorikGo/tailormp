"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Package, ChevronRight, ShoppingBag, User, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Order } from "@/app/types/order";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/app/lib/constants/orderStatus";
import { getSimpleAuthHeaders } from "@/app/lib/auth/client-helpers";

// Verwendung der zentralen Status-Konstanten
const statusColors = ORDER_STATUS_COLORS;
const statusLabels = ORDER_STATUS_LABELS;

export default function TailorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const url =
          filter === "all"
            ? "/api/orders"
            : `/api/orders?status=${filter}`;

        // Echte Auth-Header verwenden statt Dummy
        const authHeaders = await getSimpleAuthHeaders();
        const response = await fetch(url, {
          headers: {
            ...authHeaders,
            "x-user-role": "tailor",
          },
        });

        if (!response.ok) {
          throw new Error("Fehler beim Laden der Bestellungen");
        }

        const data = await response.json();
        setOrders(data.orders);
      } catch (err: any) {
        // console.error("Error fetching orders:", err);
        setError(err.message || "Ein Fehler ist aufgetreten");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [filter]);

  const filterOrders = (status?: string) => {
    if (!status) return orders;
    return orders.filter((order) => order.status === status);
  };

  const newOrders = filterOrders("paid");
  const processingOrders = filterOrders("processing");
  const shippedOrders = filterOrders("shipped");

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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Meine Aufträge
            </h1>
            <p className="text-slate-600">
              Verwalte deine Kundenbestellungen
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/tailor/analytics">
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </Link>
            <Link href="/tailor/products">
              <Button variant="outline">
                <Package className="w-4 h-4 mr-2" />
                Meine Produkte
              </Button>
            </Link>
            <Link href="/tailor/profile/edit">
              <Button variant="outline">
                <User className="w-4 h-4 mr-2" />
                Profil bearbeiten
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 mb-1">Neue Bestellungen</p>
              <p className="text-2xl font-bold text-green-600">
                {newOrders.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 mb-1">In Bearbeitung</p>
              <p className="text-2xl font-bold text-blue-600">
                {processingOrders.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 mb-1">Versendet</p>
              <p className="text-2xl font-bold text-purple-600">
                {shippedOrders.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 mb-1">Gesamt</p>
              <p className="text-2xl font-bold text-slate-900">
                {orders.length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="new" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="new">
              Neu ({newOrders.length})
            </TabsTrigger>
            <TabsTrigger value="processing">
              In Arbeit ({processingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="shipped">
              Versendet ({shippedOrders.length})
            </TabsTrigger>
            <TabsTrigger value="all">Alle ({orders.length})</TabsTrigger>
          </TabsList>

          {/* New Orders */}
          <TabsContent value="new">
            <OrdersList orders={newOrders} emptyMessage="Keine neuen Bestellungen" />
          </TabsContent>

          {/* Processing Orders */}
          <TabsContent value="processing">
            <OrdersList
              orders={processingOrders}
              emptyMessage="Keine Bestellungen in Bearbeitung"
            />
          </TabsContent>

          {/* Shipped Orders */}
          <TabsContent value="shipped">
            <OrdersList
              orders={shippedOrders}
              emptyMessage="Keine versendeten Bestellungen"
            />
          </TabsContent>

          {/* All Orders */}
          <TabsContent value="all">
            <OrdersList orders={orders} emptyMessage="Noch keine Bestellungen" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function OrdersList({
  orders,
  emptyMessage,
}: {
  orders: Order[];
  emptyMessage: string;
}) {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 text-slate-400" />
          </div>
          <p className="text-slate-600">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
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
                      {new Date(order.createdAt).toLocaleDateString("de-DE")}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                      {order.id}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="ml-8 space-y-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-900">
                        {item.quantity}x {item.productTitle}
                      </p>
                      {item.fabricChoice && (
                        <Badge variant="secondary" className="text-xs">
                          {item.fabricChoice}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>

                {/* Customer & Amount */}
                <div className="ml-8 mt-3 flex items-center gap-4">
                  <Badge
                    className={
                      statusColors[order.status as keyof typeof statusColors]
                    }
                  >
                    {statusLabels[order.status as keyof typeof statusLabels]}
                  </Badge>
                  <span className="text-sm text-slate-600">
                    Kunde: {order.user?.email || "N/A"}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    €{order.tailorAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Right: Action Button */}
              <Link href={`/tailor/orders/${order.id}`}>
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
  );
}
