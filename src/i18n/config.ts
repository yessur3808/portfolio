export const SUPPORTED_LOCALES = ["en", "fr", "ar"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const RTL_LOCALES: ReadonlySet<Locale> = new Set(["ar"]);

export const LOCALE_STORAGE_KEY = "portfolio.locale";

export const isSupportedLocale = (value: string): value is Locale => {
  return SUPPORTED_LOCALES.includes(value as Locale);
};
