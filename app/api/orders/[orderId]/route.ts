import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { updateOrderStatusSchema } from '@/app/lib/validations';
import { z } from 'zod';

/**
 * GET /api/orders/[orderId]
 *
 * Fetch einzelne Order mit allen Details
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                description: true,
                images: true,
                tailor: {
                  select: {
                    id: true,
                    email: true,
                    tailorProfile: {
                      select: {
                        businessName: true,
                        location: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        measurementSessions: {
          select: {
            id: true,
            name: true,
            measurements: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Authorization: Customer sieht nur eigene Orders, Tailor sieht Orders für seine Produkte
    const isTailorOrder = order.items.some((item) => item.tailorId === userId);
    const isCustomerOrder = order.userId === userId;

    if (userRole === 'tailor' && !isTailorOrder) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (userRole === 'customer' && !isCustomerOrder) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/orders/[orderId]
 *
 * Update Order Status (Nur Tailors)
 * - processing: Schneider hat begonnen
 * - shipped: Paket versendet
 * - completed: Erfolgreich abgeschlossen
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');

    if (!userId || userRole !== 'tailor') {
      return NextResponse.json(
        { error: 'Only tailors can update order status' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = updateOrderStatusSchema.parse(body);

    // Verify: Tailor owns this order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const isTailorOrder = order.items.some((item) => item.tailorId === userId);
    if (!isTailorOrder) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update Order
    const updateData: any = {
      status: validatedData.status,
    };

    // Set timestamps based on status
    if (validatedData.status === 'shipped') {
      updateData.shippedAt = new Date();
      if (validatedData.trackingNumber) {
        updateData.trackingNumber = validatedData.trackingNumber;
      }
    } else if (validatedData.status === 'completed') {
      updateData.completedAt = new Date();
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        items: true,
      },
    });

    // TODO: Send Email Notification to customer

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
