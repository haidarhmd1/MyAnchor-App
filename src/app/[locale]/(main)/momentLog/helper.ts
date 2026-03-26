import { DateTime } from "luxon";
import { TZ } from "@/lib/timezone";
import { prisma } from "../../../../../lib/prisma";

export const getPastEntries = async (userId: string) =>
  prisma.momentLog.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

export const today = DateTime.now().setZone(TZ).startOf("day");
