"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { MobileNav } from "@/components/layout/MobileNav";
import { CartIcon } from "@/app/components/cart/CartIcon";
import { BRAND, TERMINOLOGY } from "@/app/lib/constants/brand";

export default function Header() {
  const { user, logout, loading, isCustomer, isTailor } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering auth UI after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Debug: Log user state changes
  useEffect(() => {
    // console.log("Header: user state changed:", { user: user?.email, loading, role: user?.role });
  }, [user, loading]);

  // Navigation links based on user role
  const getNavLinks = () => {
    if (isTailor) {
      return [
        { href: "/tailor/dashboard", label: "Dashboard" },
        { href: "/tailor/products", label: TERMINOLOGY.navProducts },
        { href: "/tailor/orders", label: "Bestellungen" },
        { href: "/tailor/analytics", label: "Analytics" },
      ];
    }
    return [
      { href: "/", label: "Home" },
      { href: "/tailors", label: TERMINOLOGY.navTailors },
      { href: "/products", label: TERMINOLOGY.navProducts },
      { href: "/about", label: TERMINOLOGY.navAbout },
    ];
  };

  const navLinks = getNavLinks();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      // console.error("Logout error:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu */}
          {mounted && <MobileNav isAuthenticated={!!user} />}

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-slate-900 hover:text-slate-700 transition-colors">
            {BRAND.name}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-700 hover:text-slate-600 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {mounted && !loading && isCustomer && <CartIcon />}
            {mounted && !loading && (user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <User size={18} />
                    <span className="hidden lg:inline">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {isTailor ? "Schneider-Konto" : "Mein Konto"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={isTailor ? "/tailor/profile/edit" : "/profile"}
                      className="cursor-pointer"
                    >
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={isTailor ? "/tailor/dashboard" : "/dashboard"}
                      className="cursor-pointer"
                    >
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {isCustomer && (
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="cursor-pointer">
                        Meine Bestellungen
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isTailor && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/tailor/products" className="cursor-pointer">
                          Meine Produkte
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/tailor/orders" className="cursor-pointer">
                          Bestellungen
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/tailor/analytics" className="cursor-pointer">
                          Analytics
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut size={16} className="mr-2" />
                    Abmelden
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Registrieren</Link>
                </Button>
              </>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
