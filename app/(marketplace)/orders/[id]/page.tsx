"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Package, ArrowLeft, MapPin, Calendar, CreditCard, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/app/contexts/AuthContext";

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

interface OrderItem {
  id: string;
  productTitle: string;
  productDescription: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  customNotes: string | null;
  fabricChoice: string | null;
  product: {
    id: string;
    title: string;
    tailor: {
      id: string;
      name: string;
      country: string;
    };
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
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  shippingMethod: string;
  measurements: any;
  items: OrderItem[];
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// Order Detail Page
// ═══════════════════════════════════════════════════════════════════════════

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = params.id as string;

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/orders/${orderId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Bestellung nicht gefunden");
          } else if (response.status === 403) {
            throw new Error("Keine Berechtigung für diese Bestellung");
          }
          throw new Error("Fehler beim Laden der Bestellung");
        }

        const data = await response.json();
        setOrder(data.order);
      } catch (err) {
        // console.error("Fetch order error:", err);
        setError(err instanceof Error ? err.message : "Fehler beim Laden der Bestellung");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [user, orderId]);

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
  // Shipping Method Label
  // ───────────────────────────────────────────
  const getShippingMethodLabel = (method: string) => {
    const methodLabels: Record<string, string> = {
      standard: "Standard-Versand",
      express: "Express-Versand",
      pickup: "Abholung",
    };
    return methodLabels[method] || method;
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
              Bitte melden Sie sich an, um Bestellungen zu sehen.
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
  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => router.push("/orders")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zu Bestellungen
          </Button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error || "Bestellung nicht gefunden"}</p>
            <Button variant="outline" className="mt-4" onClick={() => router.push("/orders")}>
              Zu Bestellungen
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────
  // Order Detail View
  // ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push("/orders")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück zu Bestellungen
        </Button>

        {/* Page Title */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-slate-700" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Bestellung #{order.id.slice(0, 8)}
              </h1>
              <p className="text-slate-600 mt-1">
                Bestellt am{" "}
                {new Date(order.createdAt).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          {getStatusBadge(order.status)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Bestellte Artikel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0"
                    >
                      <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="h-8 w-8 text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.product.id}`}
                          className="font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                        >
                          {item.productTitle}
                        </Link>
                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                          {item.productDescription}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Link
                            href={`/tailors/${item.product.tailor.id}`}
                            className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
                          >
                            <MapPin className="h-3 w-3 inline mr-1" />
                            {item.product.tailor.name}
                          </Link>
                        </div>
                        {item.customNotes && (
                          <p className="text-sm text-slate-500 mt-2">
                            <strong>Notiz:</strong> {item.customNotes}
                          </p>
                        )}
                        {item.fabricChoice && (
                          <p className="text-sm text-slate-500 mt-1">
                            <strong>Stoff:</strong> {item.fabricChoice}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">
                          {item.subtotal.toFixed(2)} €
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          {item.quantity}x {item.unitPrice.toFixed(2)} €
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Lieferadresse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-slate-700">
                  <p className="font-semibold">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.postalCode} {order.shippingAddress.city}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <p className="mt-2 text-sm text-slate-600">
                      Tel: {order.shippingAddress.phone}
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-slate-600">
                    <strong>Versandart:</strong> {getShippingMethodLabel(order.shippingMethod)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Measurements */}
            {order.measurements && (
              <Card>
                <CardHeader>
                  <CardTitle>Maße</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(order.measurements).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="text-slate-600 capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </span>
                        <span className="ml-2 font-medium text-slate-900">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Zahlungsinformationen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-slate-700">
                    <span>Zwischensumme</span>
                    <span>{order.tailorAmount.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Plattform-Gebühr</span>
                    <span>{order.platformFee.toFixed(2)} €</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold text-slate-900">
                    <span>Gesamt</span>
                    <span>{order.totalAmount.toFixed(2)} €</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <div>
                      <p className="font-medium text-slate-900">Bestellt</p>
                      <p className="text-sm text-slate-600">
                        {new Date(order.createdAt).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  {order.paidAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                      <div>
                        <p className="font-medium text-slate-900">Bezahlt</p>
                        <p className="text-sm text-slate-600">
                          {new Date(order.paidAt).toLocaleDateString("de-DE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {order.status === "processing" && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 animate-pulse" />
                      <div>
                        <p className="font-medium text-slate-900">In Bearbeitung</p>
                        <p className="text-sm text-slate-600">
                          Ihre Bestellung wird gerade bearbeitet
                        </p>
                      </div>
                    </div>
                  )}

                  {order.status === "shipped" && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      <div>
                        <p className="font-medium text-slate-900">Versendet</p>
                        <p className="text-sm text-slate-600">Ihre Bestellung ist unterwegs</p>
                      </div>
                    </div>
                  )}

                  {order.status === "delivered" && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                      <div>
                        <p className="font-medium text-slate-900">Zugestellt</p>
                        <p className="text-sm text-slate-600">Ihre Bestellung wurde zugestellt</p>
                      </div>
                    </div>
                  )}

                  {order.status === "cancelled" && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                      <div>
                        <p className="font-medium text-slate-900">Storniert</p>
                        <p className="text-sm text-slate-600">Diese Bestellung wurde storniert</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Kundeninformationen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {order.user.firstName && order.user.lastName && (
                    <p className="font-medium text-slate-900">
                      {order.user.firstName} {order.user.lastName}
                    </p>
                  )}
                  <p className="text-slate-600">{order.user.email}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
