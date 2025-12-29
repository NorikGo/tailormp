"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Package,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle,
  Euro,
  Star,
  ShoppingBag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import type { Order } from "@/app/types/order";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/app/lib/constants/orderStatus";

const statusColors = ORDER_STATUS_COLORS;
const statusLabels = ORDER_STATUS_LABELS;

interface TailorStats {
  totalOrders: number;
  totalEarnings: number;
  pendingOrders: number;
  completedOrders: number;
  activeProducts: number;
  averageRating: number;
}

export default function TailorDashboard() {
  const { user, isTailor } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<TailorStats>({
    totalOrders: 0,
    totalEarnings: 0,
    pendingOrders: 0,
    completedOrders: 0,
    activeProducts: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch tailor's orders
        const ordersResponse = await fetch("/api/tailor/orders");
        if (!ordersResponse.ok) {
          throw new Error("Fehler beim Laden der Bestellungen");
        }
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.orders || []);

        // Fetch tailor profile for stats
        const profileResponse = await fetch("/api/tailor/profile");
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();

          // Calculate statistics
          const totalOrders = ordersData.orders?.length || 0;
          const totalEarnings = ordersData.orders?.reduce(
            (sum: number, order: Order) => sum + (order.tailorAmount || 0),
            0
          ) || 0;
          const pendingOrders = ordersData.orders?.filter(
            (order: Order) =>
              order.status === "pending" ||
              order.status === "paid" ||
              order.status === "processing"
          ).length || 0;
          const completedOrders = ordersData.orders?.filter(
            (order: Order) => order.status === "completed" || order.status === "shipped"
          ).length || 0;

          setStats({
            totalOrders,
            totalEarnings,
            pendingOrders,
            completedOrders,
            activeProducts: profileData.tailor?.products?.length || 0,
            averageRating: profileData.tailor?.rating || 0,
          });
        }
      } catch (err: any) {
        // console.error("Error fetching dashboard data:", err);
        setError(err.message || "Ein Fehler ist aufgetreten");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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

  // Not Authenticated or Not a Tailor
  if (!user || !isTailor) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Zugriff verweigert
          </h1>
          <p className="text-slate-600 mb-8">
            Sie haben keinen Zugriff auf das Schneider-Dashboard.
          </p>
          <Button onClick={() => router.push("/")}>Zur Startseite</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Schneider Dashboard
          </h1>
          <p className="text-slate-600">
            Verwalte deine Produkte, Bestellungen und Einnahmen
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Total Earnings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Einnahmen
              </CardTitle>
              <Euro className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {stats.totalEarnings.toFixed(2)} €
              </div>
              <p className="text-xs text-slate-500 mt-1">Gesamt</p>
            </CardContent>
          </Card>

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

          {/* Pending Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Offen
              </CardTitle>
              <Clock className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {stats.pendingOrders}
              </div>
              <p className="text-xs text-slate-500 mt-1">Zu bearbeiten</p>
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

          {/* Active Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Aktive Produkte
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {stats.activeProducts}
              </div>
              <p className="text-xs text-slate-500 mt-1">Im Angebot</p>
            </CardContent>
          </Card>

          {/* Average Rating */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Bewertung
              </CardTitle>
              <Star className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "–"}
              </div>
              <p className="text-xs text-slate-500 mt-1">Durchschnitt</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link href="/tailor/products">
            <Button className="w-full" variant="outline">
              Produkte verwalten
            </Button>
          </Link>
          <Link href="/tailor/profile/edit">
            <Button className="w-full" variant="outline">
              Profil bearbeiten
            </Button>
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Recent Orders Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Neueste Bestellungen</CardTitle>
              <Link href="/tailor/orders">
                <Button variant="ghost" size="sm">
                  Alle anzeigen
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {/* Empty State */}
            {orders.length === 0 && (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Noch keine Bestellungen
                </h3>
                <p className="text-slate-600 mb-6">
                  Sobald Kunden deine Produkte bestellen, erscheinen sie hier.
                </p>
              </div>
            )}

            {/* Orders List (showing max 5) */}
            {orders.length > 0 && (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-600">
                            Bestellung vom{" "}
                            {new Date(order.createdAt).toLocaleDateString("de-DE")}
                          </p>
                          <p className="text-xs text-slate-500 font-mono">
                            {order.id.substring(0, 8)}...
                          </p>
                        </div>
                      </div>

                      <div className="ml-8 flex items-center gap-3">
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

                    <Link href={`/tailor/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
