"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Users,
  ShoppingBag,
  Package,
  DollarSign,
  TrendingUp,
  Calendar,
  Shield,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminStats {
  period: {
    days: number;
    startDate: string;
    endDate: string;
  };
  users: {
    total: number;
    tailors: number;
    customers: number;
    newInPeriod: number;
  };
  orders: {
    total: number;
    inPeriod: number;
    statusBreakdown: Record<string, number>;
  };
  revenue: {
    total: number;
    platformFees: number;
    chartData: Array<{
      date: string;
      revenue: number;
      platformFees: number;
      orders: number;
    }>;
  };
  products: {
    total: number;
    active: number;
  };
  topTailors: Array<{
    id: string;
    name: string;
    totalOrders: number;
    rating: number | null;
    user: {
      email: string;
    };
  }>;
  recentUsers: Array<{
    id: string;
    email: string;
    role: string;
    firstName: string | null;
    lastName: string | null;
    createdAt: string;
  }>;
  recentOrders: Array<{
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    user: {
      email: string;
    };
    items: Array<{
      productTitle: string;
    }>;
  }>;
}

interface UserData {
  id: string;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
  ordersCount: number;
  tailor?: {
    id: string;
    name: string;
    isVerified: boolean;
    totalOrders: number;
    rating: number | null;
  };
}

interface UsersPagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

const statusLabels: Record<string, string> = {
  pending: "Ausstehend",
  paid: "Bezahlt",
  processing: "In Bearbeitung",
  shipped: "Versendet",
  completed: "Abgeschlossen",
  cancelled: "Storniert",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  completed: "bg-slate-100 text-slate-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [usersPagination, setUsersPagination] = useState<UsersPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(30);
  const [userRoleFilter, setUserRoleFilter] = useState<string>("all");
  const [userSearch, setUserSearch] = useState<string>("");

  useEffect(() => {
    fetchStats();
  }, [selectedPeriod]);

  useEffect(() => {
    fetchUsers();
  }, [userRoleFilter, userSearch]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/stats?days=${selectedPeriod}`);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Keine Admin-Berechtigung");
        }
        throw new Error("Fehler beim Laden der Statistiken");
      }

      const data = await response.json();
      setStats(data.stats);
    } catch (err: any) {
      console.error("Error fetching stats:", err);
      setError(err.message || "Ein Fehler ist aufgetreten");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const params = new URLSearchParams({
        role: userRoleFilter,
        ...(userSearch && { search: userSearch }),
      });

      const response = await fetch(`/api/admin/users?${params}`);

      if (!response.ok) {
        throw new Error("Fehler beim Laden der Benutzer");
      }

      const data = await response.json();
      setUsers(data.users);
      setUsersPagination(data.pagination);
    } catch (err: any) {
      console.error("Error fetching users:", err);
    } finally {
      setUsersLoading(false);
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-red-600" />
              <h1 className="text-3xl font-bold text-slate-900">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-slate-600">
              Plattform-Übersicht und Verwaltung
            </p>
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
          {/* Total Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Benutzer
              </CardTitle>
              <Users className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {stats.users.total}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                +{stats.users.newInPeriod} neu ({stats.period.days} Tage)
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {stats.users.tailors} Schneider
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {stats.users.customers} Kunden
                </Badge>
              </div>
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
                {stats.orders.total}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {stats.orders.inPeriod} in den letzten {stats.period.days} Tagen
              </p>
            </CardContent>
          </Card>

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
                ¬{stats.revenue.total.toFixed(2)}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Letzte {stats.period.days} Tage
              </p>
            </CardContent>
          </Card>

          {/* Platform Fees */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Plattform-Gebühren
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ¬{stats.revenue.platformFees.toFixed(2)}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                10% vom Umsatz
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Umsatzverlauf</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.revenue.chartData.length > 0 ? (
                <div className="space-y-2">
                  {stats.revenue.chartData.slice(-10).map((item, index) => {
                    const maxRevenue = Math.max(
                      ...stats.revenue.chartData.map((d) => d.revenue)
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
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500">
                              {item.orders} Orders
                            </span>
                            <span className="font-medium text-slate-900">
                              ¬{item.revenue.toFixed(2)}
                            </span>
                          </div>
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
                  Keine Daten verfügbar
                </p>
              )}
            </CardContent>
          </Card>

          {/* Order Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Bestellstatus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats.orders.statusBreakdown).map(
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

        {/* Top Tailors */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Top Schneider</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topTailors.length > 0 ? (
              <div className="space-y-3">
                {stats.topTailors.map((tailor, index) => (
                  <div
                    key={tailor.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {tailor.name}
                        </p>
                        <p className="text-sm text-slate-600">
                          {tailor.user.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        {tailor.totalOrders} Bestellungen
                      </p>
                      {tailor.rating && (
                        <p className="text-sm text-slate-600">
                          P {tailor.rating.toFixed(1)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-sm text-center py-8">
                Keine Daten verfügbar
              </p>
            )}
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Benutzerverwaltung</CardTitle>
              <div className="flex gap-2">
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="all">Alle Rollen</option>
                  <option value="customer">Kunden</option>
                  <option value="tailor">Schneider</option>
                  <option value="admin">Admins</option>
                </select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Suche..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              </div>
            ) : users.length > 0 ? (
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900">
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.email}
                        </p>
                        <Badge
                          className={
                            user.role === "admin"
                              ? "bg-red-100 text-red-800"
                              : user.role === "tailor"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-slate-100 text-slate-800"
                          }
                        >
                          {user.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{user.email}</p>
                      {user.tailor && (
                        <p className="text-xs text-slate-500 mt-1">
                          Schneider: {user.tailor.name} "{" "}
                          {user.tailor.totalOrders} Bestellungen
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">
                        {user.ordersCount} Bestellungen
                      </p>
                      <p className="text-xs text-slate-500">
                        Seit{" "}
                        {new Date(user.createdAt).toLocaleDateString("de-DE")}
                      </p>
                    </div>
                  </div>
                ))}
                {usersPagination && (
                  <div className="mt-4 text-center text-sm text-slate-600">
                    Seite {usersPagination.page} von {usersPagination.totalPages}{" "}
                    ({usersPagination.totalCount} Benutzer)
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-600 text-sm text-center py-8">
                Keine Benutzer gefunden
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
