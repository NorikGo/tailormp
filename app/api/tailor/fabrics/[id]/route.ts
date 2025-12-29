import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { createClient } from "@/utils/supabase/server";

async function checkTailorAuth() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { authorized: false, tailorId: null };
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true, tailor: true },
  });

  if (!dbUser || dbUser.role !== "tailor" || !dbUser.tailor) {
    return { authorized: false, tailorId: null };
  }

  return { authorized: true, tailorId: dbUser.tailor.id };
}

// DELETE - Remove fabric from tailor's availability
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, tailorId } = await checkTailorAuth();

    if (!authorized || !tailorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: tailorFabricId } = await params;

    // Verify the tailor fabric belongs to this tailor
    const tailorFabric = await prisma.tailorFabric.findUnique({
      where: { id: tailorFabricId },
    });

    if (!tailorFabric) {
      return NextResponse.json(
        { error: "Fabric availability not found" },
        { status: 404 }
      );
    }

    if (tailorFabric.tailorId !== tailorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete the tailor fabric
    await prisma.tailorFabric.delete({
      where: { id: tailorFabricId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tailor fabric:", error);
    return NextResponse.json(
      { error: "Failed to delete fabric availability" },
      { status: 500 }
    );
  }
}
