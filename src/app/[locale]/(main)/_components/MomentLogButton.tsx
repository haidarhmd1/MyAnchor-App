import { BookOpenCheck, CheckCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";

import prisma from "../../../../../lib/prisma";
import { DateTime } from "luxon";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { TZ } from "@/lib/timezone";
import ShortcutsCard from "./ShortcutsCard";
import { getTranslations } from "next-intl/server";

export async function MomentLogButton() {
  const session = await auth();
  const t = await getTranslations("momentLogShortcut");

  if (!session?.user?.id) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

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
      <ShortcutsCard
        size="xs"
        title={t("title")}
        subtitle={t("doneSubtitle")}
        icon={<CheckCheck className="h-5 w-5" aria-hidden="true" />}
        gradient={{
          from: "bg-sky-400",
          to: "bg-sky-100",
        }}
      />
    );
  }

  return (
    <Link href="/momentLog" style={{ display: "contents" }}>
      <ShortcutsCard
        size="sm"
        title={t("title")}
        subtitle={t("ctaSubtitle")}
        icon={<BookOpenCheck className="h-5 w-5" aria-hidden="true" />}
        gradient={{
          from: "bg-blue-600",
          to: "bg-blue-100",
        }}
      />
    </Link>
  );
}

export async function UnauthenticatedMomentLogButton() {
  const t = await getTranslations("momentLogShortcut");

  return (
    <ShortcutsCard
      size="sm"
      title={t("title")}
      subtitle={t("ctaSubtitle")}
      icon={<BookOpenCheck className="h-5 w-5" aria-hidden="true" />}
      gradient={{
        from: "bg-blue-600",
        to: "bg-blue-100",
      }}
    />
  );
}
