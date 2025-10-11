import { auth } from "@/lib/auth/auth";
import Journal from "./_components/Journal";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import prisma from "../../../../lib/prisma";
import { DateTime } from "luxon";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCheck, Frown, Smile } from "lucide-react";
import { TZ } from "@/lib/timezone";
import { TaxonomyType } from "@prisma/client";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user || user.deletedAt) {
    redirect("/");
  }

  const taxonomies = await prisma.taxonomy.findMany({});
  const locationOptions = taxonomies.filter(
    (t) => t.type === TaxonomyType.LOCATION,
  );
  const avoidanceReasons = taxonomies.filter(
    (t) => t.type === TaxonomyType.AVOIDANCE_REASON,
  );
  const symptomOptions = taxonomies.filter(
    (t) => t.type === TaxonomyType.SYMPTOM,
  );

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
      <div className="p-4">
        <div className="mb-3 flex flex-col justify-center">
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
          <div className="mt-8" />
          <Card
            className={cn(
              "w-full cursor-pointer rounded-4xl border-gray-100 bg-gray-50 py-4 transition-all duration-300 hover:shadow-lg",
            )}
          >
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="text-center">
                  <h5 className="font-light text-gray-500">
                    {DateTime.fromJSDate(journalEntry.createdAt)
                      .setZone(TZ)
                      .toFormat("yyyy LLL dd")}
                  </h5>
                  {journalEntry.hasAnxietyAttack ? (
                    <>
                      <div className="shrink-0">
                        <Frown />
                      </div>
                      <h4>You will be okay and do better!</h4>
                    </>
                  ) : (
                    <>
                      <div className="shrink-0">
                        <Smile />
                      </div>
                      <h4>Great! Keep going</h4>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Journal
        locationOptions={locationOptions}
        avoidanceReasons={avoidanceReasons}
        symptomOptions={symptomOptions}
      />
    </div>
  );
}

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Exposure Tracker",
};
