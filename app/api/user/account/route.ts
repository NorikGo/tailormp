import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/app/lib/prisma";

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
    }

    // Delete user from database
    // Note: Orders and Reviews will be kept but anonymized via cascade rules
    await prisma.user.delete({
      where: { id: user.id },
    });

    // Delete user from Supabase Auth
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

    if (deleteError) {
      // console.error("Supabase auth deletion error:", deleteError);
      // Continue anyway as DB user is already deleted
    }

    // Sign out
    await supabase.auth.signOut();

    return NextResponse.json({
      message: "Account erfolgreich gelöscht",
    });
  } catch (error) {
    // console.error("Account deletion error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
