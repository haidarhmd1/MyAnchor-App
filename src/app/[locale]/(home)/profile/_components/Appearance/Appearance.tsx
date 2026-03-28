"use client";

import { SettingsRow } from "../General/SettingsRow";
import { useTranslations } from "next-intl";

export const Appearance = () => {
  const t = useTranslations("appearance");

  return (
    <section className="space-y-4">
      <div className="pt-4 pb-1">
        <h4 className="text-foreground text-base font-semibold tracking-tight">
          {t("title")}
        </h4>
      </div>

      <div className="space-y-3">
        <SettingsRow
          config={t("theme")}
          defaultConfig={t("system")}
          setting={t("light")}
        />
      </div>
    </section>
  );
};
