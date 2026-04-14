import { Link } from "@/i18n/navigation";

import { DateTime } from "luxon";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { TZ } from "@/lib/timezone";
import ShortcutsCard from "./ShortcutsCard";
import { getTranslations } from "next-intl/server";
import { prisma } from "../../../../../../lib/prisma";

export async function MomentLogButton() {
  const session = await auth();
  const t = await getTranslations("momentLogShortcut");

  if (!session?.user?.id) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.deletedAt) {
    redirect("/");
  }

  const start = DateTime.now().setZone(TZ).startOf("day");
  const end = start.endOf("day");

  const momentLogEntry = await prisma.momentLog.findFirst({
    where: {
      userId: user.id,
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
