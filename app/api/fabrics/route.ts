import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const activeOnly = searchParams.get("active") === "true";

    const fabrics = await prisma.fabric.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: [{ position: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ fabrics });
  } catch (error) {
    console.error("Error fetching fabrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch fabrics" },
      { status: 500 }
    );
  }
}
