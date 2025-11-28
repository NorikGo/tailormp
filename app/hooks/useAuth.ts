"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import type { User, AuthState, UserRole } from "@/app/types/auth";

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
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

      // TODO: Load user data from database when User table is ready
      // For now, we create a basic user object
      const user: User = {
        id: authUser.user.id,
        email: authUser.user.email || "",
        role: "customer", // Default role, will be loaded from DB later
      };

      setState({ user, loading: false, error: null });
    } catch (error) {
      console.error("Error loading user data:", error);
      setState({ user: null, loading: false, error: "Fehler beim Laden der Benutzerdaten" });
    }
  };

  const checkAuth = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));

      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        await loadUserData(session.user.id);
      } else {
        setState({ user: null, loading: false, error: null });
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setState({ user: null, loading: false, error: "Authentifizierungsfehler" });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await loadUserData(data.user.id);
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
