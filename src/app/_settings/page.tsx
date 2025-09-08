import { Appearance } from "../(main)/profile/_components/Appearance/Appearance";
import { Notifications } from "../(main)/profile/_components/Notifications/Notifications";

export default function SettingsPage() {
  return (
    <div className="py-4">
      <Appearance />
      <Notifications />
    </div>
  );
}
