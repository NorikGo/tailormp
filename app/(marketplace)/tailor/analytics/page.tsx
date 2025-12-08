"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Package,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/app/lib/constants/orderStatus";

interface AnalyticsData {
  period: {
    days: number;
    startDate: string;
    endDate: string;
  };
  overview: {
    totalOrders: number;
    totalRevenue: number;
    netRevenue: number;
    platformFeeTotal: number;
    avgOrderValue: number;
  };
  statusBreakdown: Record<string, number>;
  revenueChartData: Array<{ date: string; revenue: number }>;
  topProducts: Array<{
    productId: string;
    title: string;
    quantity: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    id: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    itemCount: number;
  }>;
}

// Verwendung der zentralen Status-Konstanten
const statusLabels: Record<string, string> = ORDER_STATUS_LABELS;
const statusColors: Record<string, string> = ORDER_STATUS_COLORS;

export default function TailorAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(30);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/tailors/analytics?days=${selectedPeriod}`
        );

        if (!response.ok) {
          throw new Error("Fehler beim Laden der Analytics");
        }

        const data = await response.json();
        setAnalytics(data.analytics);
      } catch (err: any) {
        // console.error("Error fetching analytics:", err);
        setError(err.message || "Ein Fehler ist aufgetreten");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedPeriod]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error || "Keine Daten verfügbar"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Analytics & Reporting
            </h1>
            <p className="text-slate-600">
              Übersicht über deine Verkäufe und Performance
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/tailor/orders">
              <Button variant="outline">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Bestellungen
              </Button>
            </Link>
            <Link href="/tailor/products">
              <Button variant="outline">
                <Package className="w-4 h-4 mr-2" />
                Produkte
              </Button>
            </Link>
          </div>
        </div>

        {/* Period Selector */}
        <div className="mb-6">
          <Tabs
            value={selectedPeriod.toString()}
            onValueChange={(value) => setSelectedPeriod(parseInt(value))}
          >
            <TabsList>
              <TabsTrigger value="7">Letzte 7 Tage</TabsTrigger>
              <TabsTrigger value="30">Letzte 30 Tage</TabsTrigger>
              <TabsTrigger value="90">Letzte 90 Tage</TabsTrigger>
              <TabsTrigger value="365">Letztes Jahr</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Gesamtumsatz
              </CardTitle>
              <DollarSign className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                €{analytics.overview.totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Netto: €{analytics.overview.netRevenue.toFixed(2)} (nach 10%
                Gebühr)
              </p>
            </CardContent>
          </Card>

          {/* Total Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Bestellungen
              </CardTitle>
              <ShoppingBag className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {analytics.overview.totalOrders}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                In den letzten {analytics.period.days} Tagen
              </p>
            </CardContent>
          </Card>

          {/* Avg Order Value */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                ⌀ Bestellwert
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                €{analytics.overview.avgOrderValue.toFixed(2)}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Pro Bestellung
              </p>
            </CardContent>
          </Card>

          {/* Platform Fee */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Plattform-Gebühr
              </CardTitle>
              <Calendar className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                €{analytics.overview.platformFeeTotal.toFixed(2)}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                10% vom Gesamtumsatz
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts & Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Umsatzverlauf</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.revenueChartData.length > 0 ? (
                <div className="space-y-2">
                  {analytics.revenueChartData.map((item, index) => {
                    const maxRevenue = Math.max(
                      ...analytics.revenueChartData.map((d) => d.revenue)
                    );
                    const percentage = (item.revenue / maxRevenue) * 100;

                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">
                            {new Date(item.date).toLocaleDateString("de-DE", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </span>
                          <span className="font-medium text-slate-900">
                            €{item.revenue.toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-600 text-sm text-center py-8">
                  Keine Umsatzdaten verfügbar
                </p>
              )}
            </CardContent>
          </Card>

          {/* Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Bestellstatus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(analytics.statusBreakdown).map(
                  ([status, count]) => (
                    <div
                      key={status}
                      className="flex items-center justify-between"
                    >
                      <Badge
                        className={
                          statusColors[status] || "bg-slate-100 text-slate-800"
                        }
                      >
                        {statusLabels[status] || status}
                      </Badge>
                      <span className="text-lg font-semibold text-slate-900">
                        {count}
                      </span>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Top 5 Produkte</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.topProducts.length > 0 ? (
              <div className="space-y-4">
                {analytics.topProducts.map((product, index) => (
                  <div
                    key={product.productId}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {product.title}
                        </p>
                        <p className="text-sm text-slate-600">
                          {product.quantity} verkauft
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        €{product.revenue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-sm text-center py-8">
                Keine Produktdaten verfügbar
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Letzte Bestellungen</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.recentOrders.length > 0 ? (
              <div className="space-y-3">
                {analytics.recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/tailor/orders/${order.id}`}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Package className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-900 text-sm">
                          {new Date(order.createdAt).toLocaleDateString("de-DE", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-slate-600">
                          {order.itemCount}{" "}
                          {order.itemCount === 1 ? "Artikel" : "Artikel"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={
                          statusColors[order.status] ||
                          "bg-slate-100 text-slate-800"
                        }
                      >
                        {statusLabels[order.status] || order.status}
                      </Badge>
                      <span className="font-semibold text-slate-900">
                        €{order.totalAmount.toFixed(2)}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-sm text-center py-8">
                Keine Bestellungen verfügbar
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
