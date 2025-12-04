"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import type { User, AuthState, UserRole } from "@/app/types/auth";

function getStoredUser(): User | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storageKey = `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`;
    const storedSession = localStorage.getItem(storageKey);

    if (storedSession) {
      const session = JSON.parse(storedSession);
      if (session.user) {
        return {
          id: session.user.id,
          email: session.user.email,
          role: session.user.role || "customer",
        };
      }
    }
  } catch (err) {
    console.error("Failed to get stored user:", err);
  }

  return null;
}

export function useAuth() {
  // Initialize with stored session (synchronous check from localStorage)
  const [state, setState] = useState<AuthState>(() => {
    const storedUser = getStoredUser();

    if (storedUser) {
      console.log("useAuth: Initializing with stored user:", storedUser.email);
      return { user: storedUser, loading: false, error: null };
    }

    console.log("useAuth: No stored user, starting with loading state");
    return { user: null, loading: true, error: null };
  });

  // Check auth status on mount
  useEffect(() => {
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadUserData(session.user.id);
        } else {
          setState({ user: null, loading: false, error: null });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      const { data: authUser } = await supabase.auth.getUser();

      if (!authUser.user) {
        setState({ user: null, loading: false, error: null });
        return;
      }

      // Load user role from database
      const response = await fetch(`/api/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to load user data');
      }

      const userData = await response.json();

      const user: User = {
        id: authUser.user.id,
        email: authUser.user.email || "",
        role: userData.role || "customer",
      };

      setState({ user, loading: false, error: null });
    } catch (error) {
      console.error("Error loading user data:", error);
      setState({ user: null, loading: false, error: "Fehler beim Laden der Benutzerdaten" });
    }
  };

  const checkAuth = async () => {
    try {
      console.log("checkAuth: Starting");

      // Don't set loading to true if we already have a user from initial state
      // This prevents UI flicker during navigation
      setState((prev) => {
        if (prev.user) {
          console.log("checkAuth: Skipping loading state, user already exists");
          return prev;
        }
        return { ...prev, loading: true };
      });

      // First try to get session from localStorage directly
      const storageKey = `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`;
      const storedSession = localStorage.getItem(storageKey);

      console.log("checkAuth: Stored session exists:", !!storedSession);

      if (storedSession) {
        try {
          const session = JSON.parse(storedSession);
          console.log("checkAuth: Found session in localStorage", { hasUser: !!session.user });

          if (session.user) {
            // Don't use role from localStorage - always fetch from DB
            console.log("checkAuth: Found session in localStorage, loading from DB...");
            await loadUserData(session.user.id);
            return;
          }
        } catch (err) {
          console.error("checkAuth: Failed to parse stored session:", err);
        }
      }

      // If no valid session in localStorage, try Supabase methods
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("checkAuth: Session error:", sessionError);
      }

      if (session?.user) {
        console.log("checkAuth: User found via getSession");
        await loadUserData(session.user.id);
      } else {
        // Try to refresh session from cookies via API
        const { data: { user: refreshedUser } } = await supabase.auth.getUser();

        if (refreshedUser) {
          console.log("checkAuth: User found via getUser");
          await loadUserData(refreshedUser.id);
        } else {
          console.log("checkAuth: No user found");
          setState({ user: null, loading: false, error: null });
        }
      }
    } catch (error) {
      console.error("checkAuth: Error:", error);
      setState({ user: null, loading: false, error: "Authentifizierungsfehler" });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log("Login: Starting login process");
      setState((prev) => ({ ...prev, loading: true, error: null }));

      // First: Login via API to set server-side cookies
      console.log("Login: Calling API");
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      console.log("Login: API response status:", response.status);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Login fehlgeschlagen");
      }

      const result = await response.json();
      console.log("Login: API result:", { hasUser: !!result.user });

      // Second: Also login on client-side to sync localStorage
      console.log("Login: Syncing client session");
      const { error: clientError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (clientError) {
        console.error("Login: Client sync error:", clientError);
        // Don't throw - server-side login succeeded, client sync is optional
      }

      // Set user state
      if (result.user) {
        const user: User = {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role || "customer",
        };
        setState({ user, loading: false, error: null });
        console.log("Login: Login successful!");
      } else {
        throw new Error("Keine Benutzerdaten erhalten");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Login fehlgeschlagen",
      }));
      throw error;
    }
  };

  const register = async (email: string, password: string, role: UserRole) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // TODO: Create user in database with role when User table is ready
      // For now, user will be created via API route

      setState((prev) => ({
        ...prev,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      console.error("Register error:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Registrierung fehlgeschlagen",
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      setState({ user: null, loading: false, error: null });
    } catch (error: any) {
      console.error("Logout error:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Logout fehlgeschlagen",
      }));
      throw error;
    }
  };

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    checkAuth,
  };
}
