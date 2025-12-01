"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Package,
  MapPin,
  User,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function TailorOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [newStatus, setNewStatus] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState<string>("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/orders/${orderId}`, {
          headers: {
            "x-user-id": "dummy-tailor-id", // TODO: Replace with real auth
            "x-user-role": "tailor",
          },
        });

        if (!response.ok) {
          throw new Error("Bestellung nicht gefunden");
        }

        const data = await response.json();
        setOrder(data.order);
        setNewStatus(data.order.status);
        setTrackingNumber(data.order.trackingNumber || "");
      } catch (err: any) {
        console.error("Error fetching order:", err);
        setError(err.message || "Ein Fehler ist aufgetreten");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleUpdateStatus = async () => {
    if (!order) return;

    try {
      setUpdating(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "dummy-tailor-id", // TODO: Replace with real auth
          "x-user-role": "tailor",
        },
        body: JSON.stringify({
          status: newStatus,
          ...(trackingNumber && { trackingNumber }),
        }),
      });

      if (!response.ok) {
        throw new Error("Status konnte nicht aktualisiert werden");
      }

      const data = await response.json();
      setOrder(data.order);
      setSuccessMessage("Status erfolgreich aktualisiert!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("Error updating order:", err);
      setError(err.message || "Ein Fehler ist aufgetreten");
    } finally {
      setUpdating(false);
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

  if (error && !order) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <Card className="border-red-200">
            <CardContent className="p-8 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Link href="/tailor/orders">
                <Button variant="outline">Zurück zu Aufträgen</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/tailor/orders">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zu Aufträgen
            </Button>
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Auftragsdetails
              </h1>
              <p className="text-sm text-slate-600 font-mono">{order.id}</p>
            </div>
            <Badge
              className={statusColors[order.status as keyof typeof statusColors]}
            >
              {statusLabels[order.status as keyof typeof statusLabels]}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Bestellte Artikel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="pb-4 border-b border-slate-200 last:border-0 last:pb-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">
                          {item.productTitle}
                        </h4>
                        {item.productDescription && (
                          <p className="text-sm text-slate-600 mt-1">
                            {item.productDescription}
                          </p>
                        )}
                      </div>
                      <p className="font-semibold text-slate-900">
                        €{item.subtotal.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>Menge: {item.quantity}</span>
                      <span>€{item.unitPrice.toFixed(2)} / Stück</span>
                    </div>
                    {item.fabricChoice && (
                      <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                        <p className="text-sm font-medium text-slate-900">
                          Stoffwunsch
                        </p>
                        <p className="text-sm text-slate-700">
                          {item.fabricChoice}
                        </p>
                      </div>
                    )}
                    {item.customNotes && (
                      <div className="mt-3 p-3 bg-amber-50 rounded border border-amber-200">
                        <p className="text-sm font-medium text-slate-900">
                          Besondere Wünsche
                        </p>
                        <p className="text-sm text-slate-700">
                          {item.customNotes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Customer & Shipping Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Kunde
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <div>
                      <p className="text-slate-600">E-Mail</p>
                      <p className="font-medium text-slate-900">
                        {order.user?.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600">Bestellt am</p>
                      <p className="font-medium text-slate-900">
                        {new Date(order.createdAt).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Lieferadresse
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-slate-700">
                      <p className="font-medium">{order.shippingAddress.name}</p>
                      <p>{order.shippingAddress.street}</p>
                      <p>
                        {order.shippingAddress.zip} {order.shippingAddress.city}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                      {order.shippingAddress.phone && (
                        <p className="mt-2 text-slate-600">
                          {order.shippingAddress.phone}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Measurements */}
            {order.measurements && (
              <Card>
                <CardHeader>
                  <CardTitle>Maße</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm bg-slate-50 p-4 rounded overflow-auto">
                    {JSON.stringify(order.measurements, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle>Zahlung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Gesamtbetrag</span>
                  <span className="text-slate-900">
                    €{order.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Plattformgebühr</span>
                  <span className="text-red-600">
                    -€{order.platformFee.toFixed(2)}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-900">
                      Dein Anteil
                    </span>
                    <span className="font-bold text-green-600 text-lg">
                      €{order.tailorAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
                {order.paidAt && (
                  <div className="pt-3 border-t border-slate-200 text-xs text-slate-500">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        Bezahlt am{" "}
                        {new Date(order.paidAt).toLocaleDateString("de-DE")}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status Update */}
            <Card>
              <CardHeader>
                <CardTitle>Status aktualisieren</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Bestellstatus</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Bezahlt</SelectItem>
                      <SelectItem value="processing">In Bearbeitung</SelectItem>
                      <SelectItem value="shipped">Versendet</SelectItem>
                      <SelectItem value="completed">Abgeschlossen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(newStatus === "shipped" || order.trackingNumber) && (
                  <div>
                    <Label htmlFor="tracking">
                      Tracking Nummer (optional)
                    </Label>
                    <Input
                      id="tracking"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="z.B. DHL1234567890"
                    />
                  </div>
                )}

                <Button
                  onClick={handleUpdateStatus}
                  disabled={updating || newStatus === order.status}
                  className="w-full"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Wird aktualisiert...
                    </>
                  ) : (
                    "Status aktualisieren"
                  )}
                </Button>

                {successMessage && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-600">
                    {successMessage}
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
