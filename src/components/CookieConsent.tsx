"use client";

import { useState } from "react";
import { consentManager, initializeGA } from "@/src/lib/analytics";

export function CookieConsent() {
  const [showBanner] = useState(() => {
    const hasBeenAsked = consentManager.hasConsentBeenAsked();

    if (hasBeenAsked) {
      const consent = consentManager.getConsent();
      if (consent === true) {
        initializeGA();
      }

      return false;
    }

    return true;
  });

  const handleAccept = () => {
    consentManager.setConsent(true);
    window.location.reload();
  };

  const handleReject = () => {
    consentManager.setConsent(false);
    const banner = document.querySelector("[data-cookie-banner]");
    if (banner) {
      banner.remove();
    }
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 shadow-lg"
      data-cookie-banner
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-slate-300 leading-relaxed">
              We use Google Analytics to understand how you use our site and
              improve your experience. We don't collect any personal
              information.{" "}
              <a
                href="/privacy"
                className="text-blue-400 hover:text-blue-300 underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more
              </a>
            </p>
          </div>
          <div className="flex gap-3 whitespace-nowrap">
            <button
              onClick={handleReject}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-slate-100 border border-slate-600 hover:border-slate-400 rounded transition-colors"
              aria-label="Reject analytics"
            >
              Reject
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium text-slate-200 bg-blue-500 hover:bg-blue-600 rounded transition-colors font-semibold"
              aria-label="Accept analytics"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
