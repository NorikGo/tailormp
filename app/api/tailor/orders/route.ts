import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/tailor/orders
 * Get all orders for the authenticated tailor
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    // Get user from database to verify tailor role
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true, tailor: { select: { id: true } } },
    });

    if (!dbUser || dbUser.role !== "tailor" || !dbUser.tailor) {
      return NextResponse.json({ error: "Zugriff verweigert" }, { status: 403 });
    }

    // Get all orders for this tailor's products
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            tailorId: dbUser.tailor.id,
          },
        },
      },
      include: {
        user: {
          select: {
            email: true,
            fullName: true,
            firstName: true,
            lastName: true,
          },
        },
        items: {
          where: {
            tailorId: dbUser.tailor.id,
          },
          include: {
            product: {
              select: {
                title: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching tailor orders:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Bestellungen" },
      { status: 500 }
    );
  }
}
