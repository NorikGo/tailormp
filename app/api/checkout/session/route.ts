import { NextRequest, NextResponse } from 'next/server';
import { getCheckoutSession } from '@/app/lib/stripe/checkout';
import prisma from '@/app/lib/prisma';
import { checkRateLimitForRequest } from '@/app/lib/middleware/rateLimitMiddleware';
import { RATE_LIMITS } from '@/app/lib/rateLimit';

/**
 * GET /api/checkout/session?session_id=xxx
 *
 * Retrieve Order details from Stripe Session ID
 */
export async function GET(req: NextRequest) {
  // Rate limiting for checkout (moderate)
  const rateLimitResponse = checkRateLimitForRequest(req, RATE_LIMITS.CHECKOUT);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const searchParams = req.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'session_id parameter required' },
        { status: 400 }
      );
    }

    // Get Stripe session
    const session = await getCheckoutSession(sessionId);

    // Find order by Stripe session ID
    const order = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
      include: {
        items: true,
        measurementSessions: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found for this session' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      order,
      session: {
        id: session.id,
        paymentStatus: session.payment_status,
      },
    });
  } catch (error) {
    // console.error('Error retrieving checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve session' },
      { status: 500 }
    );
  }
}
