"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/app/hooks/useCart";

export function CartIcon() {
  const { itemCount, isLoading } = useCart();

  return (
    <Link href="/cart">
      <Button
        variant="ghost"
        size="icon"
        className="relative h-10 w-10 touch-manipulation"
        aria-label={`Shopping cart with ${itemCount} items`}
      >
        <ShoppingCart className="h-5 w-5" />
        {!isLoading && itemCount > 0 && (
          <Badge
            variant="default"
            className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center p-0 px-1 text-xs font-bold rounded-full"
          >
            {itemCount > 9 ? "9+" : itemCount}
          </Badge>
        )}
      </Button>
    </Link>
  );
}
