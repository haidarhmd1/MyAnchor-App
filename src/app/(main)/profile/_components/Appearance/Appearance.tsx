import { SettingsRow } from "../General/SettingsRow";

export const Appearance = () => {
  return (
    <div>
      <div className="flex flex-col items-start self-stretch pt-4 pb-2">
        <h4>Appearance</h4>
      </div>
      <SettingsRow config="Theme" defaultConfig="System" setting="Light" />
      <SettingsRow
        config="Language"
        defaultConfig="English"
        setting="English"
      />
    </div>
  );
};
