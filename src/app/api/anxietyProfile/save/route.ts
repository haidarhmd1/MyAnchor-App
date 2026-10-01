import { NextResponse } from "next/server";
import { z } from "zod";
import { normalizeReasoningLocale } from "@/lib/ai/normalizeReasoningLocale";
import { AnxietyProfileResponseSchema } from "@/lib/ai/anxietyProfile/schema/response.schema";
import { DerivedAnxietyProfileSchema } from "@/lib/ai/anxietyProfile/schema/request.schema";
import { getUserOrThrow } from "@/lib/auth/auth-helpers";
import { Prisma } from "@/generated/prisma/client";
import { AnxietyScreeningSchema } from "@/app/[locale]/(main)/anxietyProfile/_components/helpers/schema";
import { apiErrorResponse } from "@/lib/api-errors";
import { getPrivacyPolicyVersion, HEALTH_DATA_POLICY } from "@/lib/consent";
import { idempotentJson } from "@/lib/idempotency";

const AnxietyProfileSaveRequestSchema = z
  .object({
    locale: z.string().optional(),
    input: AnxietyScreeningSchema,
    profile: DerivedAnxietyProfileSchema,
    result: AnxietyProfileResponseSchema,
  })
  .superRefine((value, context) => {
    const acknowledgements = value.input.acknowledgements;
    if (
      !acknowledgements.understandsScreeningOnly ||
      !acknowledgements.understandsEmergencyLimits ||
      !acknowledgements.consentsToHealthDataProcessing
    ) {
      context.addIssue({
        code: "custom",
        path: ["input", "acknowledgements"],
        message: "Required acknowledgements were not accepted",
      });
    }
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
    const policyVersion = getPrivacyPolicyVersion();

    return idempotentJson({
      request: req,
      userId,
      route: "/api/anxietyProfile/save",
      execute: async (tx) => {
        const entry = await tx.anxietyProfileEntry.create({
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

        const existingConsent = await tx.consent.findFirst({
          where: {
            userId,
            policy: HEALTH_DATA_POLICY,
            version: policyVersion,
            withdrawnAt: null,
          },
        });
        if (!existingConsent) {
          await tx.consent.create({
            data: {
              userId,
              policy: HEALTH_DATA_POLICY,
              version: policyVersion,
            },
          });
        }

        return { body: { entry }, status: 201 };
      },
    });
  } catch (error) {
    return apiErrorResponse(error, "anxiety_profile_save_failed", req);
  }
}
