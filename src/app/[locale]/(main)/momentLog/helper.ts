import prisma from "../../../../../lib/prisma";
import { DateTime } from "luxon";
import { TZ } from "@/lib/timezone";

export const getPastEntries = async (userId: string) =>
  prisma.momentLog.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

export const today = DateTime.now().setZone(TZ).startOf("day");
