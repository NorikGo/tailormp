import { NextResponse } from 'next/server';
import {
  sendOrderConfirmationEmail,
  sendOrderNotificationTailorEmail,
  sendOrderStatusUpdateEmail,
  sendWelcomeEmail,
  formatCurrency,
  formatDate,
  generateOrderNumber,
} from '@/lib/email';

/**
 * Test Email API Route
 *
 * Usage:
 * GET /api/test-email?type=welcome&email=your@email.com
 *
 * Available types:
 * - welcome (customer)
 * - welcome-tailor
 * - order-confirmation
 * - order-notification
 * - order-status (add &status=measuring|production|shipping|completed)
 */
export async function GET(request: Request) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Test emails not available in production' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const email = searchParams.get('email') || 'test@example.com';
  const status = searchParams.get('status') as 'measuring' | 'production' | 'shipping' | 'completed' || 'production';

  if (!type) {
    return NextResponse.json({
      error: 'Missing parameter: type',
      usage: 'GET /api/test-email?type=welcome&email=your@email.com',
      availableTypes: [
        'welcome',
        'welcome-tailor',
        'order-confirmation',
        'order-notification',
        'order-status',
      ],
    }, { status: 400 });
  }

  try {
    let result;

    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail({
          to: email,
          userName: 'Max Mustermann',
          userRole: 'customer',
        });
        break;

      case 'welcome-tailor':
        result = await sendWelcomeEmail({
          to: email,
          userName: 'Nguyen Tailoring',
          userRole: 'tailor',
        });
        break;

      case 'order-confirmation':
        result = await sendOrderConfirmationEmail({
          to: email,
          customerName: 'Max Mustermann',
          orderNumber: generateOrderNumber('clx123abc456'),
          orderDate: formatDate(new Date()),
          productTitle: 'Maßgeschneiderter Anzug - Premium Wolle',
          productPrice: formatCurrency(299.00),
          tailorName: 'Nguyen Tailoring',
          orderId: 'clx123abc456',
        });
        break;

      case 'order-notification':
        result = await sendOrderNotificationTailorEmail({
          to: email,
          tailorName: 'Nguyen Tailoring',
          orderNumber: generateOrderNumber('clx123abc456'),
          orderDate: formatDate(new Date()),
          customerName: 'Max Mustermann',
          productTitle: 'Maßgeschneiderter Anzug - Premium Wolle',
          productPrice: formatCurrency(299.00),
          shippingAddress: {
            street: 'Musterstraße 123',
            city: 'Berlin',
            postalCode: '10115',
            country: 'Deutschland',
          },
          orderId: 'clx123abc456',
        });
        break;

      case 'order-status':
        result = await sendOrderStatusUpdateEmail({
          to: email,
          customerName: 'Max Mustermann',
          orderNumber: generateOrderNumber('clx123abc456'),
          productTitle: 'Maßgeschneiderter Anzug - Premium Wolle',
          tailorName: 'Nguyen Tailoring',
          status,
          trackingNumber: status === 'shipping' ? 'DHL1234567890' : undefined,
          orderId: 'clx123abc456',
        });
        break;

      default:
        return NextResponse.json({
          error: `Unknown type: ${type}`,
          availableTypes: [
            'welcome',
            'welcome-tailor',
            'order-confirmation',
            'order-notification',
            'order-status',
          ],
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Test email '${type}' sent to ${email}`,
      result,
    });

  } catch (error: unknown) {
    console.error('Test email error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json({
      success: false,
      error: errorMessage,
      hint: 'Make sure RESEND_API_KEY is set in .env.local',
    }, { status: 500 });
  }
}
