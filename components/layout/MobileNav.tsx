"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, Package, Scissors, Info, HelpCircle, User, ShoppingCart, LayoutDashboard, ShoppingBag, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/app/lib/utils";
import { useAuth } from "@/app/contexts/AuthContext";

interface MobileNavProps {
  isAuthenticated?: boolean;
  cartItemCount?: number;
}

export function MobileNav({ isAuthenticated = false, cartItemCount = 0 }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isCustomer, isTailor } = useAuth();

  // Navigation links based on user role
  const getNavigationLinks = () => {
    if (isTailor) {
      return [
        { href: "/tailor/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/tailor/products", label: "Produkte", icon: Package },
        { href: "/tailor/orders", label: "Bestellungen", icon: ShoppingBag },
        { href: "/tailor/analytics", label: "Einnahmen", icon: TrendingUp },
      ];
    }
    return [
      { href: "/", label: "Home", icon: Home },
      { href: "/products", label: "Produkte", icon: Package },
      { href: "/tailors", label: "Schneider", icon: Scissors },
      { href: "/about", label: "Über uns", icon: Info },
      { href: "/how-it-works", label: "Wie es funktioniert", icon: HelpCircle },
    ];
  };

  const navigationLinks = getNavigationLinks();

  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-left">
            <Link href="/" onClick={() => setOpen(false)} className="text-2xl font-bold text-blue-600">
              TailorMarket
            </Link>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-4 mt-8">
          {navigationLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}

          <div className="border-t pt-4 mt-4">
            {isAuthenticated ? (
              <>
                {isCustomer && (
                  <>
                    <Link
                      href="/cart"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Warenkorb
                      {cartItemCount > 0 && (
                        <span className="ml-auto bg-blue-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                          {cartItemCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-colors",
                        pathname.startsWith("/orders")
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-700 hover:bg-slate-100"
                      )}
                    >
                      <ShoppingBag className="h-5 w-5" />
                      Meine Bestellungen
                    </Link>
                  </>
                )}
                <Link
                  href={isTailor ? "/tailor/profile/edit" : "/profile"}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <User className="h-5 w-5" />
                  Profil
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full mb-2" size="lg">
                    Anmelden
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}>
                  <Button className="w-full" size="lg">
                    Registrieren
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
