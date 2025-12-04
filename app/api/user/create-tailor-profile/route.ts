import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/app/lib/prisma";

/**
 * POST /api/user/create-tailor-profile
 * Creates a tailor profile for the authenticated user if they don't have one
 * This is a utility endpoint to fix users who registered as tailors before
 * the automatic profile creation was implemented
 */
export async function POST(request: NextRequest) {
  try {
    // Auth check with Supabase
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user exists and has tailor role
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { tailor: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (dbUser.role !== "tailor") {
      return NextResponse.json(
        { error: "User is not a tailor" },
        { status: 400 }
      );
    }

    // Check if tailor profile already exists
    if (dbUser.tailor) {
      return NextResponse.json(
        {
          message: "Tailor profile already exists",
          tailor: dbUser.tailor,
        },
        { status: 200 }
      );
    }

    // Create tailor profile
    const newTailor = await prisma.tailor.create({
      data: {
        user_id: dbUser.id,
        name: dbUser.email.split("@")[0], // Default name from email
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

    return NextResponse.json(
      {
        message: "Tailor profile created successfully",
        tailor: newTailor,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create tailor profile error:", error);
    return NextResponse.json(
      { error: "Failed to create tailor profile" },
      { status: 500 }
    );
  }
}
