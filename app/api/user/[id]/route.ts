import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/user/[id]
 * Get user data by ID (requires authentication)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { id } = await params;

    // Users can only access their own data (or admin later)
    if (authUser.id !== id) {
      return NextResponse.json({ error: "Zugriff verweigert" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        fullName: true,
        shippingAddress: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Benutzer nicht gefunden" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    // console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Benutzerdaten" },
      { status: 500 }
    );
  }
}
