import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/app/lib/prisma";
import {
  sendOrderStatusUpdateEmail,
  generateOrderNumber,
} from "@/app/lib/email";

/**
 * GET /api/orders/[id]
 * Fetch a single order by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check with Supabase
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = user.id;

    // Fetch order with all related data
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                tailor: true,
                images: {
                  take: 1,
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        measurementSessions: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if user has access to this order
    // Check if user is a tailor who owns products in this order
    const tailorProfile = await prisma.user.findUnique({
      where: { id: userId },
      include: { tailor: true },
    });

    const isTailor = !!tailorProfile?.tailor;
    const tailorId = tailorProfile?.tailor?.id;

    // Check if tailor owns any items in this order
    const hasTailorAccess = isTailor
      ? order.items.some((item) => item.tailorId === tailorId)
      : false;

    // Customer can only view their own orders
    // Tailor can view orders containing their products
    if (order.userId !== userId && !hasTailorAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    // console.error("Fetch order error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/orders/[id]
 * Update order status (Tailors only)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check with Supabase
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = user.id;
    const body = await req.json();
    const { status, trackingNumber } = body;

    // Verify user is a tailor
    const tailorProfile = await prisma.user.findUnique({
      where: { id: userId },
      include: { tailor: true },
    });

    if (!tailorProfile?.tailor) {
      return NextResponse.json(
        { error: "Only tailors can update order status" },
        { status: 403 }
      );
    }

    const tailorId = tailorProfile.tailor.id;

    // Fetch order
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify tailor owns products in this order
    const hasTailorAccess = order.items.some((item) => item.tailorId === tailorId);
    if (!hasTailorAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update order
    const updateData: any = { status };

    if (status === "shipped") {
      updateData.shippedAt = new Date();
      if (trackingNumber) {
        updateData.trackingNumber = trackingNumber;
      }
    } else if (status === "completed") {
      updateData.completedAt = new Date();
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    // Send email notification to customer
    if (order.user) {
      const shippingAddress =
        typeof order.shippingAddress === "object" && order.shippingAddress !== null
          ? (order.shippingAddress as { name?: string })
          : null;

      // Get product title and tailor name for email
      const orderItem = order.items[0];
      const tailor = await prisma.tailor.findUnique({
        where: { id: orderItem.tailorId },
      });

      // Map database status to email status
      const emailStatusMap: Record<string, 'measuring' | 'production' | 'shipping' | 'completed'> = {
        'paid': 'measuring',
        'processing': 'production',
        'shipped': 'shipping',
        'completed': 'completed',
      };

      const emailStatus = emailStatusMap[status] || 'production';

      // Send status update email (fire and forget)
      sendOrderStatusUpdateEmail({
        to: order.user.email,
        customerName: shippingAddress?.name || order.user.email.split("@")[0],
        orderNumber: generateOrderNumber(updatedOrder.id),
        productTitle: orderItem.productTitle,
        tailorName: tailor?.name || 'TailorMarket',
        status: emailStatus,
        trackingNumber: trackingNumber || undefined,
        orderId: updatedOrder.id,
      }).catch((error) => {
        // console.error('Failed to send status update email:', error);
      });
    }

    return NextResponse.json({ order: updatedOrder }, { status: 200 });
  } catch (error) {
    // console.error("Update order error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
