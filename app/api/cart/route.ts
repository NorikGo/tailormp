import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/lib/auth-helpers";
import prisma from "@/app/lib/prisma";
import { z } from "zod";

// ═══════════════════════════════════════════════════════════════════════════
// GET /api/cart - Fetch user's cart with all items
// ═══════════════════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  try {
    // Auth check and ensure user exists in Prisma
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
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
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // Create cart if doesn't exist
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
        },
        include: {
          items: {
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
          },
        },
      });
    }

    // Calculate totals
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.priceAtAdd * item.quantity,
      0
    );
    const platformFeePercentage =
      parseFloat(process.env.PLATFORM_COMMISSION_PERCENTAGE || "10") / 100;
    const platformFee = subtotal * platformFeePercentage;
    const total = subtotal + platformFee;

    return NextResponse.json(
      {
        cart: {
          ...cart,
          subtotal,
          platformFee,
          total,
          itemCount: cart.items.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/cart error:", error);
    console.error("Error details:", error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error("Stack trace:", error.stack);
    }
    return NextResponse.json(
      {
        error: "Failed to fetch cart",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/cart - Add item to cart
// ═══════════════════════════════════════════════════════════════════════════

const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  measurementSessionId: z.string().min(1).optional(),
  quantity: z.number().int().min(1).max(10).default(1),
  notes: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Auth check and ensure user exists in Prisma
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate request body
    const body = await request.json();
    const validatedData = addToCartSchema.parse(body);

    // Check if product exists and is active
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
      include: {
        tailor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (!product.isActive) {
      return NextResponse.json(
        { error: "Product is not available" },
        { status: 400 }
      );
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: true,
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
        },
        include: {
          items: true,
        },
      });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(
      (item) => item.productId === validatedData.productId
    );

    if (existingItem) {
      return NextResponse.json(
        {
          error: "Product already in cart",
          cartItemId: existingItem.id,
        },
        { status: 409 }
      );
    }

    // Add item to cart
    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: validatedData.productId,
        tailorId: product.tailorId,
        measurementSessionId: validatedData.measurementSessionId,
        priceAtAdd: product.price,
        quantity: validatedData.quantity,
        notes: validatedData.notes,
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
        message: "Item added to cart",
        cartItem,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("POST /api/cart error:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}
