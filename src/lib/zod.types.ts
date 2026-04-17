import { Prisma } from "@/generated/prisma/browser";
import {
  ChallengeStatus,
  Gender,
  SocialContext,
} from "@/generated/prisma/enums";
import { z } from "zod";
import {
  AnxietySupportResultZodSchema,
  LocationSchema,
  SupportedReasoningLocaleSchema,
  SymptomSchema,
} from "./ai/anxietySupport/types";

const JsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([z.string(), z.number(), z.boolean(), z.array(JsonValueSchema)]),
);

export const MomentLogFormSchema = z.object({
  location: LocationSchema.optional(),
  symptoms: z.array(SymptomSchema),

  reasoningEn: AnxietySupportResultZodSchema.optional(),
  reasoning: AnxietySupportResultZodSchema.optional(),
  reasoningLocale: SupportedReasoningLocaleSchema.optional(),
});

export const submitMomentLogSchema = z.object({
  location: LocationSchema,
  symptoms: z.array(SymptomSchema).min(1).max(12),

  reasoningEn: AnxietySupportResultZodSchema,
  reasoning: AnxietySupportResultZodSchema,
  reasoningLocale: SupportedReasoningLocaleSchema,
});

export type MomentLogFormValues = z.infer<typeof MomentLogFormSchema>;

export const ChallengeSchema = z.object({
  socialContext: z.enum(SocialContext),
  challengeOptionId: z.cuid(),
  status: z
    .enum(ChallengeStatus)
    .default(ChallengeStatus.NOT_STARTED)
    .optional(),
});

// Types
export type ChallengeInput = z.infer<typeof ChallengeSchema>;

export const ChallengeOutcomeSchema = z.object({
  hadCompletedChallenge: z.boolean(),
  safetyBehavior: z.string(),
});

export const UserSchema = z.object({
  name: z.string().trim().min(1).optional(),
  gender: z.enum(Gender).optional(),
  dob: z.coerce.date().optional(),
  image: z.string().min(1).optional(),
});
