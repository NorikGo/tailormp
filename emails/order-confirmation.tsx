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
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';

interface OrderConfirmationEmailProps {
  customerName: string;
  orderNumber: string;
  orderDate: string;
  productTitle: string;
  productPrice: string;
  tailorName: string;
  orderUrl: string;
}

export default function OrderConfirmationEmail({
  customerName = 'Max Mustermann',
  orderNumber = 'TM-2024-001',
  orderDate = '14. Dezember 2024',
  productTitle = 'Maßgeschneiderter Anzug',
  productPrice = '€299.00',
  tailorName = 'Nguyen Tailoring',
  orderUrl = 'https://tailormarket.com/orders/123',
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Ihre Bestellung {orderNumber} wurde bestätigt</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo/Header */}
          <Section style={header}>
            <Heading style={logo}>TailorMarket</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>Vielen Dank für Ihre Bestellung! 🎉</Heading>

            <Text style={text}>
              Hallo {customerName},
            </Text>

            <Text style={text}>
              Ihr Maßanzug wird gefertigt! Wir haben Ihre Bestellung an <strong>{tailorName}</strong> in Vietnam weitergeleitet.
              Der Schneider wird nun Ihre Maße prüfen und mit der handwerklichen Fertigung Ihres Anzugs beginnen.
            </Text>

            <Section style={highlightBox}>
              <Text style={highlightText}>
                💙 <strong>Fair gefertigt:</strong> 60% des Verkaufspreises gehen direkt an Ihren Schneider –
                deutlich mehr als bei traditionellen Marken.
              </Text>
            </Section>

            {/* Order Details Box */}
            <Section style={orderBox}>
              <Text style={orderBoxLabel}>Bestellnummer</Text>
              <Text style={orderBoxValue}>{orderNumber}</Text>

              <Hr style={divider} />

              <Row>
                <Column>
                  <Text style={orderDetailLabel}>Bestelldatum</Text>
                  <Text style={orderDetailValue}>{orderDate}</Text>
                </Column>
              </Row>

              <Hr style={divider} />

              <Text style={orderDetailLabel}>Produkt</Text>
              <Text style={productTitleStyle}>{productTitle}</Text>
              <Text style={orderDetailValue}>von {tailorName}</Text>

              <Hr style={divider} />

              <Row>
                <Column>
                  <Text style={orderDetailLabel}>Gesamtbetrag</Text>
                </Column>
                <Column align="right">
                  <Text style={priceText}>{productPrice}</Text>
                </Column>
              </Row>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={orderUrl}>
                Bestellung ansehen
              </Button>
            </Section>

            {/* Next Steps */}
            <Section>
              <Heading style={h2}>Die nächsten Schritte</Heading>
              <Text style={text}>
                1. <strong>Maßprüfung (1-2 Tage):</strong> Ihr Schneider prüft Ihre Maße und meldet sich bei Rückfragen<br />
                2. <strong>Handwerkliche Fertigung (3-4 Wochen):</strong> Ihr Anzug wird in Vietnam maßgefertigt<br />
                3. <strong>Qualitätskontrolle & Versand:</strong> Professionelle Prüfung und schneller Versand<br />
                4. <strong>Lieferung zu Ihnen:</strong> DHL Express Lieferung mit Tracking
              </Text>
            </Section>

            <Section style={guaranteeBox}>
              <Text style={guaranteeTitle}>🛡️ Unsere Passform-Garantie</Text>
              <Text style={text}>
                Sollte Ihr Anzug nicht perfekt sitzen, übernehmen wir die Kosten für lokale Anpassungen
                bei einem Schneider Ihrer Wahl (bis zu 100€). Außerdem haben Sie 14 Tage Rückgaberecht.
              </Text>
            </Section>

            <Text style={text}>
              Sie können den Status Ihrer Bestellung jederzeit in Ihrem Dashboard verfolgen.
              Die geschätzte Lieferzeit beträgt 4-6 Wochen.
            </Text>

            <Text style={text}>
              Bei Fragen stehen wir Ihnen gerne zur Verfügung.
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
              <Link href="https://tailormarket.com/about" style={footerLink}>Über uns</Link>
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

const h1 = {
  color: '#1e293b',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  padding: '0',
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
  padding: '24px',
  margin: '32px 0',
};

const orderBoxLabel = {
  color: '#64748b',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 4px',
};

const orderBoxValue = {
  color: '#1e293b',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px',
};

const orderDetailLabel = {
  color: '#64748b',
  fontSize: '14px',
  margin: '8px 0 4px',
};

const orderDetailValue = {
  color: '#1e293b',
  fontSize: '16px',
  margin: '0 0 8px',
};

const productTitleStyle = {
  color: '#1e293b',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 4px',
};

const priceText = {
  color: '#1e293b',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '8px 0',
};

const divider = {
  borderColor: '#e2e8f0',
  margin: '16px 0',
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

const highlightBox = {
  backgroundColor: '#eff6ff',
  border: '1px solid #bfdbfe',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
};

const highlightText = {
  color: '#1e40af',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0',
};

const guaranteeBox = {
  backgroundColor: '#f0fdf4',
  border: '1px solid #bbf7d0',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const guaranteeTitle = {
  color: '#166534',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px',
};
