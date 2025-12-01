"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2, Package, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Order } from "@/app/types/order";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Keine Session ID gefunden");
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        // Retrieve Stripe session to get order details
        const response = await fetch(
          `/api/checkout/session?session_id=${sessionId}`
        );

        if (!response.ok) {
          throw new Error("Bestellung konnte nicht geladen werden");
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

    fetchOrderDetails();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-slate-400 mb-4" />
          <p className="text-slate-600">Bestellung wird geladen...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <Card className="border-red-200">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Fehler beim Laden der Bestellung
              </h2>
              <p className="text-slate-600 mb-6">{error}</p>
              <div className="flex gap-3 justify-center">
                <Link href="/products">
                  <Button variant="outline">Zu Produkten</Button>
                </Link>
                <Link href="/dashboard">
                  <Button>Zum Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Bestellung erfolgreich!
          </h1>
          <p className="text-lg text-slate-600">
            Vielen Dank für deine Bestellung. Wir haben deine Zahlung erhalten.
          </p>
        </div>

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Bestellübersicht</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600">Bestellnummer</p>
                    <p className="font-medium text-slate-900">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Status</p>
                    <p className="font-medium text-green-600 capitalize">
                      {order.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600">Datum</p>
                    <p className="font-medium text-slate-900">
                      {new Date(order.createdAt).toLocaleDateString("de-DE")}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600">Gesamtbetrag</p>
                    <p className="font-medium text-slate-900">
                      €{order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-3">
                    Bestellte Artikel
                  </h4>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-start"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">
                            {item.productTitle}
                          </p>
                          {item.productDescription && (
                            <p className="text-sm text-slate-600">
                              {item.productDescription}
                            </p>
                          )}
                          <p className="text-sm text-slate-500">
                            Menge: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium text-slate-900">
                          €{item.subtotal.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="pt-4 border-t border-slate-200">
                    <h4 className="font-semibold text-slate-900 mb-2">
                      Lieferadresse
                    </h4>
                    <div className="text-sm text-slate-600">
                      <p>{order.shippingAddress.name}</p>
                      <p>{order.shippingAddress.street}</p>
                      <p>
                        {order.shippingAddress.zip} {order.shippingAddress.city}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                      {order.shippingAddress.phone && (
                        <p className="mt-1">{order.shippingAddress.phone}</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">
                      Wie geht es weiter?
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li>
                        • Du erhältst eine Bestätigungs-E-Mail mit allen Details
                      </li>
                      <li>
                        • Der Schneider wird über deine Bestellung informiert
                      </li>
                      <li>
                        • Du kannst den Status deiner Bestellung im Dashboard
                        verfolgen
                      </li>
                      <li>
                        • Bei Fragen kannst du dich direkt an den Schneider wenden
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard" className="flex-1">
                <Button className="w-full" size="lg">
                  Zum Dashboard
                </Button>
              </Link>
              <Link href="/products" className="flex-1">
                <Button variant="outline" className="w-full" size="lg">
                  Weiter einkaufen
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* No Order Data */}
        {!order && !error && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-slate-600 mb-4">
                Deine Zahlung wurde erfolgreich verarbeitet.
              </p>
              <Link href="/dashboard">
                <Button>Zu deinen Bestellungen</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
