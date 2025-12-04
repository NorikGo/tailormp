"use client";

import { createContext, useContext, ReactNode } from "react";
import { useAuth as useAuthHook } from "@/app/hooks/useAuth";
import type { User, UserRole } from "@/app/types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  // Role helpers
  isCustomer: boolean;
  isTailor: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthHook();

  // Role helpers
  const isCustomer = auth.user?.role === "customer";
  const isTailor = auth.user?.role === "tailor";
  const isAdmin = auth.user?.role === "admin";

  const value: AuthContextType = {
    ...auth,
    isCustomer,
    isTailor,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
