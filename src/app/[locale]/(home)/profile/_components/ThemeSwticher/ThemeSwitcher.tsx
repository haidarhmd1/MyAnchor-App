"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

type ThemeOption = "light" | "dark" | "system";

export const ThemeSwitcher = () => {
  const t = useTranslations("appearance");
  const { theme, setTheme, forcedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex gap-2">
        <button
          type="button"
          className="rounded-3xl border px-3 py-1.5 text-sm"
          disabled
        >
          {t("system")}
        </button>
      </div>
    );
  }

  const currentTheme = (theme ?? "dark") as ThemeOption;
  const disabled = Boolean(forcedTheme);

  const options: ThemeOption[] = ["light", "dark", "system"];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = currentTheme === option;

        return (
          <button
            key={option}
            type="button"
            onClick={() => setTheme(option)}
            disabled={disabled}
            className={[
              "rounded-3xl border px-3 py-1.5 text-sm transition",
              active
                ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                : "border-neutral-300 bg-white text-black dark:border-neutral-700 dark:bg-neutral-900 dark:text-white",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            ].join(" ")}
            aria-pressed={active}
          >
            {t(option)}
          </button>
        );
      })}
    </div>
  );
};
