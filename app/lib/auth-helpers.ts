import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import prisma from "./prisma";

/**
 * Ensures a Supabase user exists in the Prisma database
 * This is needed because users are created in Supabase first,
 * but we need them in Prisma for relations (cart, orders, etc.)
 */
export async function ensureUserInPrisma(supabaseUser: User): Promise<void> {
  try {
    await prisma.user.upsert({
      where: { id: supabaseUser.id },
      update: {
        email: supabaseUser.email!,
      },
      create: {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        password: "", // Supabase handles authentication
        role: "customer", // Default role
      },
    });
  } catch (error) {
    // console.error("Failed to sync user to Prisma:", error);
    throw new Error("Failed to sync user data");
  }
}

/**
 * Gets the authenticated user from Supabase and ensures they exist in Prisma
 * Returns null if not authenticated
 */
export async function getAuthenticatedUser(): Promise<User | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    // Ensure user exists in Prisma DB
    await ensureUserInPrisma(user);

    return user;
  } catch (error) {
    // console.error("Authentication error:", error);
    return null;
  }
}

/**
 * Gets the authenticated user and throws an error if not authenticated
 * Useful for API routes that require authentication
 */
export async function requireAuth(): Promise<User> {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

/**
 * Gets the Prisma user with role information
 * Returns null if not authenticated or user not found
 */
export async function getPrismaUser(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tailor: true,
      },
    });
    return user;
  } catch (error) {
    // console.error("Failed to get Prisma user:", error);
    return null;
  }
}

/**
 * Checks if the authenticated user is a tailor
 * Returns tailor ID or null
 */
export async function getTailorId(): Promise<string | null> {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const prismaUser = await getPrismaUser(user.id);
  return prismaUser?.tailor?.id || null;
}

/**
 * Creates auth headers for internal API calls (Client-Side)
 * Usage: fetch('/api/endpoint', { headers: await getAuthHeaders() })
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return {};
  }

  const prismaUser = await getPrismaUser(user.id);

  return {
    "x-user-id": user.id,
    "x-user-role": prismaUser?.role || "customer",
  };
}

/**
 * Gets the authenticated user with full role information
 * Returns null if not authenticated
 */
export async function getUserWithRole() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const prismaUser = await getPrismaUser(user.id);
  if (!prismaUser) return null;

  return {
    id: prismaUser.id,
    email: prismaUser.email,
    role: prismaUser.role as "customer" | "tailor" | "admin",
    tailor: prismaUser.tailor,
  };
}

/**
 * Require user to be a customer
 * Throws error if not authenticated or not a customer
 */
export async function requireCustomer() {
  const userWithRole = await getUserWithRole();

  if (!userWithRole) {
    throw new Error("Unauthorized");
  }

  if (userWithRole.role !== "customer") {
    throw new Error("Customer role required");
  }

  return userWithRole;
}

/**
 * Require user to be a tailor
 * Throws error if not authenticated or not a tailor
 */
export async function requireTailor() {
  const userWithRole = await getUserWithRole();

  if (!userWithRole) {
    throw new Error("Unauthorized");
  }

  if (userWithRole.role !== "tailor") {
    throw new Error("Tailor role required");
  }

  if (!userWithRole.tailor) {
    throw new Error("Tailor profile not found");
  }

  return {
    ...userWithRole,
    tailor: userWithRole.tailor!,
  };
}

/**
 * Require user to be an admin
 * Throws error if not authenticated or not an admin
 */
export async function requireAdmin() {
  const userWithRole = await getUserWithRole();

  if (!userWithRole) {
    throw new Error("Unauthorized");
  }

  if (userWithRole.role !== "admin") {
    throw new Error("Admin role required");
  }

  return userWithRole;
}
