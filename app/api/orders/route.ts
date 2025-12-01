import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

/**
 * GET /api/orders
 *
 * Fetch orders for the current user
 * - Customers: ihre eigenen Bestellungen
 * - Tailors: Bestellungen für ihre Produkte
 */
export async function GET(req: NextRequest) {
  try {
    // TODO: Auth Integration - Extract from session
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role'); // 'customer' | 'tailor'

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status'); // Filter by status

    if (userRole === 'tailor') {
      // Tailors sehen Bestellungen für ihre Produkte
      const orders = await prisma.order.findMany({
        where: {
          items: {
            some: {
              tailorId: userId,
            },
          },
          ...(status && { status }),
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  title: true,
                  images: true,
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
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return NextResponse.json({ orders });
    } else {
      // Customers sehen ihre eigenen Bestellungen
      const orders = await prisma.order.findMany({
        where: {
          userId,
          ...(status && { status }),
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  title: true,
                  images: true,
                  tailor: {
                    select: {
                      id: true,
                      email: true,
                      tailorProfile: {
                        select: {
                          businessName: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return NextResponse.json({ orders });
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
