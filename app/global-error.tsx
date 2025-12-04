"use client";

import { useEffect } from "react";

/**
 * Global Error Handler
 *
 * Catches errors in the root layout
 * Must include <html> and <body> tags since it replaces the entire app
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <html lang="de">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "28rem" }}>
            {/* Icon */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  width: "5rem",
                  height: "5rem",
                  borderRadius: "50%",
                  background: "#FEE2E2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#0F172A",
                marginBottom: "0.75rem",
              }}
            >
              Kritischer Fehler
            </h1>

            {/* Error Message */}
            <p
              style={{
                color: "#64748B",
                marginBottom: "2rem",
                lineHeight: "1.6",
              }}
            >
              {error.message || "Ein schwerwiegender Fehler ist aufgetreten."}
            </p>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <button
                onClick={reset}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "#1E293B",
                  color: "white",
                  border: "none",
                  borderRadius: "0.375rem",
                  fontSize: "1rem",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                Erneut versuchen
              </button>
              <a
                href="/"
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "white",
                  color: "#1E293B",
                  border: "1px solid #E2E8F0",
                  borderRadius: "0.375rem",
                  fontSize: "1rem",
                  fontWeight: "500",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Zur Startseite
              </a>
            </div>

            {/* Error Digest */}
            {error.digest && (
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#94A3B8",
                  marginTop: "2rem",
                  fontFamily: "monospace",
                }}
              >
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
