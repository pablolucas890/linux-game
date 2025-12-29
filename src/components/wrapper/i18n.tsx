'use client';

import { I18nProvider, useI18n } from '../../contexts/i18n';
import { LanguageSwitcher } from '../language-switcher';
import { Loading } from '../loading';

function I18nContent({ children }: { children: React.ReactNode }) {
  const { isLoading } = useI18n();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <LanguageSwitcher />
      {children}
    </>
  );
}

export function I18n({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <I18nContent>{children}</I18nContent>
    </I18nProvider>
  );
}
