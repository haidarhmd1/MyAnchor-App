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
import { apiErrorResponse } from "@/lib/api-errors";
import { recordHealthDataConsent } from "@/lib/consent";
import { idempotentJson } from "@/lib/idempotency";

export const GET = async (request: NextRequest) => {
  try {
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
  } catch (error) {
    return apiErrorResponse(error, "moment_log_read_failed", request);
  }
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

    await recordHealthDataConsent(userId);

    return idempotentJson({
      request,
      userId,
      route: "/api/momentLog",
      execute: async (tx) => {
        const momentLog = await createMomentLog({
          userId,
          input: { location, symptoms },
          aiResponseEn: reasoningEn,
          database: tx,
        });

        if (reasoningLocale !== "en") {
          await upsertMomentLogTranslation({
            momentLogId: momentLog.id,
            locale: reasoningLocale,
            content: reasoning,
            database: tx,
          });
        }

        return {
          body: { id: momentLog.id },
          status: 201,
        };
      },
    });
  } catch (error) {
    return apiErrorResponse(error, "moment_log_create_failed", request);
  }
};
