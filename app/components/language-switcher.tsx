"use client";

import { useState } from "react";
import { useI18n } from "../contexts/i18n";
import { locales } from "../locales";

export function LanguageSwitcher() {
  const { locale, setLocale, t, availableLocales } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const currentLocaleInfo = locales[locale];

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-green-400 rounded-lg border border-gray-700 shadow-lg transition-colors duration-200 font-mono text-sm"
        title={t("language.switchTo")}
        aria-label={t("language.switchTo")}
        aria-expanded={isOpen}
      >
        {currentLocaleInfo.nativeName}
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute top-full right-0 mt-2 bg-neutral-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden min-w-[120px]">
            {availableLocales.map((loc) => {
              const localeInfo = locales[loc];
              const isActive = locale === loc;
              return (
                <button
                  key={loc}
                  onClick={() => {
                    setLocale(loc);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 font-mono text-sm transition-colors duration-200 ${
                    isActive
                      ? "bg-green-500/20 text-green-400"
                      : "text-gray-300 hover:bg-neutral-700 hover:text-green-400"
                  }`}
                >
                  {localeInfo.nativeName}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
