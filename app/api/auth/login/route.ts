import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { loginSchema } from "@/app/lib/validations";
import { ZodError } from "zod";
import { prisma } from "@/app/lib/prisma";
import { checkRateLimitForRequest } from "@/app/lib/middleware/rateLimitMiddleware";
import { RATE_LIMITS } from "@/app/lib/rateLimit";

export async function POST(request: NextRequest) {
  // Check rate limit (5 requests per 15 minutes)
  const rateLimitResponse = checkRateLimitForRequest(request, RATE_LIMITS.LOGIN);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    const validatedData = loginSchema.parse(body);

    // Create server-side Supabase client (handles cookies)
    const supabase = await createClient();

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error) {
      // Invalid credentials
      return NextResponse.json(
        { error: "Ungültige Anmeldedaten" },
        { status: 401 }
      );
    }

    if (!data.user || !data.session) {
      return NextResponse.json(
        { error: "Anmeldung fehlgeschlagen" },
        { status: 401 }
      );
    }

    // Load user role from database
    const dbUser = await prisma.user.findUnique({
      where: { id: data.user.id },
      select: { role: true, tailor: true },
    });

    // If user is a tailor but doesn't have a tailor profile, create one
    if (dbUser?.role === "tailor" && !dbUser.tailor) {
      await prisma.tailor.create({
        data: {
          user_id: data.user.id,
          name: data.user.email?.split("@")[0] || "Schneider",
          bio: "",
          country: "",
          languages: [],
          rating: 0,
          totalOrders: 0,
          yearsExperience: 0,
          specialties: [],
          isVerified: false,
        },
      });
    }

    // Return user and session data (browser client needs access token)
    return NextResponse.json(
      {
        user: {
          id: data.user.id,
          email: data.user.email,
          role: dbUser?.role || "customer",
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // Validation error
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validierungsfehler",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 422 }
      );
    }

    // Generic error
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}
