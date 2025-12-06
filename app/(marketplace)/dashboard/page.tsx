"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Package,
  ChevronRight,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle,
  Euro
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import type { Order } from "@/app/types/order";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/app/lib/constants/orderStatus";

// Verwendung der zentralen Status-Konstanten
const statusColors = ORDER_STATUS_COLORS;
const statusLabels = ORDER_STATUS_LABELS;

interface OrderStats {
  totalOrders: number;
  totalSpent: number;
  pendingOrders: number;
  completedOrders: number;
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
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
          throw new Error("Fehler beim Laden der Bestellungen");
        }

        const data = await response.json();
        setOrders(data.orders);

        // Calculate statistics
        const totalOrders = data.orders.length;
        const totalSpent = data.orders.reduce(
          (sum: number, order: Order) => sum + order.totalAmount,
          0
        );
        const pendingOrders = data.orders.filter(
          (order: Order) =>
            order.status === "pending" ||
            order.status === "paid" ||
            order.status === "processing"
        ).length;
        const completedOrders = data.orders.filter(
          (order: Order) => order.status === "completed" || order.status === "shipped"
        ).length;

        setStats({
          totalOrders,
          totalSpent,
          pendingOrders,
          completedOrders,
        });
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError(err.message || "Ein Fehler ist aufgetreten");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  // Not Authenticated
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Anmeldung erforderlich
          </h1>
          <p className="text-slate-600 mb-8">
            Bitte melden Sie sich an, um Ihr Dashboard zu sehen.
          </p>
          <Button onClick={() => router.push("/login")}>Anmelden</Button>
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Bestellungen
              </CardTitle>
              <Package className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {stats.totalOrders}
              </div>
              <p className="text-xs text-slate-500 mt-1">Gesamt</p>
            </CardContent>
          </Card>

          {/* Total Spent */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Ausgegeben
              </CardTitle>
              <Euro className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {stats.totalSpent.toFixed(2)} €
              </div>
              <p className="text-xs text-slate-500 mt-1">Gesamt</p>
            </CardContent>
          </Card>

          {/* Pending Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                In Bearbeitung
              </CardTitle>
              <Clock className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {stats.pendingOrders}
              </div>
              <p className="text-xs text-slate-500 mt-1">Aktive Bestellungen</p>
            </CardContent>
          </Card>

          {/* Completed Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Abgeschlossen
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {stats.completedOrders}
              </div>
              <p className="text-xs text-slate-500 mt-1">Zugestellt</p>
            </CardContent>
          </Card>
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
                    <Link href={`/orders/${order.id}`}>
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
