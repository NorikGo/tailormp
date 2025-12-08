"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/hooks/useCart";
import { useAuth } from "@/app/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

interface CartButtonProps {
  productId: string;
  productTitle: string;
  measurementSessionId?: string;
  quantity?: number;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

// ═══════════════════════════════════════════════════════════════════════════
// CartButton Component
// ═══════════════════════════════════════════════════════════════════════════

export function CartButton({
  productId,
  productTitle,
  measurementSessionId,
  quantity = 1,
  className,
  disabled = false,
  variant = "default",
  size = "default",
}: CartButtonProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart, cart } = useCart();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  // Check if product is already in cart
  const isInCart = cart?.items.some((item) => item.productId === productId);

  // ───────────────────────────────────────────
  // Handle Add to Cart
  // ───────────────────────────────────────────
  const handleAddToCart = async () => {
    // Check if user is logged in
    if (!user) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Bitte melden Sie sich an, um Produkte in den Warenkorb zu legen.",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    // Check if already in cart
    if (isInCart) {
      toast({
        title: "Bereits im Warenkorb",
        description: "Dieses Produkt befindet sich bereits in Ihrem Warenkorb.",
      });
      router.push("/cart");
      return;
    }

    setIsAdding(true);

    try {
      await addToCart({
        productId,
        measurementSessionId,
        quantity,
      });

      toast({
        title: "Zum Warenkorb hinzugefügt",
        description: `${productTitle} wurde zu Ihrem Warenkorb hinzugefügt.`,
      });
    } catch (error) {
      // console.error("Add to cart error:", error);

      toast({
        title: "Fehler",
        description:
          error instanceof Error
            ? error.message
            : "Produkt konnte nicht zum Warenkorb hinzugefügt werden.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || isAdding || isInCart}
      variant={variant}
      size={size}
      className={className}
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      {isAdding
        ? "Wird hinzugefügt..."
        : isInCart
          ? "Im Warenkorb"
          : "In den Warenkorb"}
    </Button>
  );
}
