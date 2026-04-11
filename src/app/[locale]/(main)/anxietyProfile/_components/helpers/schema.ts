import { z } from "zod";

export const LIKERT_0_TO_3 = [0, 1, 2, 3] as const;
export type Likert0To3 = (typeof LIKERT_0_TO_3)[number];

export const gad7ItemIds = [
  "feelingNervousOrOnEdge",
  "difficultyControllingWorry",
  "worryingTooMuchAboutDifferentThings",
  "troubleRelaxing",
  "restlessness",
  "irritability",
  "fearThatSomethingAwfulMayHappen",
] as const;
export type Gad7ItemId = (typeof gad7ItemIds)[number];

export const panicSymptomIds = [
  "palpitationsOrRacingHeart",
  "sweating",
  "tremblingOrShaking",
  "shortnessOfBreath",
  "chokingSensations",
  "chestPainOrDiscomfort",
  "nauseaOrAbdominalDistress",
  "dizzinessOrLightheadedness",
  "chillsOrHeatSensations",
  "numbnessOrTingling",
  "derealizationOrDepersonalization",
  "fearOfLosingControlOrGoingCrazy",
  "fearOfDying",
] as const;
export type PanicSymptomId = (typeof panicSymptomIds)[number];

export const worryMaintainerIds = [
  "reassuranceSeeking",
  "checkingAndResearching",
  "overPreparing",
  "avoidingUncertainty",
  "mentalReviewing",
] as const;
export type WorryMaintainerId = (typeof worryMaintainerIds)[number];

export const panicMaintainerIds = [
  "bodyScanning",
  "carryingSafetyItems",
  "escapePlanning",
  "avoidingPhysicalExertion",
  "needingSafePersonOrExit",
] as const;
export type PanicMaintainerId = (typeof panicMaintainerIds)[number];

export const impairmentOptions = [
  "none",
  "mild",
  "moderate",
  "marked",
  "severe",
] as const;
export type ImpairmentOption = (typeof impairmentOptions)[number];

export const panicAttackFrequencyOptions = [
  "none",
  "one",
  "twoToThree",
  "fourOrMore",
  "notSure",
] as const;
export type PanicAttackFrequencyOption =
  (typeof panicAttackFrequencyOptions)[number];

export const yesNoUnknownOptions = ["yes", "no", "notSure"] as const;
export type YesNoUnknown = (typeof yesNoUnknownOptions)[number];

export const gadDurationOptions = [
  "lessThan6Months",
  "sixMonthsOrMore",
  "notSure",
] as const;
export type GadDurationOption = (typeof gadDurationOptions)[number];

export const likertSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);

export const gad7Schema = z.object({
  feelingNervousOrOnEdge: likertSchema,
  difficultyControllingWorry: likertSchema,
  worryingTooMuchAboutDifferentThings: likertSchema,
  troubleRelaxing: likertSchema,
  restlessness: likertSchema,
  irritability: likertSchema,
  fearThatSomethingAwfulMayHappen: likertSchema,
});

export const panicSymptomsSchema = z.object({
  palpitationsOrRacingHeart: z.boolean().optional(),
  sweating: z.boolean().optional(),
  tremblingOrShaking: z.boolean().optional(),
  shortnessOfBreath: z.boolean().optional(),
  chokingSensations: z.boolean().optional(),
  chestPainOrDiscomfort: z.boolean().optional(),
  nauseaOrAbdominalDistress: z.boolean().optional(),
  dizzinessOrLightheadedness: z.boolean().optional(),
  chillsOrHeatSensations: z.boolean().optional(),
  numbnessOrTingling: z.boolean().optional(),
  derealizationOrDepersonalization: z.boolean().optional(),
  fearOfLosingControlOrGoingCrazy: z.boolean().optional(),
  fearOfDying: z.boolean().optional(),
});

const maintainingFactorsSchema = z.object({
  worry: z
    .object({
      reassuranceSeeking: likertSchema.optional(),
      checkingAndResearching: likertSchema.optional(),
      overPreparing: likertSchema.optional(),
      avoidingUncertainty: likertSchema.optional(),
      mentalReviewing: likertSchema.optional(),
    })
    .optional(),
  panic: z
    .object({
      bodyScanning: likertSchema.optional(),
      carryingSafetyItems: likertSchema.optional(),
      escapePlanning: likertSchema.optional(),
      avoidingPhysicalExertion: likertSchema.optional(),
      needingSafePersonOrExit: likertSchema.optional(),
    })
    .optional(),
});

