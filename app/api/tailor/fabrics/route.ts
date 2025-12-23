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

// GET - Fetch all fabrics with tailor's availability status
export async function GET(request: NextRequest) {
  try {
    const { authorized, tailorId } = await checkTailorAuth();

    if (!authorized || !tailorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all active fabrics from library
    const allFabrics = await prisma.fabric.findMany({
      where: { isActive: true },
      orderBy: [{ position: "asc" }, { name: "asc" }],
    });

    // Get tailor's fabric selections
    const tailorFabrics = await prisma.tailorFabric.findMany({
      where: { tailorId },
      include: { fabric: true },
    });

    // Create a map for quick lookup
    const tailorFabricMap = new Map(
      tailorFabrics.map((tf) => [tf.fabricId, tf])
    );

    // Merge the data
    const fabricsWithAvailability = allFabrics.map((fabric) => {
      const tailorFabric = tailorFabricMap.get(fabric.id);
      return {
        ...fabric,
        tailorFabric: tailorFabric
          ? {
              id: tailorFabric.id,
              isAvailable: tailorFabric.isAvailable,
              stockQuantity: tailorFabric.stockQuantity,
              customPriceAdd: tailorFabric.customPriceAdd,
            }
          : null,
      };
    });

    return NextResponse.json({ fabrics: fabricsWithAvailability });
  } catch (error) {
    console.error("Error fetching tailor fabrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch fabrics" },
      { status: 500 }
    );
  }
}

// POST - Add or update tailor fabric availability
export async function POST(request: NextRequest) {
  try {
    const { authorized, tailorId } = await checkTailorAuth();

    if (!authorized || !tailorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fabricId, isAvailable, stockQuantity, customPriceAdd } =
      await request.json();

    if (!fabricId) {
      return NextResponse.json(
        { error: "Fabric ID is required" },
        { status: 400 }
      );
    }

    // Check if fabric exists
    const fabric = await prisma.fabric.findUnique({
      where: { id: fabricId },
    });

    if (!fabric) {
      return NextResponse.json(
        { error: "Fabric not found" },
        { status: 404 }
      );
    }

    // Upsert tailor fabric
    const tailorFabric = await prisma.tailorFabric.upsert({
      where: {
        tailorId_fabricId: {
          tailorId,
          fabricId,
        },
      },
      update: {
        isAvailable: isAvailable ?? true,
        stockQuantity: stockQuantity ?? null,
        customPriceAdd: customPriceAdd ?? null,
      },
      create: {
        tailorId,
        fabricId,
        isAvailable: isAvailable ?? true,
        stockQuantity: stockQuantity ?? null,
        customPriceAdd: customPriceAdd ?? null,
      },
    });

    return NextResponse.json({
      success: true,
      tailorFabric,
    });
  } catch (error) {
    console.error("Error updating tailor fabric:", error);
    return NextResponse.json(
      { error: "Failed to update fabric availability" },
      { status: 500 }
    );
  }
}
