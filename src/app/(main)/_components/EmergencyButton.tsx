import { Activity } from "lucide-react";
import Link from "next/link";
import ShortcutsCard from "./ShortcutsCard";

export function EmergencyButton() {
  return (
    <Link
      href="panic-emergency"
      style={{
        display: "contents",
      }}
    >
      <ShortcutsCard
        title="Currently inside a Panic Attack?"
        subtitle="Press the button and take a deep breath, you are safe"
        icon={<Activity className="h-5 w-5" aria-hidden="true" />}
        gradient={{
          from: "from-red-300",
          to: "to-red-400",
        }}
      />
    </Link>
  );
}
