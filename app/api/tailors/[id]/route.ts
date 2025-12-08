import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const tailor = await prisma.tailor.findUnique({
      where: { id },
      include: {
        products: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            category: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!tailor) {
      return NextResponse.json(
        { error: "Schneider nicht gefunden" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        tailor,
        products: tailor.products,
      },
      { status: 200 }
    );
  } catch (error) {
    // console.error("Tailor API error:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden des Schneiders" },
      { status: 500 }
    );
  }
}
