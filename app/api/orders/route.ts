import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
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
    // Auth check with Supabase
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = user.id;

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status'); // Filter by status

    // Check if user is a tailor
    const tailorProfile = await prisma.user.findUnique({
      where: { id: userId },
      include: { tailorProfile: true },
    });

    if (tailorProfile?.tailorProfile) {
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
