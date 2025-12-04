"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/app/contexts/AuthContext";
import { CartIcon } from "@/app/components/cart/CartIcon";

// ═══════════════════════════════════════════════════════════════════════════
// MobileNav Component
// ═══════════════════════════════════════════════════════════════════════════

interface MobileNavProps {
  isAuthenticated: boolean;
}

export function MobileNav({ isAuthenticated }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/tailors", label: "Schneider" },
    { href: "/products", label: "Produkte" },
    { href: "/about", label: "Über uns" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="md:hidden flex items-center gap-2">
      {/* Cart Icon (visible on mobile) */}
      {isAuthenticated && <CartIcon />}

      {/* Menu Button */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="text-2xl font-bold text-slate-900 mb-8"
            >
              TailorMarket
            </Link>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-4 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-lg text-slate-700 hover:text-slate-900 transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="border-t my-4" />

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  asChild
                >
                  <Link href="/dashboard" onClick={() => setOpen(false)}>
                    <User size={18} />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  asChild
                >
                  <Link
                    href={user?.role === "tailor" ? "/tailor/profile/edit" : "/profile"}
                    onClick={() => setOpen(false)}
                  >
                    <User size={18} />
                    Profil
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  Abmelden
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Button variant="outline" asChild>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/register" onClick={() => setOpen(false)}>
                    Registrieren
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
