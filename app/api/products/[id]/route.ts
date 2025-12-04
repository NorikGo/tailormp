import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        tailor: {
          select: {
            id: true,
            name: true,
            country: true,
            rating: true,
            isVerified: true,
            yearsExperience: true,
            totalOrders: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produkt nicht gefunden" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Product API error:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden des Produkts" },
      { status: 500 }
    );
  }
}