export const anxietyScreeningSchema = z.object({
  acknowledgements: z.object({
    understandsScreeningOnly: z.literal(true),
    understandsEmergencyLimits: z.literal(true),
  }),
  gadWindowConfirmed: z.literal(true).optional(),
  gadDuration: z.enum(gadDurationOptions).optional(),
  gad7: gad7Schema.partial(),
  panic: z.object({
    hadSuddenFearSurgesLastMonth: z.boolean().optional(),
    surgesPeakWithinMinutes: z.boolean().optional(),
    attackFrequencyLastMonth: z.enum(panicAttackFrequencyOptions).optional(),
    attacksSeemedUnexpected: z.enum(yesNoUnknownOptions).optional(),
    symptomsAtWorstPoint: panicSymptomsSchema.optional(),
    persistentConcernMoreThanOneMonth: z.enum(yesNoUnknownOptions).optional(),
    maladaptiveBehaviorChangeMoreThanOneMonth: z
      .enum(yesNoUnknownOptions)
      .optional(),
  }),
  maintainingFactors: maintainingFactorsSchema.optional(),
  impairment: z.object({
    home: z.enum(impairmentOptions).optional(),
    workOrStudy: z.enum(impairmentOptions).optional(),
    social: z.enum(impairmentOptions).optional(),
  }),
  ruleOutFlags: z.object({
    symptomsOnlyDuringSubstanceUse: z.enum(yesNoUnknownOptions).optional(),
    symptomsBetterExplainedByMedicalProblem: z
      .enum(yesNoUnknownOptions)
      .optional(),
    recentTraumaCueDominant: z.enum(yesNoUnknownOptions).optional(),
    recentManiaLikeState: z.enum(yesNoUnknownOptions).optional(),
  }),
  safety: z.object({
    currentlyFeelsUnsafe: z.boolean().optional(),
  }),
});

export type AnxietyScreeningInput = z.infer<typeof anxietyScreeningSchema>;

export const anxietyScreeningDefaultValues: AnxietyScreeningInput = {
  acknowledgements: {
    understandsScreeningOnly: true,
    understandsEmergencyLimits: true,
  },
  gadWindowConfirmed: true,
  gadDuration: undefined,
  gad7: {
    feelingNervousOrOnEdge: undefined,
    difficultyControllingWorry: undefined,
    worryingTooMuchAboutDifferentThings: undefined,
    troubleRelaxing: undefined,
    restlessness: undefined,
    irritability: undefined,
    fearThatSomethingAwfulMayHappen: undefined,
  },
  panic: {
    hadSuddenFearSurgesLastMonth: undefined,
    surgesPeakWithinMinutes: undefined,
    attackFrequencyLastMonth: undefined,
    attacksSeemedUnexpected: undefined,
    symptomsAtWorstPoint: {
      palpitationsOrRacingHeart: undefined,
      sweating: undefined,
      tremblingOrShaking: undefined,
      shortnessOfBreath: undefined,
      chokingSensations: undefined,
      chestPainOrDiscomfort: undefined,
      nauseaOrAbdominalDistress: undefined,
      dizzinessOrLightheadedness: undefined,
      chillsOrHeatSensations: undefined,
      numbnessOrTingling: undefined,
      derealizationOrDepersonalization: undefined,
      fearOfLosingControlOrGoingCrazy: undefined,
      fearOfDying: undefined,
    },
    persistentConcernMoreThanOneMonth: undefined,
    maladaptiveBehaviorChangeMoreThanOneMonth: undefined,
  },
  maintainingFactors: {
    worry: {
      reassuranceSeeking: undefined,
      checkingAndResearching: undefined,
      overPreparing: undefined,
      avoidingUncertainty: undefined,
      mentalReviewing: undefined,
    },
    panic: {
      bodyScanning: undefined,
      carryingSafetyItems: undefined,
      escapePlanning: undefined,
      avoidingPhysicalExertion: undefined,
      needingSafePersonOrExit: undefined,
    },
  },
  impairment: {
    home: undefined,
    workOrStudy: undefined,
    social: undefined,
  },
  ruleOutFlags: {
    symptomsOnlyDuringSubstanceUse: undefined,
    symptomsBetterExplainedByMedicalProblem: undefined,
    recentTraumaCueDominant: undefined,
    recentManiaLikeState: undefined,
  },
  safety: {
    currentlyFeelsUnsafe: undefined,
  },
};
