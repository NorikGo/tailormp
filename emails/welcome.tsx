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

interface WelcomeEmailProps {
  userName: string;
  userRole: 'customer' | 'tailor';
  dashboardUrl: string;
}

export default function WelcomeEmail({
  userName = 'Max Mustermann',
  userRole = 'customer',
  dashboardUrl = 'https://tailormarket.com/dashboard',
}: WelcomeEmailProps) {
  const isCustomer = userRole === 'customer';
  const isTailor = userRole === 'tailor';

  return (
    <Html>
      <Head />
      <Preview>Willkommen bei TailorMarket! 🎉</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo/Header */}
          <Section style={header}>
            <Heading style={logo}>TailorMarket</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>
              Willkommen bei TailorMarket! 🎉
            </Heading>

            <Text style={text}>
              Hallo {userName},
            </Text>

            <Text style={text}>
              {isCustomer && (
                <>
                  herzlich willkommen bei TailorMarket! Wir freuen uns, dass Sie sich für maßgeschneiderte Kleidung von talentierten Schneidern aus aller Welt entschieden haben.
                </>
              )}
              {isTailor && (
                <>
                  herzlich willkommen bei TailorMarket! Wir freuen uns, Sie als Schneider in unserer Community begrüßen zu dürfen. Gemeinsam bringen wir Ihr Handwerk zu Kunden weltweit.
                </>
              )}
            </Text>

            {/* Customer Section */}
            {isCustomer && (
              <>
                <Section style={featureBox}>
                  <Heading style={h2}>So fangen Sie an</Heading>

                  <Section style={step}>
                    <Text style={stepNumber}>1</Text>
                    <div>
                      <Text style={stepTitle}>Schneider entdecken</Text>
                      <Text style={stepText}>
                        Durchsuchen Sie hunderte verifizierte Schneider aus Vietnam, Thailand, Indien und mehr.
                      </Text>
                    </div>
                  </Section>

                  <Section style={step}>
                    <Text style={stepNumber}>2</Text>
                    <div>
                      <Text style={stepTitle}>Maße angeben</Text>
                      <Text style={stepText}>
                        Nutzen Sie unser einfaches Measurement-Tool, um Ihre Körpermaße einzugeben.
                      </Text>
                    </div>
                  </Section>

                  <Section style={step}>
                    <Text style={stepNumber}>3</Text>
                    <div>
                      <Text style={stepTitle}>Bestellen & genießen</Text>
                      <Text style={stepText}>
                        Wählen Sie Ihr Wunschprodukt, passen Sie Details an und erhalten Sie Ihr maßgeschneidertes Kleidungsstück.
                      </Text>
                    </div>
                  </Section>
                </Section>

                <Section style={buttonContainer}>
                  <Button style={button} href={`${dashboardUrl.replace('/dashboard', '')}/tailors`}>
                    Schneider entdecken
                  </Button>
                </Section>
              </>
            )}

            {/* Tailor Section */}
            {isTailor && (
              <>
                <Section style={featureBox}>
                  <Heading style={h2}>Erste Schritte als Schneider</Heading>

                  <Section style={step}>
                    <Text style={stepNumber}>1</Text>
                    <div>
                      <Text style={stepTitle}>Profil vervollständigen</Text>
                      <Text style={stepText}>
                        Fügen Sie Ihre Erfahrung, Spezialisierungen und Portfolio-Bilder hinzu.
                      </Text>
                    </div>
                  </Section>

                  <Section style={step}>
                    <Text style={stepNumber}>2</Text>
                    <div>
                      <Text style={stepTitle}>Produkte erstellen</Text>
                      <Text style={stepText}>
                        Legen Sie Ihre Produkte an: Anzüge, Hemden, Hosen und mehr mit Preisen und Details.
                      </Text>
                    </div>
                  </Section>

                  <Section style={step}>
                    <Text style={stepNumber}>3</Text>
                    <div>
                      <Text style={stepTitle}>Bestellungen erhalten</Text>
                      <Text style={stepText}>
                        Sobald Ihr Profil verifiziert ist, können Kunden weltweit Ihre Produkte bestellen.
                      </Text>
                    </div>
                  </Section>
                </Section>

                <Section style={infoBox}>
                  <Text style={infoText}>
                    ℹ️ <strong>Hinweis:</strong> Ihr Profil wird von unserem Team überprüft. Dies dauert in der Regel 1-2 Werktage. Sie erhalten eine E-Mail, sobald Ihr Profil freigeschaltet wurde.
                  </Text>
                </Section>

                <Section style={buttonContainer}>
                  <Button style={button} href={`${dashboardUrl.replace('/dashboard', '')}/tailor/profile/edit`}>
                    Profil vervollständigen
                  </Button>
                </Section>
              </>
            )}

            {/* Benefits Section */}
            <Section style={benefitsSection}>
              <Heading style={h2}>
                {isCustomer ? 'Was Sie erwartet' : 'Ihre Vorteile'}
              </Heading>

              <Row>
                <Column>
                  <Section style={benefit}>
                    <Text style={benefitIcon}>✨</Text>
                    <Text style={benefitTitle}>
                      {isCustomer ? 'Maßgeschneidert' : 'Globale Reichweite'}
                    </Text>
                    <Text style={benefitText}>
                      {isCustomer
                        ? 'Perfekte Passform, genau nach Ihren Maßen'
                        : 'Erreichen Sie Kunden weltweit'}
                    </Text>
                  </Section>
                </Column>

                <Column>
                  <Section style={benefit}>
                    <Text style={benefitIcon}>💰</Text>
                    <Text style={benefitTitle}>
                      {isCustomer ? 'Fair & Erschwinglich' : 'Faire Preise'}
                    </Text>
                    <Text style={benefitText}>
                      {isCustomer
                        ? '40-60% günstiger als lokale Schneider'
                        : 'Sie bestimmen Ihre Preise'}
                    </Text>
                  </Section>
                </Column>
              </Row>

              <Row>
                <Column>
                  <Section style={benefit}>
                    <Text style={benefitIcon}>🔒</Text>
                    <Text style={benefitTitle}>Sichere Zahlung</Text>
                    <Text style={benefitText}>
                      {isCustomer
                        ? 'Verschlüsselte Zahlungsabwicklung via Stripe'
                        : 'Automatische Auszahlung nach Lieferung'}
                    </Text>
                  </Section>
                </Column>

                <Column>
                  <Section style={benefit}>
                    <Text style={benefitIcon}>🌍</Text>
                    <Text style={benefitTitle}>
                      {isCustomer ? 'Weltweite Auswahl' : 'Support & Hilfe'}
                    </Text>
                    <Text style={benefitText}>
                      {isCustomer
                        ? 'Schneider aus der ganzen Welt'
                        : 'Wir stehen Ihnen zur Seite'}
                    </Text>
                  </Section>
                </Column>
              </Row>
            </Section>

            <Hr style={divider} />

            <Text style={text}>
              Haben Sie Fragen? Unser Support-Team hilft Ihnen gerne weiter.
            </Text>

            <Section style={buttonContainer}>
              <Button style={secondaryButton} href="https://tailormarket.com/help">
                Hilfe-Center besuchen
              </Button>
            </Section>

            <Text style={signature}>
              Viel Erfolg und schöne maßgeschneiderte Momente!<br />
              Ihr TailorMarket Team
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © 2024 TailorMarket. Alle Rechte vorbehalten.
            </Text>
            <Text style={footerText}>
              <Link href={dashboardUrl} style={footerLink}>Dashboard</Link>
              {' • '}
              <Link href="https://tailormarket.com/about" style={footerLink}>Über uns</Link>
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
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  padding: '0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#1e293b',
  fontSize: '22px',
  fontWeight: 'bold',
  margin: '30px 0 20px',
  textAlign: 'center' as const,
};

