"use client";

import { Terminal } from "../components/terminal";
import { useI18n } from "../contexts/i18n";

export function Welcome() {
  const { t } = useI18n();

  const description = t("screens.welcome.description");
  const descriptionLines = description.split("\n");

  return (
    <div className="w-full h-screen p-4 flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center justify-center max-w-md text-justify">
        <h1 className="text-2xl font-bold mb-4">{t("screens.welcome.title")}</h1>
        {descriptionLines.map((line, index) => (
          <p key={index} className="text-sm text-gray-500 mb-4">{line}</p>
        ))}
      </div>
      <Terminal username={t("common.username")} machine="linux-game" />
    </div>
  );
}