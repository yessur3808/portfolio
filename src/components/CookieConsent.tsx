"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { consentManager, initializeGA } from "@/src/lib/analytics";

function useHasConsentBeenAsked() {
  return useSyncExternalStore(
    () => () => {},
    () => consentManager.hasConsentBeenAsked(),
    () => true,
  );
}

export function CookieConsent() {
  const hasBeenAsked = useHasConsentBeenAsked();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (consentManager.getConsent() === true) {
      initializeGA();
    }
  }, []);

  const handleAccept = () => {
    consentManager.setConsent(true);
    initializeGA();
    setDismissed(true);
  };

  const handleReject = () => {
    consentManager.setConsent(false);
    setDismissed(true);
  };

  if (hasBeenAsked || dismissed) {
    return null;
  }

  return (
    <div
      data-cookie-banner
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: "#1e293b",
        borderTop: "1px solid #475569",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        padding: "1rem",
        pointerEvents: "auto",
      }}
    >
      <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ color: "#cbd5e1", fontSize: "0.875rem", margin: 0 }}>
            We use Google Analytics to understand how you use our site and
            improve your experience. We don't collect any personal information.{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#60a5fa", textDecoration: "underline" }}
            >
              Learn more
            </a>
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              pointerEvents: "auto",
              flexDirection: "row",
              flexWrap: "nowrap",
            }}
          >
            <button
              onClick={handleReject}
              type="button"
              style={{
                padding: "0.75rem 1.5rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#cbd5e1",
                border: "1px solid #64748b",
                borderRadius: "0.375rem",
                backgroundColor: "transparent",
                cursor: "pointer",
                pointerEvents: "auto",
                transition: "all 0.2s",
                userSelect: "none",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                WebkitUserSelect: "none" as any,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#f1f5f9";
                e.currentTarget.style.borderColor = "#94a3b8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#cbd5e1";
                e.currentTarget.style.borderColor = "#64748b";
              }}
            >
              Reject
            </button>
            <button
              onClick={handleAccept}
              type="button"
              style={{
                padding: "0.75rem 1.5rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#e2e8f0",
                backgroundColor: "#3b82f6",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
                pointerEvents: "auto",
                transition: "all 0.2s",
                userSelect: "none",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                WebkitUserSelect: "none" as any,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#3b82f6";
              }}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
