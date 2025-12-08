import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/app/lib/prisma";
import { registerSchema } from "@/app/lib/validations";
import { ZodError } from "zod";
import { sendWelcomeEmail } from "@/app/lib/email";
import { checkRateLimitForRequest } from "@/app/lib/middleware/rateLimitMiddleware";
import { RATE_LIMITS } from "@/app/lib/rateLimit";

export async function POST(request: NextRequest) {
  // Check rate limit (3 requests per hour)
  const rateLimitResponse = checkRateLimitForRequest(request, RATE_LIMITS.REGISTER);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    const validatedData = registerSchema.parse(body);

    // Get the origin for the callback URL
    const origin = request.headers.get("origin") || "http://localhost:3000";

    // Create server-side Supabase client (handles cookies)
    const supabase = await createClient();

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Registrierung fehlgeschlagen" },
        { status: 400 }
      );
    }

    // Create user in database
    try {
      const newUser = await prisma.user.create({
        data: {
          id: authData.user.id,
          email: validatedData.email,
          password: "", // Password is managed by Supabase Auth
          role: validatedData.role,
        },
      });

      // If role is tailor, create tailor profile automatically
      if (validatedData.role === "tailor") {
        await prisma.tailor.create({
          data: {
            user_id: newUser.id,
            name: validatedData.email.split("@")[0], // Default name from email
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
    } catch (dbError: any) {
      // console.error("Database error:", dbError);

      // If user creation fails, we should clean up the Supabase auth user
      // This is a TODO for production - need to handle this properly

      return NextResponse.json(
        { error: "Fehler beim Erstellen des Benutzers" },
        { status: 500 }
      );
    }

    // Send welcome email (don't await - fire and forget)
    sendWelcomeEmail({
      userEmail: validatedData.email,
      userName: validatedData.email.split("@")[0],
    }).catch((error) => {
      // console.error("Failed to send welcome email:", error);
      // Don't fail registration if email fails
    });

    return NextResponse.json(
      {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          role: validatedData.role,
        },
        message: "Registrierung erfolgreich. Bitte bestätige deine E-Mail-Adresse.",
      },
      { status: 201 }
    );
  } catch (error) {
    // Validation error
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validierungsfehler",
          details: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 422 }
      );
    }

    // Generic error
    // console.error("Register error:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}
