import { sanitizeText } from "@/src/lib/sanitize";

export const GA_MEASUREMENT_ID = "G-PG2WHYK00C";
const ATTRIBUTION_SOURCE_STORAGE_KEY = "traffic_source";
const ATTRIBUTION_PARAM_KEY_STORAGE_KEY = "traffic_source_param_key";
const ATTRIBUTION_TYPE_STORAGE_KEY = "traffic_source_type";
const ATTRIBUTION_MEDIUM_STORAGE_KEY = "traffic_medium";
const ATTRIBUTION_CAMPAIGN_STORAGE_KEY = "traffic_campaign";
const SOURCE_QUERY_KEYS = ["ref", "reference", "source", "utm_source"];

export type QueryIntent =
  | "portfolio"
  | "experience"
  | "skills"
  | "contact"
  | "about"
  | "other";

export type AnalyticsEvent =
  | { type: "page_view"; page_path: string; page_title: string }
  | {
      type: "traffic_source_detected";
      source: string;
      source_type: "query_param" | "referrer" | "stored";
      param_key?: string;
      utm_medium?: string;
      utm_campaign?: string;
      landing_path: string;
    }
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
  | {
      type: "orb_query_submitted";
      query_length: number;
      has_context: boolean;
      query_intent?: QueryIntent;
      query_language?: "en" | "ar" | "fr";
      query_text?: string;
    }
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
export const isGtagAvailable = (): boolean => {
  if (typeof window === "undefined") return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof (window as any).gtag === "function";
};

export const initializeGA = (): void => {
  if (typeof window === "undefined") return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any;
  win.dataLayer = win.dataLayer || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gtag = (...args: any[]): void => {
    win.dataLayer.push(args);
  };
  win.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
};

/**
 * Track an event in Google Analytics
 * This is a no-op if gtag is not available (before consent)
 */
export const trackEvent = (
  eventName: string,
  eventData: Record<string, string | number | boolean | undefined> = {},
): void => {
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
};

/**
 * Sanitizes free-form query text before analytics collection.
 * Keeps only safe, normalized content and truncates to a conservative limit.
 */
export const sanitizeAnalyticsQueryText = (
  input: string,
  maxLength = 120,
): string => {
  return sanitizeText(input, maxLength);
};

const normalizeAttributionValue = (value: string): string => {
  return sanitizeText(value.trim().toLowerCase(), 60)
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");
};

type DetectedAttribution = {
  source: string;
  sourceType: "query_param" | "referrer" | "stored";
  paramKey?: string;
  medium?: string;
  campaign?: string;
  hasQueryParams: boolean;
};

const readStoredAttribution = (): DetectedAttribution | null => {
  if (typeof window === "undefined") return null;

  const source = localStorage.getItem(ATTRIBUTION_SOURCE_STORAGE_KEY);
  if (!source) return null;

  const sourceType = localStorage.getItem(ATTRIBUTION_TYPE_STORAGE_KEY);
  const paramKey = localStorage.getItem(ATTRIBUTION_PARAM_KEY_STORAGE_KEY);
  const medium = localStorage.getItem(ATTRIBUTION_MEDIUM_STORAGE_KEY);
  const campaign = localStorage.getItem(ATTRIBUTION_CAMPAIGN_STORAGE_KEY);

  return {
    source,
    sourceType:
      sourceType === "query_param" ||
      sourceType === "referrer" ||
      sourceType === "stored"
        ? sourceType
        : "stored",
    paramKey: paramKey ?? undefined,
    medium: medium ?? undefined,
    campaign: campaign ?? undefined,
    hasQueryParams: false,
  };
};

