"use client";

import { useState } from "react";

type CheckResult = {
  status: string;
  message: string;
  details?: string | Record<string, unknown>;
};

type SystemCheckResults = {
  timestamp: string;
  checks: Record<string, CheckResult>;
};

export default function SystemCheckPage() {
  const [results, setResults] = useState<SystemCheckResults | null>(null);
  const [loading, setLoading] = useState(false);

  const runCheck = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/system-check");
      const data = await response.json();
      setResults(data);
    } catch (error) {
      // console.error("Error running system check:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "monospace",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
        🔍 System Check
      </h1>

      <button
        onClick={runCheck}
        disabled={loading}
        style={{
          padding: "15px 30px",
          fontSize: "16px",
          background: loading ? "#ccc" : "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
          marginBottom: "30px",
        }}
      >
        {loading ? "Running checks..." : "▶ Run System Check"}
      </button>

      {results && (
        <div>
          <div
            style={{
              padding: "20px",
              background: results.checks.summary.status.includes("✅")
                ? "#d4edda"
                : "#f8d7da",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            {results.checks.summary.status} - {results.checks.summary.message}
          </div>

          {Object.entries(results.checks).map(([key, check]) => {
            if (key === "summary") return null;

            return (
              <div
                key={key}
                style={{
                  padding: "15px",
                  marginBottom: "10px",
                  background: "#f5f5f5",
                  borderLeft: `4px solid ${
                    check.status.includes("✅")
                      ? "#28a745"
                      : check.status.includes("⚠️")
                      ? "#ffc107"
                      : "#dc3545"
                  }`,
                  borderRadius: "4px",
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  {check.status} {check.message}
                </div>
                {check.details && (
                  <pre
                    style={{
                      fontSize: "12px",
                      background: "#fff",
                      padding: "10px",
                      borderRadius: "4px",
                      overflow: "auto",
                      margin: "10px 0 0 0",
                    }}
                  >
                    {typeof check.details === "string"
                      ? check.details
                      : JSON.stringify(check.details, null, 2)}
                  </pre>
                )}
              </div>
            );
          })}

          <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
            Last check: {new Date(results.timestamp).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
