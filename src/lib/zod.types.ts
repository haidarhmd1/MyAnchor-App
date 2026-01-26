import {
  ChallengeStatus,
  Gender,
  Prisma,
  SocialContext,
  WhenDidItHappen,
} from "@prisma/client";
import { z } from "zod";

const JsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([z.string(), z.number(), z.boolean(), z.array(JsonValueSchema)]),
);

export const momentLogFormSchema = z.object({
  location: z.string(),
  urge: z.string(),
  actionTaken: z.string().optional(),
});

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
