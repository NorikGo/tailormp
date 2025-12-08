"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, BadgeCheck, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/app/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/app/contexts/AuthContext";
import MeasurementButton from "@/app/components/measurement/MeasurementButton";
import type { CartItem as CartItemType } from "@/app/hooks/useCart";

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

interface CartItemProps {
  item: CartItemType;
}

// ═══════════════════════════════════════════════════════════════════════════
// CartItem Component
// ═══════════════════════════════════════════════════════════════════════════

export function CartItem({ item }: CartItemProps) {
  const { user } = useAuth();
  const { updateCartItem, removeFromCart } = useCart();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const imageUrl =
    item.product.images[0]?.url || "/images/placeholder-product.jpg";
  const itemTotal = item.priceAtAdd * item.quantity;

  // ───────────────────────────────────────────
  // Handle Quantity Update
  // ───────────────────────────────────────────
  const handleQuantityUpdate = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 10) return;
    if (newQuantity === item.quantity) return;

    setIsUpdating(true);

    try {
      await updateCartItem(item.id, { quantity: newQuantity });

      toast({
        title: "Menge aktualisiert",
        description: `Menge wurde auf ${newQuantity} geändert.`,
      });
    } catch (error) {
      // console.error("Update quantity error:", error);

      toast({
        title: "Fehler",
        description: "Menge konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // ───────────────────────────────────────────
  // Handle Remove
  // ───────────────────────────────────────────
  const handleRemove = async () => {
    setIsRemoving(true);

    try {
      await removeFromCart(item.id);

      toast({
        title: "Entfernt",
        description: `${item.product.title} wurde aus dem Warenkorb entfernt.`,
      });
    } catch (error) {
      // console.error("Remove from cart error:", error);

      toast({
        title: "Fehler",
        description: "Produkt konnte nicht entfernt werden.",
        variant: "destructive",
      });

      setIsRemoving(false);
    }
  };

  return (
    <div className="flex gap-4 py-6 border-b last:border-b-0">
      {/* Product Image */}
      <Link
        href={`/products/${item.productId}`}
        className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border bg-slate-100"
      >
        <Image
          src={imageUrl}
          alt={item.product.title}
          fill
          className="object-cover"
        />
      </Link>

      {/* Product Details */}
      <div className="flex flex-1 flex-col gap-2">
        {/* Title & Tailor */}
        <div className="flex-1">
          <Link
            href={`/products/${item.productId}`}
            className="font-medium text-slate-900 hover:text-slate-700 transition-colors line-clamp-2"
          >
            {item.product.title}
          </Link>

          <Link
            href={`/tailors/${item.tailorId}`}
            className="text-sm text-slate-600 hover:text-slate-800 transition-colors flex items-center gap-1 mt-1"
          >
            {item.product.tailor.name}
            {item.product.tailor.isVerified && (
              <BadgeCheck className="h-3.5 w-3.5 text-blue-600" />
            )}
          </Link>
        </div>

        {/* Price */}
        <div className="text-sm text-slate-600">
          Preis: {item.priceAtAdd.toFixed(2)} €
        </div>

        {/* Measurement Status */}
        {item.measurementSession ? (
          <div className="text-sm">
            {item.measurementSession.status === "completed" ? (
              <span className="text-green-600 font-medium flex items-center gap-1">
                <Ruler className="h-3.5 w-3.5" />
                Maße vorhanden
              </span>
            ) : (
              <span className="text-orange-600 font-medium">
                ⚠ Maße unvollständig
              </span>
            )}
          </div>
        ) : user ? (
          <div className="text-sm">
            <MeasurementButton
              userId={user.id}
              onComplete={async (sessionId) => {
                // Update cart item with measurement session
                try {
                  await updateCartItem(item.id, {
                    measurementSessionId: sessionId,
                  });
                  toast({
                    title: "Maße hinzugefügt",
                    description: "Die Maße wurden erfolgreich zum Artikel hinzugefügt.",
                  });
                } catch (error) {
                  // console.error("Failed to update cart item with measurements:", error);
                  toast({
                    title: "Fehler",
                    description: "Maße konnten nicht hinzugefügt werden.",
                    variant: "destructive",
                  });
                }
              }}
              variant="secondary"
              className="!px-3 !py-1.5 !text-sm !font-medium"
            />
          </div>
        ) : null}

        {/* Notes */}
        {item.notes && (
          <div className="text-sm text-slate-600 italic">
            Notiz: {item.notes}
          </div>
        )}
      </div>

      {/* Quantity & Actions */}
      <div className="flex flex-col items-end justify-between">
        {/* Item Total */}
        <div className="font-semibold text-slate-900">
          {itemTotal.toFixed(2)} €
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleQuantityUpdate(item.quantity - 1)}
            disabled={isUpdating || item.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>

          <Input
            type="number"
            min="1"
            max="10"
            value={item.quantity}
            onChange={(e) =>
              handleQuantityUpdate(parseInt(e.target.value) || 1)
            }
            disabled={isUpdating}
            className="h-8 w-14 text-center"
          />

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleQuantityUpdate(item.quantity + 1)}
            disabled={isUpdating || item.quantity >= 10}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          disabled={isRemoving}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Entfernen
        </Button>
      </div>
    </div>
  );
}
