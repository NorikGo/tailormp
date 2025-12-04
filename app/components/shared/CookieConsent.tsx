"use client";

import { useEffect, useState } from "react";
import CookieConsentLib from "react-cookie-consent";
import Link from "next/link";

/**
 * DSGVO-compliant Cookie Consent Banner
 *
 * Shows consent banner for analytics tracking
 * Stores user preference in localStorage
 * Only loads Plausible Analytics if accepted
 */
export default function CookieConsent() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only render on client to avoid hydration mismatch
  if (!isClient) {
    return null;
  }

  const handleAccept = () => {
    // Store consent in localStorage
    localStorage.setItem("cookie-consent", "accepted");

    // Load Plausible Analytics if not already loaded
    if (typeof window !== "undefined" && !document.querySelector('script[data-domain]')) {
      const script = document.createElement("script");
      script.defer = true;
      script.setAttribute("data-domain", "tailormarket.com");
      script.src = "https://plausible.io/js/script.js";
      document.head.appendChild(script);
    }
  };

  const handleDecline = () => {
    // Store consent decline
    localStorage.setItem("cookie-consent", "declined");
  };

  return (
    <CookieConsentLib
      location="bottom"
      buttonText="Akzeptieren"
      declineButtonText="Ablehnen"
      enableDeclineButton
      onAccept={handleAccept}
      onDecline={handleDecline}
      expires={365}
      cookieName="cookie-consent"
      style={{
        background: "#1e293b",
        padding: "20px",
        alignItems: "center",
        fontSize: "14px",
        lineHeight: "1.5",
      }}
      buttonStyle={{
        background: "#10b981",
        color: "white",
        fontSize: "14px",
        padding: "10px 24px",
        borderRadius: "6px",
        fontWeight: "500",
        cursor: "pointer",
        border: "none",
      }}
      declineButtonStyle={{
        background: "transparent",
        color: "white",
        fontSize: "14px",
        padding: "10px 24px",
        borderRadius: "6px",
        fontWeight: "500",
        cursor: "pointer",
        border: "1px solid rgba(255, 255, 255, 0.3)",
      }}
      contentStyle={{
        flex: "1 0 300px",
        margin: "0 20px 0 0",
      }}
    >
      <div style={{ maxWidth: "800px" }}>
        <strong>🍪 Wir nutzen Plausible Analytics</strong>
        <p style={{ margin: "8px 0 0 0", fontSize: "13px", opacity: 0.9 }}>
          Wir verwenden Plausible Analytics für anonyme Nutzungsstatistiken.{" "}
          <strong>Keine Cookies, keine Tracker, DSGVO-konform.</strong> Mit der
          Nutzung stimmst du der Datenverarbeitung zu.{" "}
          <Link
            href="/datenschutz"
            style={{
              color: "#60a5fa",
              textDecoration: "underline",
            }}
          >
            Mehr erfahren
          </Link>
        </p>
      </div>
    </CookieConsentLib>
  );
}
