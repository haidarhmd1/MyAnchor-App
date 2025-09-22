import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BookOpenCheck, CheckCheck } from "lucide-react";
import Link from "next/link";
import prisma from "../../../../lib/prisma";
import { DateTime } from "luxon";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { TZ } from "@/lib/timezone";

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
      <div className="mb-3 flex justify-center">
        <Card
          className={cn(
            "w-full cursor-pointer rounded-4xl border-green-50 bg-green-50 py-4 transition-all duration-300 hover:shadow-lg",
          )}
        >
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="shrink-0">
                <CheckCheck className="h-8 w-8 text-green-500" />
              </div>
              <div className="text-center">
                <h5 className="font-light text-green-500">
                  Your daily journal
                </h5>
                <h4 className="text-green-700">Entry for today done!</h4>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Link
      href="/journal"
      style={{
        display: "contents",
      }}
    >
      <div className="mb-3 flex justify-center">
        <Card
          className={cn(
            "w-full cursor-pointer rounded-4xl border-blue-50 bg-blue-50 py-4 transition-all duration-300 hover:shadow-lg",
          )}
        >
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="shrink-0">
                <BookOpenCheck className="h-8 w-8 text-blue-500" />
              </div>
              <div className="text-center">
                <h5 className="font-light text-blue-500">Your daily journal</h5>
                <h4 className="text-blue-700">Journal</h4>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
}
