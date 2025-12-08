import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { newEmail, password } = await request.json();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
    }

    // Validate new email
    if (!newEmail || !newEmail.includes("@")) {
      return NextResponse.json({ error: "Ungültige Email-Adresse" }, { status: 400 });
    }

    // Verify current password by attempting to sign in
    const { error: passwordError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password,
    });

    if (passwordError) {
      return NextResponse.json({ error: "Falsches Passwort" }, { status: 401 });
    }

    // Update email (requires email confirmation)
    const { error: updateError } = await supabase.auth.updateUser({
      email: newEmail,
    });

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || "Email-Änderung fehlgeschlagen" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Email-Änderung angefordert. Bitte bestätigen Sie Ihre neue Email-Adresse.",
    });
  } catch (error) {
    // console.error("Email update error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
