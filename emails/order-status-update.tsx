import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import * as React from 'react';

type OrderStatus = 'measuring' | 'production' | 'shipping' | 'completed';

interface OrderStatusUpdateEmailProps {
  customerName: string;
  orderNumber: string;
  productTitle: string;
  tailorName: string;
  status: OrderStatus;
  trackingNumber?: string;
  orderUrl: string;
}

const statusConfig: Record<OrderStatus, {
  title: string;
  emoji: string;
  message: string;
  nextStep: string;
}> = {
  measuring: {
    title: 'Maßprüfung läuft',
    emoji: '📏',
    message: 'Ihr Schneider prüft gerade Ihre angegebenen Maße und wird sich bei Rückfragen melden.',
    nextStep: 'Als Nächstes: Produktion beginnt',
  },
  production: {
    title: 'Produktion gestartet',
    emoji: '✂️',
    message: 'Ihr Kleidungsstück wird nun von Hand angefertigt. Dieser Prozess kann einige Tage dauern.',
    nextStep: 'Als Nächstes: Versand',
  },
  shipping: {
    title: 'Versandt',
    emoji: '📦',
    message: 'Ihr Paket ist unterwegs! Sie können die Sendung über die Tracking-Nummer verfolgen.',
    nextStep: 'Zustellung in Kürze',
  },
  completed: {
    title: 'Zugestellt',
    emoji: '🎉',
    message: 'Ihre Bestellung wurde zugestellt. Wir hoffen, Sie sind zufrieden mit Ihrem maßgeschneiderten Kleidungsstück!',
    nextStep: 'Bewerten Sie Ihre Erfahrung',
  },
};

export default function OrderStatusUpdateEmail({
  customerName = 'Max Mustermann',
  orderNumber = 'TM-2024-001',
  productTitle = 'Maßgeschneiderter Anzug',
  tailorName = 'Nguyen Tailoring',
  status = 'production',
  trackingNumber,
  orderUrl = 'https://tailormarket.com/orders/123',
}: OrderStatusUpdateEmailProps) {
  const config = statusConfig[status];

  return (
    <Html>
      <Head />
      <Preview>Ihre Bestellung {orderNumber} - {config.title}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo/Header */}
          <Section style={header}>
            <Heading style={logo}>TailorMarket</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Section style={statusBadge}>
              <Text style={statusEmoji}>{config.emoji}</Text>
              <Heading style={statusTitle}>{config.title}</Heading>
            </Section>

            <Text style={text}>
              Hallo {customerName},
            </Text>

            <Text style={text}>
              es gibt ein Update zu Ihrer Bestellung <strong>{orderNumber}</strong>:
            </Text>

            {/* Order Info Box */}
            <Section style={orderBox}>
              <Text style={orderDetailLabel}>Produkt</Text>
              <Text style={productTitleStyle}>{productTitle}</Text>
              <Text style={orderDetailValue}>von {tailorName}</Text>
            </Section>

            {/* Status Message */}
            <Section style={messageBox}>
              <Text style={messageText}>{config.message}</Text>
            </Section>

            {/* Tracking Number (only for shipping status) */}
            {status === 'shipping' && trackingNumber && (
              <Section style={trackingBox}>
                <Text style={trackingLabel}>Tracking-Nummer</Text>
                <Text style={trackingNumberStyle}>{trackingNumber}</Text>
              </Section>
            )}

            {/* Next Step Info */}
            <Section style={nextStepBox}>
              <Text style={nextStepText}>
                ⏭️ {config.nextStep}
              </Text>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={orderUrl}>
                Bestellung ansehen
              </Button>
            </Section>

            {/* Review CTA (only for completed orders) */}
            {status === 'completed' && (
              <Section style={reviewBox}>
                <Heading style={h2}>Wie zufrieden sind Sie?</Heading>
                <Text style={text}>
                  Helfen Sie anderen Kunden, indem Sie Ihre Erfahrung mit {tailorName} teilen.
                </Text>
                <Section style={buttonContainer}>
                  <Button style={secondaryButton} href={`${orderUrl}#review`}>
                    Bewertung schreiben
                  </Button>
                </Section>
              </Section>
            )}

            <Text style={text}>
              Bei Fragen stehen wir Ihnen jederzeit zur Verfügung.
            </Text>

            <Text style={signature}>
              Mit freundlichen Grüßen,<br />
              Ihr TailorMarket Team
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © 2024 TailorMarket. Alle Rechte vorbehalten.
            </Text>
            <Text style={footerText}>
              <Link href="https://tailormarket.com/orders" style={footerLink}>Meine Bestellungen</Link>
              {' • '}
              <Link href="https://tailormarket.com/help" style={footerLink}>Hilfe</Link>
              {' • '}
              <Link href="https://tailormarket.com/contact" style={footerLink}>Kontakt</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const header = {
  padding: '32px 20px',
  backgroundColor: '#1e293b',
};

const logo = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
};

const content = {
  padding: '0 48px',
};

const statusBadge = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const statusEmoji = {
  fontSize: '48px',
  margin: '0 0 16px',
};

const statusTitle = {
  color: '#1e293b',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#1e293b',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '30px 0 15px',
};

const text = {
  color: '#334155',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const orderBox = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const orderDetailLabel = {
  color: '#64748b',
  fontSize: '14px',
  margin: '0 0 4px',
};

const orderDetailValue = {
  color: '#64748b',
  fontSize: '16px',
  margin: '4px 0 0',
};

const productTitleStyle = {
  color: '#1e293b',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 4px',
};

const messageBox = {
  backgroundColor: '#dbeafe',
  border: '1px solid #bfdbfe',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const messageText = {
  color: '#1e40af',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
};

const trackingBox = {
  backgroundColor: '#f0fdf4',
  border: '1px solid #bbf7d0',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const trackingLabel = {
  color: '#166534',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 8px',
};

const trackingNumberStyle = {
  color: '#166534',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0',
  fontFamily: 'monospace',
};

const nextStepBox = {
  backgroundColor: '#fef3c7',
  border: '1px solid #fde68a',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const nextStepText = {
  color: '#92400e',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
};

const buttonContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const secondaryButton = {
  backgroundColor: '#16a34a',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const reviewBox = {
  backgroundColor: '#f0fdf4',
  border: '1px solid #bbf7d0',
  borderRadius: '8px',
  padding: '24px',
  margin: '32px 0',
};

const signature = {
  color: '#334155',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '32px 0 0',
};

const footer = {
  padding: '20px 48px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '8px 0',
};

const footerLink = {
  color: '#2563eb',
  textDecoration: 'none',
};
