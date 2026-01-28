import prisma from "../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";
import { TZ } from "@/lib/timezone";
import z from "zod";
import { getUserOrThrow } from "@/lib/auth/auth-helpers";
import { momentLogFormSchema } from "@/lib/zod.types";

export const GET = async () => {
  const { userId } = await getUserOrThrow();
  const start = DateTime.now().setZone(TZ).startOf("day");
  const end = start.endOf("day");

  const momentLog = await prisma.momentLog.findFirst({
    where: {
      userId,
      deletedAt: null,
      createdAt: {
        gte: start.toJSDate(),
        lte: end.toJSDate(),
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ momentLog }, { status: 200 });
};

export const POST = async (request: NextRequest) => {
  const { userId } = await getUserOrThrow();
  const body = await request.json();
  const parsed = momentLogFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: z.treeifyError(parsed.error) },
      { status: 400 },
    );
  }

  const { location, urge, actionTaken } = parsed.data;

  const newMomentLogEntry = await prisma.momentLog.create({
    data: {
      userId,
      location,
      urge,
      actionTaken: actionTaken ?? "",
    },
  });
  return new Response(JSON.stringify(newMomentLogEntry), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
