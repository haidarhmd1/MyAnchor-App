"use client";

import { SettingsRow } from "../General/SettingsRow";
import { useTranslations } from "next-intl";

export const Appearance = () => {
  const t = useTranslations("appearance");

  return (
    <div>
      <div className="flex flex-col items-start self-stretch pt-4 pb-2">
        <h4>{t("title")}</h4>
      </div>

      <SettingsRow
        config={t("theme")}
        defaultConfig={t("system")}
        setting={t("light")}
      />

      <SettingsRow
        config={t("language")}
        defaultConfig={t("english")}
        setting={t("english")}
      />
    </div>
  );
};
