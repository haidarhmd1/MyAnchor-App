import { Activity } from "lucide-react";
import { Link } from "@/i18n/navigation";

import ShortcutsCard from "./ShortcutsCard";
import { getTranslations } from "next-intl/server";

export async function EmergencyButton() {
  const t = await getTranslations("panicShortcut");
  return (
    <Link
      href="panic-emergency"
      style={{
        display: "contents",
      }}
    >
      <ShortcutsCard
        title={t("title")}
        subtitle={t("subtitle")}
        icon={<Activity className="h-5 w-5" aria-hidden="true" />}
        gradient={{
          from: "from-red-300",
          to: "to-red-400",
        }}
      />
    </Link>
  );
}
