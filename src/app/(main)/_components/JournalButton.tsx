import { BookOpenCheck, CheckCheck } from "lucide-react";
import Link from "next/link";
import prisma from "../../../../lib/prisma";
import { DateTime } from "luxon";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { TZ } from "@/lib/timezone";
import ShortcutsCard from "./ShortcutsCard";

export async function JournalButton() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user || user.deletedAt) {
    redirect("/");
  }

  const start = DateTime.now().setZone(TZ).startOf("day");
  const end = start.endOf("day");

  const journalEntry = await prisma.journal.findFirst({
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

  if (journalEntry) {
    return (
      <ShortcutsCard
        title="Your daily journal"
        subtitle="Entry for today done!"
        icon={<CheckCheck className="h-5 w-5" aria-hidden="true" />}
        gradient={{
          from: "bg-green-300",
          to: "bg-green-100",
        }}
      />
    );
  }

  return (
    <Link
      href="/journal"
      style={{
        display: "contents",
      }}
    >
      <ShortcutsCard
        title="Your daily journal"
        subtitle="Journal"
        icon={<BookOpenCheck className="h-5 w-5" aria-hidden="true" />}
        gradient={{
          from: "bg-blue-300",
          to: "bg-blue-100",
        }}
      />
    </Link>
  );
}
