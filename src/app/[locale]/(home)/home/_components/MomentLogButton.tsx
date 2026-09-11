import { Link } from "@/i18n/navigation";

import { DateTime } from "luxon";
import { TZ } from "@/lib/timezone";
import ShortcutsCard from "./ShortcutsCard";
import { getTranslations } from "next-intl/server";
import { prisma } from "../../../../../../lib/prisma";

export async function MomentLogButton({userId}: { userId: string }) {
  const t = await getTranslations("momentLogShortcut");

  const start = DateTime.now().setZone(TZ).startOf("day");
  const end = start.endOf("day");

  const momentLogEntry = await prisma.momentLog.findFirst({
    where: {
      user: { id: userId, deletedAt: null },
      deletedAt: null,
      createdAt: {
        gte: start.toJSDate(),
        lte: end.toJSDate(),
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (momentLogEntry) {
    return (
      <Link href="/momentLog" style={{ display: "contents" }}>
        <ShortcutsCard
          size="xs"
          className="p-6"
          title={t("title")}
          subtitle={t("doneSubtitle")}
        />
      </Link>
    );
  }

  return (
    <Link href="/momentLog" style={{ display: "contents" }}>
      <ShortcutsCard
        size="xs"
        className="p-6"
        title={t("title")}
        subtitle={t("addMomentSubtitle")}
      />
    </Link>
  );
}

export async function UnauthenticatedMomentLogButton() {
  const t = await getTranslations("momentLogShortcut");

  return (
    <ShortcutsCard
      size="xs"
      className="p-6"
      title={t("title")}
      subtitle={t("addMomentSubtitle")}
    />
  );
}
