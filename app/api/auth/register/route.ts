import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";
import { prisma } from "@/app/lib/prisma";
import { registerSchema } from "@/app/lib/validations";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    const validatedData = registerSchema.parse(body);

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
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
      await prisma.user.create({
        data: {
          id: authData.user.id,
          email: validatedData.email,
          password: "", // Password is managed by Supabase Auth
          role: validatedData.role,
        },
      });
    } catch (dbError: any) {
      console.error("Database error:", dbError);

      // If user creation fails, we should clean up the Supabase auth user
      // This is a TODO for production - need to handle this properly

      return NextResponse.json(
        { error: "Fehler beim Erstellen des Benutzers" },
        { status: 500 }
      );
    }

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
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 422 }
      );
    }

    // Generic error
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}
