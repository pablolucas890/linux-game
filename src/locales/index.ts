import en from './en.json';
import ptBR from './pt-BR.json';

export interface LocaleInfo {
  code: string;
  name: string;
  nativeName: string;
  translations: typeof ptBR;
}

export const locales: Record<string, LocaleInfo> = {
  'pt-BR': {
    code: 'pt-BR',
    name: 'Portuguese',
    nativeName: 'Português',
    translations: ptBR,
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    translations: en,
  },
};

export type Locale = keyof typeof locales;

export const defaultLocale: Locale = 'en';

export const getAvailableLocales = (): Locale[] => {
  return Object.keys(locales) as Locale[];
};
