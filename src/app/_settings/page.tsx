import { Appearance } from "./_components/Appearance/Appearance";
import { Notifications } from "./_components/Notifications/Notifications";

export default function SettingsPage() {
  return (
    <div className="py-4">
      <Appearance />
      <Notifications />
    </div>
  );
}
