"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  RTL_LOCALES,
  type Locale,
  isSupportedLocale,
} from "@/src/i18n/config";
import { getMessages, type Messages } from "@/src/i18n/messages";

type LocaleContextValue = {
  locale: Locale;
  isRTL: boolean;
  messages: Messages;
  setLocale: (next: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

type LocaleProviderProps = {
  children: ReactNode;
};

export const LocaleProvider = ({ children }: LocaleProviderProps) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_LOCALE;
    }

    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return stored && isSupportedLocale(stored) ? stored : DEFAULT_LOCALE;
  });

  useEffect(() => {
    const isRTL = RTL_LOCALES.has(locale);

    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);

    document.documentElement.lang = locale;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.dataset.locale = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  const value = useMemo<LocaleContextValue>(() => {
    return {
      locale,
      isRTL: RTL_LOCALES.has(locale),
      messages: getMessages(locale),
      setLocale,
    };
  }, [locale, setLocale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};

export const useI18n = (): LocaleContextValue => {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useI18n must be used within LocaleProvider");
  }
  return ctx;
};
