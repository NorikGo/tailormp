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

interface OrderNotificationTailorEmailProps {
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
  orderUrl: string;
}

export default function OrderNotificationTailorEmail({
  tailorName = 'Nguyen Tailoring',
  orderNumber = 'TM-2024-001',
  orderDate = '14. Dezember 2024',
  customerName = 'Max Mustermann',
  productTitle = 'Maßgeschneiderter Anzug',
  productPrice = '€299.00',
  shippingAddress = {
    street: 'Musterstraße 123',
    city: 'Berlin',
    postalCode: '10115',
    country: 'Deutschland',
  },
  orderUrl = 'https://tailormarket.com/tailor/orders/123',
}: OrderNotificationTailorEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Neue Bestellung {orderNumber} von {customerName}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo/Header */}
          <Section style={header}>
            <Heading style={logo}>TailorMarket</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>Neue Bestellung erhalten! 🎉</Heading>

            <Text style={text}>
              Hallo {tailorName},
            </Text>

            <Text style={text}>
              Sie haben eine neue Bestellung erhalten. Bitte prüfen Sie die Maße und beginnen Sie mit der Produktion.
            </Text>

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

              <Text style={orderDetailLabel}>Kunde</Text>
              <Text style={customerNameStyle}>{customerName}</Text>

              <Hr style={divider} />

              <Text style={orderDetailLabel}>Produkt</Text>
              <Text style={productTitleStyle}>{productTitle}</Text>

              <Hr style={divider} />

              <Row>
                <Column>
                  <Text style={orderDetailLabel}>Betrag</Text>
                </Column>
                <Column align="right">
                  <Text style={priceText}>{productPrice}</Text>
                </Column>
              </Row>

              <Hr style={divider} />

              <Text style={orderDetailLabel}>Lieferadresse</Text>
              <Text style={addressText}>
                {customerName}<br />
                {shippingAddress.street}<br />
                {shippingAddress.postalCode} {shippingAddress.city}<br />
                {shippingAddress.country}
              </Text>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={orderUrl}>
                Bestellung ansehen & Maße prüfen
              </Button>
            </Section>

            {/* Next Steps */}
            <Section>
              <Heading style={h2}>Nächste Schritte</Heading>
              <Text style={text}>
                1. <strong>Maße prüfen:</strong> Überprüfen Sie die Körpermaße des Kunden<br />
                2. <strong>Status aktualisieren:</strong> Bestätigen Sie die Maße im Dashboard<br />
                3. <strong>Produktion starten:</strong> Beginnen Sie mit der Anfertigung<br />
                4. <strong>Versand:</strong> Tragen Sie die Tracking-Nummer ein
              </Text>
            </Section>

            <Section style={infoBox}>
              <Text style={infoText}>
                💡 <strong>Tipp:</strong> Aktualisieren Sie den Bestellstatus regelmäßig, damit der Kunde über den Fortschritt informiert bleibt.
              </Text>
            </Section>

            <Text style={text}>
              Bei Fragen oder Problemen mit den Maßen kontaktieren Sie uns bitte.
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
              <Link href="https://tailormarket.com/tailor/dashboard" style={footerLink}>Dashboard</Link>
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

const customerNameStyle = {
  color: '#1e293b',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 8px',
};

const productTitleStyle = {
  color: '#1e293b',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 8px',
};

const priceText = {
  color: '#1e293b',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '8px 0',
};

const addressText = {
  color: '#334155',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 8px',
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

const infoBox = {
  backgroundColor: '#dbeafe',
  border: '1px solid #bfdbfe',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
};

const infoText = {
  color: '#1e40af',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
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
