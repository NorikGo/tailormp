import { Resend } from 'resend';
import { render } from '@react-email/render';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Email sender configuration
const FROM_EMAIL = process.env.EMAIL_FROM || 'TailorMarket <noreply@tailormarket.com>';
const REPLY_TO = process.env.EMAIL_REPLY_TO || 'support@tailormarket.com';

// Base URL for links
const BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

/**
 * Send an email using Resend
 */
async function sendEmail({
  to,
  subject,
  html,
  replyTo = REPLY_TO,
}: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      replyTo,
    });

    if (error) {
      // Log error in production for debugging
      if (process.env.NODE_ENV === 'production') {
        console.error('Email sending error:', error);
      }
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return { success: true, data };
  } catch (error) {
    // Log error in production for debugging
    if (process.env.NODE_ENV === 'production') {
      console.error('Email sending failed:', error);
    }
    throw error;
  }
}

/**
 * Send Order Confirmation Email to Customer
 */
export async function sendOrderConfirmationEmail({
  to,
  customerName,
  orderNumber,
  orderDate,
  productTitle,
  productPrice,
  tailorName,
  orderId,
}: {
  to: string;
  customerName: string;
  orderNumber: string;
  orderDate: string;
  productTitle: string;
  productPrice: string;
  tailorName: string;
  orderId: string;
}) {
  // Dynamically import the email template
  const OrderConfirmationEmail = (await import('@/emails/order-confirmation')).default;

  const html = await render(
    OrderConfirmationEmail({
      customerName,
      orderNumber,
      orderDate,
      productTitle,
      productPrice,
      tailorName,
      orderUrl: `${BASE_URL}/orders/${orderId}`,
    })
  );

  return sendEmail({
    to,
    subject: `Bestellbestätigung ${orderNumber} - TailorMarket`,
    html,
  });
}

/**
 * Send Order Notification Email to Tailor
 */
export async function sendOrderNotificationTailorEmail({
  to,
  tailorName,
  orderNumber,
  orderDate,
  customerName,
  productTitle,
  productPrice,
  shippingAddress,
  orderId,
}: {
  to: string;
  tailorName: string;
  orderNumber: string;
  orderDate: string;
  customerName: string;
  productTitle: string;
  productPrice: string;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  orderId: string;
}) {
  const OrderNotificationTailorEmail = (await import('@/emails/order-notification-tailor')).default;

  const html = await render(
    OrderNotificationTailorEmail({
      tailorName,
      orderNumber,
      orderDate,
      customerName,
      productTitle,
      productPrice,
      shippingAddress,
      orderUrl: `${BASE_URL}/tailor/orders/${orderId}`,
    })
  );

  return sendEmail({
    to,
    subject: `Neue Bestellung ${orderNumber} - TailorMarket`,
    html,
  });
}

/**
 * Send Order Status Update Email to Customer
 */
export async function sendOrderStatusUpdateEmail({
  to,
  customerName,
  orderNumber,
  productTitle,
  tailorName,
  status,
  trackingNumber,
  orderId,
}: {
  to: string;
  customerName: string;
  orderNumber: string;
  productTitle: string;
  tailorName: string;
  status: 'measuring' | 'production' | 'shipping' | 'completed';
  trackingNumber?: string;
  orderId: string;
}) {
  const OrderStatusUpdateEmail = (await import('@/emails/order-status-update')).default;

  const statusTitles = {
    measuring: 'Maßprüfung',
    production: 'In Produktion',
    shipping: 'Versandt',
    completed: 'Zugestellt',
  };

  const html = await render(
    OrderStatusUpdateEmail({
      customerName,
      orderNumber,
      productTitle,
      tailorName,
      status,
      trackingNumber,
      orderUrl: `${BASE_URL}/orders/${orderId}`,
    })
  );

  return sendEmail({
    to,
    subject: `Bestellung ${orderNumber} - ${statusTitles[status]} - TailorMarket`,
    html,
  });
}

/**
 * Send Welcome Email to New User
 */
export async function sendWelcomeEmail({
  to,
  userName,
  userRole,
}: {
  to: string;
  userName: string;
  userRole: 'customer' | 'tailor';
}) {
  const WelcomeEmail = (await import('@/emails/welcome')).default;

  const dashboardUrl = userRole === 'tailor' ? `${BASE_URL}/tailor/dashboard` : `${BASE_URL}/dashboard`;

  const html = await render(
    WelcomeEmail({
      userName,
      userRole,
      dashboardUrl,
    })
  );

  return sendEmail({
    to,
    subject: 'Willkommen bei TailorMarket! 🎉',
    html,
  });
}

/**
 * Helper: Format currency for emails
 */
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Helper: Format date for emails
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(dateObj);
}

/**
 * Helper: Generate order number (if not already generated)
 */
export function generateOrderNumber(orderId: string): string {
  const year = new Date().getFullYear();
  const shortId = orderId.slice(0, 8).toUpperCase();
  return `TM-${year}-${shortId}`;
}

/**
 * Legacy function compatibility - sendOrderConfirmation
 * @deprecated Use sendOrderConfirmationEmail instead
 */
export async function sendOrderConfirmation(data: {
  orderId: string;
  customerEmail: string;
  customerName: string;
  items: Array<{ title: string; quantity: number; price: number }>;
  totalAmount: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    zip: string;
    country: string;
  };
}) {
  // Convert to new format
  const productTitle = data.items.map(item => item.title).join(', ');
  const productPrice = formatCurrency(data.totalAmount);

  return sendOrderConfirmationEmail({
    to: data.customerEmail,
    customerName: data.customerName,
    orderNumber: generateOrderNumber(data.orderId),
    orderDate: formatDate(new Date()),
    productTitle,
    productPrice,
    tailorName: 'TailorMarket', // Fallback
    orderId: data.orderId,
  });
}

/**
 * Legacy function compatibility - sendOrderStatusUpdate
 * @deprecated Use sendOrderStatusUpdateEmail instead
 */
export async function sendOrderStatusUpdate(data: {
  orderId: string;
  customerEmail: string;
  customerName: string;
  status: string;
  trackingNumber?: string;
}) {
  // Map old status to new status
  const statusMap: Record<string, 'measuring' | 'production' | 'shipping' | 'completed'> = {
    paid: 'measuring',
    processing: 'production',
    shipped: 'shipping',
    completed: 'completed',
  };

  const newStatus = statusMap[data.status] || 'production';

  return sendOrderStatusUpdateEmail({
    to: data.customerEmail,
    customerName: data.customerName,
    orderNumber: generateOrderNumber(data.orderId),
    productTitle: 'Ihre Bestellung', // Fallback
    tailorName: 'TailorMarket', // Fallback
    status: newStatus,
    trackingNumber: data.trackingNumber,
    orderId: data.orderId,
  });
}
