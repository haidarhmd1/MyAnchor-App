import { NextResponse } from "next/server";
import { z } from "zod";
import { normalizeReasoningLocale } from "@/lib/ai/normalizeReasoningLocale";
import { AnxietyProfileResponseSchema } from "@/lib/ai/anxietyProfile/schema/response.schema";
import { DerivedAnxietyProfileSchema } from "@/lib/ai/anxietyProfile/schema/request.schema";
import { getUserOrThrow } from "@/lib/auth/auth-helpers";
import { prisma } from "../../../../../lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { AnxietyScreeningSchema } from "@/app/[locale]/(main)/anxietyProfile/_components/helpers/schema";

const AnxietyProfileSaveRequestSchema = z.object({
  locale: z.string().optional(),
  input: AnxietyScreeningSchema,
  profile: DerivedAnxietyProfileSchema,
  result: AnxietyProfileResponseSchema,
});

export async function POST(req: Request) {
  try {
    const { userId } = await getUserOrThrow();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = AnxietyProfileSaveRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const locale = normalizeReasoningLocale(parsed.data.locale ?? "en");
    const { input, profile, result } = parsed.data;

    const savedEntry = await prisma.anxietyProfileEntry.create({
      data: {
        userId,
        locale,
        input: input as Prisma.InputJsonValue,
        derivedProfile: profile as Prisma.InputJsonValue,
        result: result as Prisma.InputJsonValue,
      },
      select: {
        id: true,
        locale: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        entry: savedEntry,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Save anxiety profile entry error:", error);

    return NextResponse.json(
      {
        error: "Failed to save anxiety profile entry",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