const persistAttribution = (attribution: DetectedAttribution): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem(ATTRIBUTION_SOURCE_STORAGE_KEY, attribution.source);
  localStorage.setItem(ATTRIBUTION_TYPE_STORAGE_KEY, attribution.sourceType);

  if (attribution.paramKey) {
    localStorage.setItem(
      ATTRIBUTION_PARAM_KEY_STORAGE_KEY,
      attribution.paramKey,
    );
  } else {
    localStorage.removeItem(ATTRIBUTION_PARAM_KEY_STORAGE_KEY);
  }

  if (attribution.medium) {
    localStorage.setItem(ATTRIBUTION_MEDIUM_STORAGE_KEY, attribution.medium);
  } else {
    localStorage.removeItem(ATTRIBUTION_MEDIUM_STORAGE_KEY);
  }

  if (attribution.campaign) {
    localStorage.setItem(
      ATTRIBUTION_CAMPAIGN_STORAGE_KEY,
      attribution.campaign,
    );
  } else {
    localStorage.removeItem(ATTRIBUTION_CAMPAIGN_STORAGE_KEY);
  }
};

const detectAttributionFromLocation = (): DetectedAttribution | null => {
  if (typeof window === "undefined") return null;

  const searchParams = new URLSearchParams(window.location.search);
  const queryMedium = normalizeAttributionValue(
    searchParams.get("utm_medium") ?? "",
  );
  const queryCampaign = normalizeAttributionValue(
    searchParams.get("utm_campaign") ?? "",
  );

  const storedAttribution = readStoredAttribution();

  let sourceFromQuery: string | undefined;
  let sourceParamKey: string | undefined;

  for (const key of SOURCE_QUERY_KEYS) {
    const rawValue = searchParams.get(key);
    if (!rawValue) continue;

    const source = normalizeAttributionValue(rawValue);
    if (!source) continue;

    sourceFromQuery = source;
    sourceParamKey = key;
    break;
  }

  let sourceFromReferrer: string | undefined;

  if (document.referrer) {
    try {
      const referrerHost = new URL(document.referrer).hostname.replace(
        /^www\./,
        "",
      );
      const source = normalizeAttributionValue(referrerHost);

      if (source) {
        sourceFromReferrer = source;
      }
    } catch {
      // Ignore malformed referrer URLs.
    }
  }

  const source =
    sourceFromQuery ?? sourceFromReferrer ?? storedAttribution?.source;
  if (!source) {
    return null;
  }

  const sourceType: "query_param" | "referrer" | "stored" = sourceFromQuery
    ? "query_param"
    : sourceFromReferrer
      ? "referrer"
      : "stored";

  return {
    source,
    sourceType,
    paramKey: sourceParamKey ?? storedAttribution?.paramKey,
    medium: queryMedium || storedAttribution?.medium,
    campaign: queryCampaign || storedAttribution?.campaign,
    hasQueryParams: Boolean(sourceFromQuery || queryMedium || queryCampaign),
  };
};

/**
 * Detects source from URL params such as ref/reference/source/utm_source,
 * then falls back to referrer or previously stored value.
 */
export const trackAttributionSource = (): void => {
  if (typeof window === "undefined") return;

  const attribution = detectAttributionFromLocation();
  if (!attribution) return;

  persistAttribution(attribution);

  if (attribution.sourceType !== "stored" || attribution.hasQueryParams) {
    const pagePath = `${window.location.pathname}${window.location.search}`;

    trackEvent("traffic_source_detected", {
      source: attribution.source,
      source_type: attribution.sourceType,
      param_key: attribution.paramKey,
      utm_medium: attribution.medium,
      utm_campaign: attribution.campaign,
      landing_path: pagePath,
    });
  }

  const userProperties: Record<string, string | number | boolean> = {
    traffic_source: attribution.source,
    traffic_source_type: attribution.sourceType,
  };

  if (attribution.medium) {
    userProperties.traffic_medium = attribution.medium;
  }

  if (attribution.campaign) {
    userProperties.traffic_campaign = attribution.campaign;
  }

  setUserProperties(userProperties);
};

/**
 * Set GA4 user properties
 * Call this after identifying user segments or behaviors
 */
export const setUserProperties = (
  properties: Record<string, string | number | boolean>,
): void => {
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
};

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
