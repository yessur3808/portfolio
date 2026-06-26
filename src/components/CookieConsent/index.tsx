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

const styles = `
  .cookie-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    background-color: #1e293b;
    border-top: 1px solid #475569;
    box-shadow: 0 -10px 25px -5px rgba(0, 0, 0, 0.3);
    padding: 1rem;
    pointer-events: auto;
  }

  .cookie-inner {
    max-width: 80rem;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .cookie-text {
    color: #cbd5e1;
    font-size: 0.875rem;
    line-height: 1.5;
    margin: 0;
  }

  .cookie-link {
    color: #60a5fa;
    text-decoration: underline;
    white-space: nowrap;
  }

  .cookie-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    pointer-events: auto;
  }

  .cookie-btn {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
    border-radius: 0.5rem;
    cursor: pointer;
    pointer-events: auto;
    transition: all 0.2s;
    user-select: none;
    -webkit-user-select: none;
    width: 100%;
  }

  .cookie-btn-reject {
    font-weight: 500;
    color: #cbd5e1;
    border: 1px solid #64748b;
    background-color: transparent;
  }

  .cookie-btn-reject:hover {
    color: #f1f5f9;
    border-color: #94a3b8;
  }

  .cookie-btn-accept {
    font-weight: 600;
    color: #e2e8f0;
    background-color: #3b82f6;
    border: none;
  }

  .cookie-btn-accept:hover {
    background-color: #2563eb;
  }

  @media (min-width: 640px) {
    .cookie-inner {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .cookie-actions {
      flex-direction: row;
      flex-shrink: 0;
    }

    .cookie-btn {
      width: auto;
      white-space: nowrap;
    }
  }
`;

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
    <>
      <style>{styles}</style>
      <div data-cookie-banner className="cookie-banner">
        <div className="cookie-inner">
          <p className="cookie-text">
            We use Google Analytics to understand how you use our site and
            improve your experience. We don&apos;t collect any personal
            information.{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="cookie-link"
            >
              Learn more
            </a>
          </p>
          <div className="cookie-actions">
            <button
              type="button"
              onClick={handleReject}
              className="cookie-btn cookie-btn-reject"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="cookie-btn cookie-btn-accept"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
