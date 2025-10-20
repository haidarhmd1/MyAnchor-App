import { AlertCircleIcon } from "lucide-react";
import prisma from "../../../../lib/prisma";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import ShortcutsCard from "./ShortcutsCard";
import Link from "next/link";
import { TZ } from "@/lib/timezone";
import { DateTime } from "luxon";

export const QuickAnalytics = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user || user.deletedAt) {
    redirect("/");
  }

  const anxietyAttackJournal = await prisma.journal.findMany({
    where: {
      userId: user.id,
      deletedAt: null,
      hasAnxietyAttack: true,
      createdAt: {
        gte: DateTime.now().setZone(TZ).startOf("month").toJSDate(),
        lte: DateTime.now().setZone(TZ).endOf("month").toJSDate(),
      },
    },
    select: {
      typesOfSituationYouWereIn: true,
      typesOfBodySymptoms: true,
    },
  });

  if (anxietyAttackJournal.length === 0) return null;

  return (
    <div className="pt-4">
      <Link href="/anxiety-analytics">
        <ShortcutsCard
          size="sm"
          icon={<AlertCircleIcon />}
          subtitle={`Anxiety Attack(s): ${anxietyAttackJournal.length}`}
          title="Anxiety Quick overview"
          gradient={{
            from: "from-sky-400",
            to: "to-yellow-200",
          }}
        />
      </Link>
    </div>
  );
};