const text = {
  color: '#334155',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const featureBox = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '32px 24px',
  margin: '32px 0',
};

const step = {
  display: 'flex',
  alignItems: 'flex-start',
  margin: '24px 0',
};

const stepNumber = {
  backgroundColor: '#2563eb',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '16px',
  flexShrink: 0,
};

const stepTitle = {
  color: '#1e293b',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 8px',
};

const stepText = {
  color: '#64748b',
  fontSize: '15px',
  lineHeight: '22px',
  margin: '0',
};

const infoBox = {
  backgroundColor: '#dbeafe',
  border: '1px solid #bfdbfe',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const infoText = {
  color: '#1e40af',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

const benefitsSection = {
  margin: '40px 0',
};

const benefit = {
  textAlign: 'center' as const,
  padding: '16px',
};

const benefitIcon = {
  fontSize: '36px',
  margin: '0 0 8px',
};

const benefitTitle = {
  color: '#1e293b',
  fontSize: '16px',
  fontWeight: '600',
  margin: '8px 0 4px',
};

const benefitText = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

const divider = {
  borderColor: '#e2e8f0',
  margin: '32px 0',
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
  padding: '14px 40px',
};

const secondaryButton = {
  backgroundColor: 'transparent',
  border: '2px solid #2563eb',
  borderRadius: '6px',
  color: '#2563eb',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 38px',
};

const signature = {
  color: '#334155',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '32px 0 0',
  textAlign: 'center' as const,
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
