import { TaxonomyType } from "@prisma/client";
import prisma from "../../../../lib/prisma";
import { DateTime } from "luxon";
import { TZ } from "@/lib/timezone";

export const getPastEntries = async (userId: string) =>
  prisma.journal.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

export const getTaxonomies = async () => {
  const taxonomies = await prisma.taxonomy.findMany();
  return {
    locationOptions: taxonomies.filter((t) => t.type === TaxonomyType.LOCATION),
    avoidanceReasons: taxonomies.filter(
      (t) => t.type === TaxonomyType.AVOIDANCE_REASON,
    ),
    symptomOptions: taxonomies.filter((t) => t.type === TaxonomyType.SYMPTOM),
  };
};

export const today = DateTime.now().setZone(TZ).startOf("day");
