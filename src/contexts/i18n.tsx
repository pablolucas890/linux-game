'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import type { LocaleInfo } from '../locales';
import { defaultLocale, getAvailableLocales, locales, type Locale } from '../locales';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
  tArray: (key: string) => string[];
  availableLocales: Locale[];
  localeInfo: LocaleInfo;
  isLoading: boolean;
}

function getNestedValueInObject(obj: Record<string, unknown>, path: string): string | null {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return null;
    }
  }

  return typeof current === 'string' ? current : null;
}

function getNestedArrayInObject(obj: Record<string, unknown>, path: string): string[] | null {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return null;
    }
  }

  return Array.isArray(current) && current.every(item => typeof item === 'string') ? (current as string[]) : null;
}

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  // First try to get the value from the current locale
  const value = getNestedValueInObject(obj, path);
  if (value !== null) {
    return value;
  }

  // If not found, try to get from English as fallback
  if (locales.en) {
    const enTranslations = locales.en.translations as Record<string, unknown>;
    const enValue = getNestedValueInObject(enTranslations, path);
    if (enValue !== null) {
      return enValue;
    }
  }

  // If still not found, return the path itself
  return path;
}

function replaceParams(text: string, params?: Record<string, string>): string {
  if (!params) return text;
  return Object.entries(params).reduce((acc, [key, value]) => acc.replace(`{${key}}`, value), text);
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const availableLocales = getAvailableLocales();

  // Always start with defaultLocale to avoid hydration mismatch
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as Locale;
      if (savedLocale && availableLocales.includes(savedLocale)) {
        setLocaleState(savedLocale); // eslint-disable-line react-hooks/set-state-in-effect
        const localeInfo = locales[savedLocale];
        document.documentElement.lang = localeInfo.code;
      } else {
        const localeInfo = locales[defaultLocale];
        document.documentElement.lang = localeInfo.code;
      }
      setIsLoading(false);
    }
  }, [availableLocales]);

  const setLocale = (newLocale: Locale) => {
    if (!availableLocales.includes(newLocale)) {
      console.warn(`Locale ${newLocale} is not available. Available locales:`, availableLocales);
      return;
    }
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
      const localeInfo = locales[newLocale];
      document.documentElement.lang = localeInfo.code;
    }
  };

  const t = (key: string, params?: Record<string, string>): string => {
    const currentLocaleInfo = locales[locale];
    const translation = getNestedValue(currentLocaleInfo.translations as Record<string, unknown>, key);
    return replaceParams(translation, params);
  };

  const tArray = (key: string): string[] => {
    const currentLocaleInfo = locales[locale];
    const array = getNestedArrayInObject(currentLocaleInfo.translations as Record<string, unknown>, key);
    if (array !== null) {
      return array;
    }

    // If not found, try to get from English as fallback
    if (locales.en) {
      const enTranslations = locales.en.translations as Record<string, unknown>;
      const enArray = getNestedArrayInObject(enTranslations, key);
      if (enArray !== null) {
        return enArray;
      }
    }

    // If still not found, return empty array
    return [];
  };

  const localeInfo = locales[locale];

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, tArray, availableLocales, localeInfo, isLoading }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
