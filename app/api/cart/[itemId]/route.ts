import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/lib/auth-helpers";
import prisma from "@/app/lib/prisma";
import { z } from "zod";

// ═══════════════════════════════════════════════════════════════════════════
// DELETE /api/cart/[itemId] - Remove item from cart
// ═══════════════════════════════════════════════════════════════════════════

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;

    // Auth check
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if item exists and belongs to user's cart
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    if (cartItem.cart.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete item
    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json(
      {
        message: "Item removed from cart",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/cart/[itemId] error:", error);
    return NextResponse.json(
      { error: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PATCH /api/cart/[itemId] - Update cart item (quantity or notes)
// ═══════════════════════════════════════════════════════════════════════════

const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(10).optional(),
  notes: z.string().max(500).optional(),
  measurementSessionId: z.string().min(1).nullable().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;

    // Auth check
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate request body
    const body = await request.json();
    const validatedData = updateCartItemSchema.parse(body);

    // Check if item exists and belongs to user's cart
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    if (cartItem.cart.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update item
    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: {
        ...(validatedData.quantity !== undefined && {
          quantity: validatedData.quantity,
        }),
        ...(validatedData.notes !== undefined && { notes: validatedData.notes }),
        ...(validatedData.measurementSessionId !== undefined && {
          measurementSessionId: validatedData.measurementSessionId,
        }),
      },
      include: {
        product: {
          include: {
            tailor: {
              select: {
                id: true,
                name: true,
                isVerified: true,
              },
            },
            images: {
              orderBy: { position: "asc" },
              take: 1,
            },
          },
        },
        measurementSession: {
          select: {
            id: true,
            status: true,
            measurements: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Cart item updated",
        cartItem: updatedItem,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("PATCH /api/cart/[itemId] error:", error);
    return NextResponse.json(
      { error: "Failed to update cart item" },
      { status: 500 }
    );
  }
}
