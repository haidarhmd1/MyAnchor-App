import { SettingsRowSwitch } from "../General/SettingsRowSwitch";
import { useTranslations } from "next-intl";

export const Notifications = () => {
  const t = useTranslations("notifications");

  return (
    <div>
      <div className="flex flex-col items-start self-stretch pt-4 pb-2">
        <h4>{t("title")}</h4>
      </div>

      <SettingsRowSwitch
        configTitle={t("practiceReminders.title")}
        configDesctiption={t("practiceReminders.description")}
      />

      <SettingsRowSwitch
        configTitle={t("newContent.title")}
        configDesctiption={t("newContent.description")}
      />
    </div>
  );
};
