import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";
import { TZ } from "@/lib/timezone";
import z from "zod";
import { getUserOrThrow } from "@/lib/auth/auth-helpers";
import { submitMomentLogSchema } from "@/lib/zod.types";
import { prisma } from "../../../../lib/prisma";
import {
  createMomentLog,
  upsertMomentLogTranslation,
} from "@/lib/ai/anxietySupport/db.service";

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
  try {
    const { userId } = await getUserOrThrow();
    const body = await request.json();
    const parsed = submitMomentLogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: z.treeifyError(parsed.error) },
        { status: 400 },
      );
    }

    const { location, symptoms, reasoningEn, reasoning, reasoningLocale } =
      parsed.data;

    const momentLog = await createMomentLog({
      userId,
      input: { location, symptoms },
      aiResponseEn: reasoningEn,
    });

    if (reasoningLocale !== "en") {
      await upsertMomentLogTranslation({
        momentLogId: momentLog.id,
        locale: reasoningLocale,
        content: reasoning,
      });
    }

    return NextResponse.json({
      momentLog,
      reasoning,
      reasoningLocale,
    });
  } catch (error) {
    console.error("Create moment log error:", error);

    return NextResponse.json(
      {
        error: "Failed to create moment log",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
};
