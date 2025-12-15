"use client";

import { I18nProvider } from "../contexts/i18n";
import { LanguageSwitcher } from "./language-switcher";

export function I18nWrapper({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <LanguageSwitcher />
      {children}
    </I18nProvider>
  );
}
