/**
 * Client-Side Auth Helpers
 * Für die Verwendung in React Components (Client Components)
 */

import { supabase } from "@/app/lib/supabaseClient";

/**
 * Gets the current authenticated user (Client-Side)
 */
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Creates auth headers for API calls from client components
 * Usage: fetch('/api/endpoint', { headers: await getClientAuthHeaders() })
 *
 * HINWEIS: Diese Funktion holt sich die User-Daten vom Client
 * und sendet sie als Header mit. Die API muss diese validieren!
 */
export async function getClientAuthHeaders(): Promise<Record<string, string>> {
  const user = await getCurrentUser();
  if (!user) {
    return {};
  }

  // Hole die Prisma-User-Daten um die Rolle zu ermitteln
  // Dies ist ein zusätzlicher API-Call, aber notwendig für die Rolle
  try {
    const response = await fetch("/api/user/me");
    if (!response.ok) {
      return {
        "x-user-id": user.id,
        "x-user-role": "customer", // Default
      };
    }

    const data = await response.json();
    return {
      "x-user-id": user.id,
      "x-user-role": data.role || "customer",
    };
  } catch (error) {
    console.error("Failed to fetch user role:", error);
    return {
      "x-user-id": user.id,
      "x-user-role": "customer", // Fallback
    };
  }
}

/**
 * Einfachere Version: Nutzt nur Supabase User ID
 * API Routes müssen die Rolle selbst aus der DB holen
 */
export async function getSimpleAuthHeaders(): Promise<Record<string, string>> {
  const user = await getCurrentUser();
  if (!user) {
    return {};
  }

  return {
    "x-user-id": user.id,
  };
}
