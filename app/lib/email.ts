import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderConfirmationData {
  orderId: string;
  customerEmail: string;
  customerName: string;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    zip: string;
    country: string;
  };
}

interface OrderStatusUpdateData {
  orderId: string;
  customerEmail: string;
  customerName: string;
  status: string;
  trackingNumber?: string;
}

export async function sendOrderConfirmation(data: OrderConfirmationData) {
  try {
    const { orderId, customerEmail, customerName, items, totalAmount, shippingAddress } = data;

    await resend.emails.send({
      from: "TailorMarket <noreply@tailormarket.com>",
      to: customerEmail,
      subject: `Bestellbest�tigung - Bestellung #${orderId.slice(0, 8)}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1e293b; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f8fafc; }
            .order-item { border-bottom: 1px solid #e2e8f0; padding: 10px 0; }
            .total { font-size: 18px; font-weight: bold; margin-top: 20px; padding-top: 20px; border-top: 2px solid #1e293b; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Vielen Dank f�r Ihre Bestellung!</h1>
            </div>
            <div class="content">
              <p>Hallo ${customerName},</p>
              <p>Ihre Bestellung wurde erfolgreich aufgegeben. Hier sind die Details:</p>

              <h2>Bestellung #${orderId.slice(0, 8)}</h2>

              <h3>Bestellte Artikel:</h3>
              ${items.map(item => `
                <div class="order-item">
                  <strong>${item.title}</strong><br>
                  Menge: ${item.quantity} � �${item.price.toFixed(2)} = �${(item.quantity * item.price).toFixed(2)}
                </div>
              `).join('')}

              <div class="total">
                Gesamtbetrag: �${totalAmount.toFixed(2)}
              </div>

              <h3>Lieferadresse:</h3>
              <p>
                ${shippingAddress.name}<br>
                ${shippingAddress.street}<br>
                ${shippingAddress.zip} ${shippingAddress.city}<br>
                ${shippingAddress.country}
              </p>

              <p>Sie erhalten eine weitere E-Mail, sobald Ihre Bestellung versendet wurde.</p>
            </div>
            <div class="footer">
              <p>� ${new Date().getFullYear()} TailorMarket. Alle Rechte vorbehalten.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    return { success: false, error };
  }
}

interface WelcomeEmailData {
  userEmail: string;
  userName: string;
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  try {
    const { userEmail, userName } = data;

    await resend.emails.send({
      from: "TailorMarket <noreply@tailormarket.com>",
      to: userEmail,
      subject: "Willkommen bei TailorMarket!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1e293b; color: white; padding: 30px 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f8fafc; }
            .cta-button { display: inline-block; padding: 12px 30px; background: #1e293b; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .features { margin: 20px 0; }
            .feature-item { padding: 15px; margin: 10px 0; background: white; border-left: 4px solid #1e293b; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Willkommen bei TailorMarket!</h1>
            </div>
            <div class="content">
              <p>Hallo ${userName},</p>
              <p>Vielen Dank für Ihre Registrierung bei TailorMarket - Ihrem Marktplatz für maßgeschneiderte Mode!</p>

              <div class="features">
                <div class="feature-item">
                  <strong>👔 Maßgeschneiderte Anzüge</strong><br>
                  Entdecken Sie hunderte von Schneidern und finden Sie den perfekten Anzug für jeden Anlass.
                </div>
                <div class="feature-item">
                  <strong>📏 Präzise Maßanfertigung</strong><br>
                  Geben Sie Ihre Maße ein oder nutzen Sie unseren digitalen Messassistenten.
                </div>
                <div class="feature-item">
                  <strong>⭐ Verifizierte Schneider</strong><br>
                  Alle unsere Schneider sind geprüft und haben Erfahrung in der Maßanfertigung.
                </div>
              </div>

              <p style="text-align: center;">
                <a href="http://localhost:3000/products" class="cta-button">Jetzt Produkte entdecken</a>
              </p>

              <p>Bei Fragen stehen wir Ihnen jederzeit zur Verfügung!</p>

              <p>Viel Erfolg bei Ihrer Suche nach dem perfekten Anzug!</p>
              <p>Ihr TailorMarket Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} TailorMarket. Alle Rechte vorbehalten.</p>
              <p>Diese E-Mail wurde an ${userEmail} gesendet.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return { success: false, error };
  }
}

export async function sendOrderStatusUpdate(data: OrderStatusUpdateData) {
  try {
    const { orderId, customerEmail, customerName, status, trackingNumber } = data;

    const statusMessages: Record<string, { title: string; message: string }> = {
      paid: {
        title: "Zahlung best�tigt",
        message: "Ihre Zahlung wurde erfolgreich verarbeitet.",
      },
      processing: {
        title: "Bestellung in Bearbeitung",
        message: "Ihr Schneider hat mit der Bearbeitung Ihrer Bestellung begonnen.",
      },
      shipped: {
        title: "Bestellung versendet",
        message: "Ihre Bestellung wurde versendet und ist auf dem Weg zu Ihnen.",
      },
      completed: {
        title: "Bestellung abgeschlossen",
        message: "Ihre Bestellung wurde erfolgreich zugestellt.",
      },
    };

    const statusInfo = statusMessages[status] || {
      title: "Status-Update",
      message: "Der Status Ihrer Bestellung hat sich ge�ndert.",
    };

    await resend.emails.send({
      from: "TailorMarket <noreply@tailormarket.com>",
      to: customerEmail,
      subject: `${statusInfo.title} - Bestellung #${orderId.slice(0, 8)}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1e293b; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f8fafc; }
            .status-badge { display: inline-block; padding: 10px 20px; background: #10b981; color: white; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${statusInfo.title}</h1>
            </div>
            <div class="content">
              <p>Hallo ${customerName},</p>
              <p>${statusInfo.message}</p>

              <div class="status-badge">Bestellung #${orderId.slice(0, 8)}</div>

              ${trackingNumber ? `
                <h3>Tracking-Informationen:</h3>
                <p><strong>Tracking-Nummer:</strong> ${trackingNumber}</p>
              ` : ''}

              <p>Sie k�nnen den Status Ihrer Bestellung jederzeit in Ihrem Dashboard �berpr�fen.</p>
            </div>
            <div class="footer">
              <p>� ${new Date().getFullYear()} TailorMarket. Alle Rechte vorbehalten.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send order status update email:", error);
    return { success: false, error };
  }
}
