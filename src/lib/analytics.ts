export const GA_MEASUREMENT_ID = "G-PG2WHYK00C";

export type AnalyticsEvent =
  | { type: "page_view"; page_path: string; page_title: string }
  | { type: "portfolio_click"; project_slug: string; project_category?: string }
  | { type: "portfolio_view"; project_slug: string }
  | {
      type: "contact_click";
      contact_type: "email" | "linkedin" | "github" | "twitter";
    }
  | { type: "section_view"; section_name: string; scroll_position?: number }
  | {
      type: "scroll_depth_milestone";
      milestone: 25 | 50 | 75 | 100;
      page_path: string;
    }
  | { type: "orb_chat_opened"; timestamp: number }
  | { type: "orb_query_submitted"; query_length: number; has_context: boolean }
  | {
      type: "orb_search_result";
      result_count: number;
      search_type: "semantic" | "keyword";
    }
  | { type: "orb_assistant_error"; error_type: string }
  | {
      type: "component_load_time";
      component_name: string;
      load_time_ms: number;
    };

/**
 * Check if gtag is available in the window object
 */
export function isGtagAvailable(): boolean {
  if (typeof window === "undefined") return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof (window as any).gtag === "function";
}

export function initializeGA(): void {
  if (typeof window === "undefined") return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any;
  win.dataLayer = win.dataLayer || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
  function gtag(..._args: any[]): void {
    // eslint-disable-next-line prefer-rest-params
    win.dataLayer.push(arguments);
  }
  win.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

/**
 * Track an event in Google Analytics
 * This is a no-op if gtag is not available (before consent)
 */
export function trackEvent(
  eventName: string,
  eventData: Record<string, string | number | boolean | undefined> = {},
): void {
  if (!isGtagAvailable()) {
    console.debug(
      `[Analytics] Event tracked (gtag not loaded yet): ${eventName}`,
      eventData,
    );
    return;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gtag = (window as any).gtag as (...args: unknown[]) => void;
    gtag("event", eventName, eventData);
    console.debug(`[Analytics] Event tracked: ${eventName}`, eventData);
  } catch (error) {
    console.error(`[Analytics] Failed to track event: ${eventName}`, error);
  }
}

/**
 * Set GA4 user properties
 * Call this after identifying user segments or behaviors
 */
export function setUserProperties(
  properties: Record<string, string | number | boolean>,
): void {
  if (!isGtagAvailable()) {
    console.debug(
      "[Analytics] User properties not set (gtag not loaded yet)",
      properties,
    );
    return;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gtag = (window as any).gtag as (...args: unknown[]) => void;
    gtag("set", {
      user_properties: properties,
    });
  } catch (error) {
    console.error("[Analytics] Failed to set user properties", error);
  }
}

/**
 * Consent management helper
 * Store consent status in localStorage and GA4
 */
export const consentManager = {
  CONSENT_KEY: "cookie_consent",
  CONSENT_VALUE_ACCEPTED: "accepted",
  CONSENT_VALUE_REJECTED: "rejected",

  /**
   * Save consent status to localStorage and GA4
   */
  setConsent(accepted: boolean): void {
    const value = accepted
      ? this.CONSENT_VALUE_ACCEPTED
      : this.CONSENT_VALUE_REJECTED;
    localStorage.setItem(this.CONSENT_KEY, value);

    if (accepted) {
      initializeGA();
      setUserProperties({
        analytics_consent: true,
      });
    }
  },

  /**
   * Get stored consent status from localStorage
   */
  getConsent(): boolean | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(this.CONSENT_KEY);
    return stored === this.CONSENT_VALUE_ACCEPTED
      ? true
      : stored === this.CONSENT_VALUE_REJECTED
        ? false
        : null;
  },

  /**
   * Check if consent has been given before
   */
  hasConsentBeenAsked(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(this.CONSENT_KEY) !== null;
  },
};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer?: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
  }
}
