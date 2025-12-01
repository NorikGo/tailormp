"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Package,
  MapPin,
  Truck,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
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

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/orders/${orderId}`, {
          headers: {
            "x-user-id": "dummy-user-id", // TODO: Replace with real auth
            "x-user-role": "customer",
          },
        });

        if (!response.ok) {
          throw new Error("Bestellung nicht gefunden");
        }

        const data = await response.json();
        setOrder(data.order);
      } catch (err: any) {
        console.error("Error fetching order:", err);
        setError(err.message || "Ein Fehler ist aufgetreten");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <Card className="border-red-200">
            <CardContent className="p-8 text-center">
              <p className="text-red-600 mb-4">
                {error || "Bestellung nicht gefunden"}
              </p>
              <Link href="/dashboard">
                <Button variant="outline">Zurück zum Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zu Bestellungen
            </Button>
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Bestellung Details
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="md:col-span-2 space-y-6">
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
                      <p className="text-sm text-slate-600 mt-2">
                        <strong>Stoff:</strong> {item.fabricChoice}
                      </p>
                    )}
                    {item.customNotes && (
                      <p className="text-sm text-slate-600 mt-2">
                        <strong>Notizen:</strong> {item.customNotes}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Info */}
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
                      <p className="mt-2">{order.shippingAddress.phone}</p>
                    )}
                  </div>
                  {order.trackingNumber && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-sm text-slate-600 mb-1">
                        Tracking Nummer
                      </p>
                      <p className="font-mono font-medium text-slate-900">
                        {order.trackingNumber}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Zahlungsübersicht</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Zwischensumme</span>
                  <span className="text-slate-900">
                    €
                    {order.items
                      .reduce((sum, item) => sum + item.subtotal, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-900">Gesamt</span>
                    <span className="font-bold text-slate-900 text-lg">
                      €{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-200 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Zahlungsart</span>
                    <span>Kreditkarte</span>
                  </div>
                  {order.paidAt && (
                    <div className="flex justify-between mt-1">
                      <span>Bezahlt am</span>
                      <span>
                        {new Date(order.paidAt).toLocaleDateString("de-DE")}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        order.paidAt ? "bg-green-100" : "bg-slate-100"
                      }`}
                    >
                      <CheckCircle
                        className={`w-5 h-5 ${
                          order.paidAt ? "text-green-600" : "text-slate-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        Bezahlt
                      </p>
                      {order.paidAt && (
                        <p className="text-xs text-slate-500">
                          {new Date(order.paidAt).toLocaleDateString("de-DE")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        order.status === "processing" ||
                        order.status === "shipped" ||
                        order.status === "completed"
                          ? "bg-blue-100"
                          : "bg-slate-100"
                      }`}
                    >
                      <Package
                        className={`w-5 h-5 ${
                          order.status === "processing" ||
                          order.status === "shipped" ||
                          order.status === "completed"
                            ? "text-blue-600"
                            : "text-slate-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        In Bearbeitung
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        order.shippedAt ? "bg-purple-100" : "bg-slate-100"
                      }`}
                    >
                      <Truck
                        className={`w-5 h-5 ${
                          order.shippedAt ? "text-purple-600" : "text-slate-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        Versendet
                      </p>
                      {order.shippedAt && (
                        <p className="text-xs text-slate-500">
                          {new Date(order.shippedAt).toLocaleDateString("de-DE")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
