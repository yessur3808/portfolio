import en from "@/src/i18n/locales/en.json";
import fr from "@/src/i18n/locales/fr.json";
import ar from "@/src/i18n/locales/ar.json";

import type { Locale } from "@/src/i18n/config";

export type Messages = typeof en;

export const messagesByLocale: Record<Locale, Messages> = {
  en,
  fr,
  ar,
};

export const getMessages = (locale: Locale): Messages => {
  return messagesByLocale[locale] ?? messagesByLocale.en;
};

export const interpolate = (
  template: string,
  values: Record<string, string>,
): string => {
  return Object.entries(values).reduce(
    (out, [key, value]) => out.replaceAll(`{{${key}}}`, value),
    template,
  );
};
