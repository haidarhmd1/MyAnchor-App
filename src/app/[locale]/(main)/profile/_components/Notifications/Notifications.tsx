import { SettingsRowSwitch } from "../General/SettingsRowSwitch";

export const Notifications = () => {
  return (
    <div>
      <div className="flex flex-col items-start self-stretch pt-4 pb-2">
        <h4>Notifications</h4>
      </div>

      <SettingsRowSwitch
        configTitle="Practice reminders"
        configDesctiption="Daily reminders to practice"
      />
      <SettingsRowSwitch
        configTitle="New content"
        configDesctiption="Receive notifications about new content"
      />
    </div>
  );
};
