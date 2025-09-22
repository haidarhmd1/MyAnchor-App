import {
  ChallengeStatus,
  Company,
  Difficulty,
  Gender,
  Prisma,
} from "@prisma/client";
import { z } from "zod";

const JsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([z.string(), z.number(), z.boolean(), z.array(JsonValueSchema)]),
);

export const JournalFormSchema = z.object({
  hasAnxietyAttack: z.boolean().optional(),
  hasAvoidedSituations: z.boolean().optional(),
  typesOfSituationYouAvoided: z.string().array(),
  typesOfSituationYouWereIn: z.string().array(),
  whyYourWhereAvoidingIt: z.string().array(),
  typesOfBodySymptoms: z.string().array(),
  anxietyLevelRating: z.number().optional(),
});

// accept "easy" | "medium" | "hard" and convert to Prisma Difficulty enum
const ChallengeOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  description: z.string().min(1),
  difficulty: z
    .enum(["easy", "medium", "hard"])
    .transform((v) => v.toUpperCase() as Difficulty),
});

export const ChallengeSchema = z.object({
  company: z.nativeEnum(Company),
  challengeOption: ChallengeOptionSchema,
  status: z.nativeEnum(ChallengeStatus).default(ChallengeStatus.NOT_STARTED),
});

// Types
export type ChallengeInput = z.infer<typeof ChallengeSchema>;

export const ChallengeOutcomeSchema = z.object({
  hadCompletedChallenge: z.boolean(),
  hadAnxietyAttack: z.boolean().default(false),
  reasonsNotDone: z.string().array(),
  stoppedEarly: z.boolean().optional(),
  stopReasons: z.string().array(),
  actionsTaken: z.string().array(),
  typesOfBodySymptoms: z.string().array(),
  anxietyLevelRating: z.number().optional(),
  challengeRating: z.number().optional(),
  copingStrategies: z.string().array().optional(),
});

export const UserSchema = z.object({
  name: z.string().nullable(),
  gender: z.enum(Gender).nullable(),
  dob: z.date().nullable(),
  image: z.string().nullable(),
});
