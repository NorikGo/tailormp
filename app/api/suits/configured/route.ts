import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { SUIT_MODELS } from "@/app/lib/constants/suit-models";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { configuration, price } = body;

    if (!configuration || !price) {
      return NextResponse.json(
        { error: "Configuration and price are required" },
        { status: 400 }
      );
    }

    // Validate configuration
    const model = SUIT_MODELS.find((m) => m.id === configuration.modelId);
    if (!model) {
      return NextResponse.json({ error: "Invalid suit model" }, { status: 400 });
    }

    // Get fabric
    const fabric = await prisma.fabric.findUnique({
      where: { id: configuration.fabricId },
    });

    if (!fabric) {
      return NextResponse.json({ error: "Invalid fabric" }, { status: 400 });
    }

    // For now, we'll create a product without a specific tailor
    // In a real implementation, you would assign a tailor based on fabric availability
    // For demo purposes, get the first available tailor
    const tailor = await prisma.tailor.findFirst({
      where: { isActive: true },
    });

    if (!tailor) {
      return NextResponse.json(
        { error: "No tailors available at the moment" },
        { status: 400 }
      );
    }

    // Create a configured suit product
    const product = await prisma.product.create({
      data: {
        title: `${model.name} - ${fabric.name}`,
        description: `Maßgefertigter ${model.name} in ${fabric.name}. Individuell konfiguriert.`,
        price: price,
        category: "suit",
        isActive: true,
        tailorId: tailor.id,

        // Suit-specific fields
        suitModel: configuration.modelId,
        fabricId: configuration.fabricId,
        fitType: configuration.fitType || "regular",
        lapelStyle: configuration.lapelStyle || "notch",
        ventStyle: configuration.ventStyle || "single",
        buttonCount: configuration.buttonCount || 2,
        pocketStyle: configuration.pocketStyle || "flap",

        // Store full configuration in customizationOptions
        customizationOptions: {
          configuration: configuration,
          configuredAt: new Date().toISOString(),
          configuredBy: dbUser.id,
        },
      },
    });

    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        title: product.title,
        price: product.price,
      },
    });
  } catch (error) {
    console.error("Error creating configured suit:", error);
    return NextResponse.json(
      { error: "Failed to create configured suit" },
      { status: 500 }
    );
  }
}
