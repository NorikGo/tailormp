import { NextResponse } from "next/server";
import { getAuthenticatedUser, getPrismaUser } from "@/app/lib/auth-helpers";

/**
 * GET /api/user/me
 * Returns the current authenticated user with role and tailor info
 */
export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prismaUser = await getPrismaUser(user.id);

    if (!prismaUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user with role and tailor info
    return NextResponse.json({
      id: prismaUser.id,
      email: prismaUser.email,
      role: prismaUser.role,
      firstName: prismaUser.firstName,
      lastName: prismaUser.lastName,
      tailor: prismaUser.tailor
        ? {
            id: prismaUser.tailor.id,
            name: prismaUser.tailor.name,
            isVerified: prismaUser.tailor.isVerified,
          }
        : null,
    });
  } catch (error) {
    // console.error("Error fetching current user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
