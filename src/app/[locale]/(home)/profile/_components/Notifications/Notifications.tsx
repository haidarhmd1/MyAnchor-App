import { SettingsRowSwitch } from "../General/SettingsRowSwitch";
import { useTranslations } from "next-intl";

export const Notifications = () => {
  const t = useTranslations("notifications");

  return (
    <section className="space-y-4">
      <div className="pt-4 pb-1">
        <h4 className="text-foreground text-base font-semibold tracking-tight">
          {t("title")}
        </h4>
      </div>

      <div className="space-y-3">
        <SettingsRowSwitch
          id="practice-reminders"
          configTitle={t("practiceReminders.title")}
          configDescription={t("practiceReminders.description")}
        />

        <SettingsRowSwitch
          id="new-content"
          configTitle={t("newContent.title")}
          configDescription={t("newContent.description")}
        />
      </div>
    </section>
  );
};
