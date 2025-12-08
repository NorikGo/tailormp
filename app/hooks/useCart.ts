import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  tailorId: string;
  measurementSessionId: string | null;
  priceAtAdd: number;
  quantity: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    title: string;
    price: number;
    description: string | null;
    category: string | null;
    isActive: boolean;
    tailor: {
      id: string;
      name: string;
      isVerified: boolean;
    };
    images: Array<{
      id: string;
      url: string;
      position: number;
    }>;
  };
  measurementSession: {
    id: string;
    status: string;
    measurements: any;
  } | null;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
  subtotal: number;
  platformFee: number;
  total: number;
  itemCount: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// useCart Hook
// ═══════════════════════════════════════════════════════════════════════════

export function useCart() {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ───────────────────────────────────────────
  // Fetch Cart
  // ───────────────────────────────────────────
  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      const data = await response.json();
      setCart(data.cart);
    } catch (err) {
      // console.error("Fetch cart error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch cart");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Fetch cart on mount and when user changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ───────────────────────────────────────────
  // Add to Cart
  // ───────────────────────────────────────────
  const addToCart = useCallback(
    async (data: {
      productId: string;
      measurementSessionId?: string;
      quantity?: number;
      notes?: string;
    }) => {
      if (!user) {
        throw new Error("You must be logged in to add items to cart");
      }

      try {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to add item to cart");
        }

        // Refresh cart
        await fetchCart();

        return result.cartItem;
      } catch (err) {
        // console.error("Add to cart error:", err);
        throw err;
      }
    },
    [user, fetchCart]
  );

  // ───────────────────────────────────────────
  // Update Cart Item
  // ───────────────────────────────────────────
  const updateCartItem = useCallback(
    async (
      itemId: string,
      data: {
        quantity?: number;
        notes?: string;
        measurementSessionId?: string | null;
      }
    ) => {
      if (!user) {
        throw new Error("You must be logged in");
      }

      try {
        const response = await fetch(`/api/cart/${itemId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to update cart item");
        }

        // Refresh cart
        await fetchCart();

        return result.cartItem;
      } catch (err) {
        // console.error("Update cart item error:", err);
        throw err;
      }
    },
    [user, fetchCart]
  );

  // ───────────────────────────────────────────
  // Remove from Cart
  // ───────────────────────────────────────────
  const removeFromCart = useCallback(
    async (itemId: string) => {
      if (!user) {
        throw new Error("You must be logged in");
      }

      try {
        const response = await fetch(`/api/cart/${itemId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to remove item from cart");
        }

        // Refresh cart
        await fetchCart();
      } catch (err) {
        // console.error("Remove from cart error:", err);
        throw err;
      }
    },
    [user, fetchCart]
  );

  // ───────────────────────────────────────────
  // Clear Cart
  // ───────────────────────────────────────────
  const clearCart = useCallback(async () => {
    if (!user) {
      throw new Error("You must be logged in");
    }

    try {
      const response = await fetch("/api/cart/clear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to clear cart");
      }

      // Refresh cart
      await fetchCart();
    } catch (err) {
      // console.error("Clear cart error:", err);
      throw err;
    }
  }, [user, fetchCart]);

  // ───────────────────────────────────────────
  // Return Hook Values
  // ───────────────────────────────────────────
  return {
    cart,
    isLoading,
    error,
    itemCount: cart?.itemCount || 0,
    subtotal: cart?.subtotal || 0,
    platformFee: cart?.platformFee || 0,
    total: cart?.total || 0,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refetch: fetchCart,
  };
}
