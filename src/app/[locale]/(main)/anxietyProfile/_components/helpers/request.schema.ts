import { z } from "zod";
import {
  gad7Schema,
  gadDurationOptions,
  impairmentOptions,
  likertSchema,
  panicAttackFrequencyOptions,
  panicSymptomsSchema,
  yesNoUnknownOptions,
} from "./schema";

const maintainingFactorsSchema = z.object({
  worry: z.object({
    reassuranceSeeking: likertSchema,
    checkingAndResearching: likertSchema,
    overPreparing: likertSchema,
    avoidingUncertainty: likertSchema,
    mentalReviewing: likertSchema,
  }),
  panic: z.object({
    bodyScanning: likertSchema,
    carryingSafetyItems: likertSchema,
    escapePlanning: likertSchema,
    avoidingPhysicalExertion: likertSchema,
    needingSafePersonOrExit: likertSchema,
  }),
});

const panicSchema = z.discriminatedUnion("hadSuddenFearSurgesLastMonth", [
  z.object({
    hadSuddenFearSurgesLastMonth: z.literal(false),
  }),
  z.object({
    hadSuddenFearSurgesLastMonth: z.literal(true),
    surgesPeakWithinMinutes: z.boolean(),
    attackFrequencyLastMonth: z.enum(panicAttackFrequencyOptions),
    attacksSeemedUnexpected: z.enum(yesNoUnknownOptions),
    symptomsAtWorstPoint: panicSymptomsSchema,
    persistentConcernMoreThanOneMonth: z.enum(yesNoUnknownOptions),
    maladaptiveBehaviorChangeMoreThanOneMonth: z.enum(yesNoUnknownOptions),
  }),
]);

export const anxietyScreeningRequestSchema = z.object({
  acknowledgements: z.object({
    understandsScreeningOnly: z.literal(true),
    understandsEmergencyLimits: z.literal(true),
  }),
  gadWindowConfirmed: z.literal(true),
  gadDuration: z.enum(gadDurationOptions),
  gad7: gad7Schema,
  panic: panicSchema,
  maintainingFactors: maintainingFactorsSchema,
  impairment: z.object({
    home: z.enum(impairmentOptions),
    workOrStudy: z.enum(impairmentOptions),
    social: z.enum(impairmentOptions),
  }),
  ruleOutFlags: z.object({
    symptomsOnlyDuringSubstanceUse: z.enum(yesNoUnknownOptions),
    symptomsBetterExplainedByMedicalProblem: z.enum(yesNoUnknownOptions),
    recentTraumaCueDominant: z.enum(yesNoUnknownOptions),
    recentManiaLikeState: z.enum(yesNoUnknownOptions),
  }),
  safety: z.object({
    currentlyFeelsUnsafe: z.boolean(),
  }),
});

export type AnxietyScreeningRequestInput = z.infer<
  typeof anxietyScreeningRequestSchema
>;
