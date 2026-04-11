import { z } from "zod";

export const RelativeSignalLevelSchema = z.enum([
  "none",
  "low",
  "moderate",
  "high",
]);
export const ScreeningConfidenceSchema = z.enum(["low", "moderate"]);
export const DerivedAnxietyProfileSchema = z.object({
  schemaVersion: z.literal("anxiety_profile"),
  generatedFrom: z.literal("screening_and_maintaining_factors"),
  localeReady: z.literal(true),

  interpretationGuardrails: z.object({
    screeningOnly: z.literal(true),
    nonDiagnostic: z.literal(true),
    relativeInterpretationOnly: z.literal(true),
    clinicianAssessmentStillNeeded: z.literal(true),
  }),

  summary: z.object({
    dominantPattern: z.enum([
      "panic_cycle",
      "generalized_worry",
      "mixed_anxiety",
      "uncertain",
    ]),
    secondaryPatterns: z.array(
      z.enum([
        "panic_maintainers",
        "worry_maintainers",
        "impairment",
        "rule_out_uncertainty",
      ]),
    ),
    confidence: ScreeningConfidenceSchema,
    rationale: z.string(),
  }),

  screeners: z.object({
    gad7: z.object({
      total: z.number(),
      severityBand: z.enum(["minimal", "mild", "moderate", "severe"]),
      durationSixMonthsOrMore: z.boolean().nullable(),
      uncontrollableWorryCorePresent: z.boolean(),
      possibleSignal: z.boolean(),
      relativeSignal: RelativeSignalLevelSchema,
    }),
    panic: z.object({
      peakSymptomCount: z.number(),
      panicAttackSignal: z.boolean(),
      recurrentAttackSignal: z.boolean(),
      unexpectedAttackSignal: z.boolean().nullable(),
      oneMonthConcernOrBehaviorChangeSignal: z.boolean().nullable(),
      possibleSignal: z.boolean(),
      relativeSignal: RelativeSignalLevelSchema,
    }),
  }),

  maintainingFactors: z.object({
    dominantLoop: z.enum(["panic", "worry", "mixed", "low_signal"]),

    worry: z.object({
      total: z.number(),
      relativeSignal: RelativeSignalLevelSchema,
      factors: z.array(
        z.object({
          id: z.enum([
            "reassuranceSeeking",
            "checkingAndResearching",
            "overPreparing",
            "avoidingUncertainty",
            "mentalReviewing",
          ]),
          score: z.number(),
          label: z.string(),
        }),
      ),
      highlights: z.array(z.string()),
    }),

    panic: z.object({
      total: z.number(),
      relativeSignal: RelativeSignalLevelSchema,
      factors: z.array(
        z.object({
          id: z.enum([
            "bodyScanning",
            "carryingSafetyItems",
            "escapePlanning",
            "avoidingPhysicalExertion",
            "needingSafePersonOrExit",
          ]),
          score: z.number(),
          label: z.string(),
        }),
      ),
      highlights: z.array(z.string()),
    }),
  }),

  impairment: z.object({
    maxLevel: z.enum(["none", "mild", "moderate", "marked", "severe"]),
    clinicallyMeaningful: z.boolean(),
  }),

  cbtFormulation: z.object({
    focus: z.enum([
      "panic_cycle",
      "generalized_worry",
      "mixed_anxiety",
      "uncertain",
    ]),
    whyThisFocus: z.string(),
    maintainingLoop: z.string(),
    targets: z.object({
      interpretation: z.string(),
      behavior: z.string(),
      relearning: z.string(),
    }),
    psychoeducationHooks: z.array(z.string()),
  }),

  evidenceSnapshot: z.object({
    bodyAlarmMisinterpretationLikely: z.boolean(),
    reassuranceMaintenanceLikely: z.boolean(),
    escapeMaintenanceLikely: z.boolean(),
    intoleranceOfUncertaintyLikely: z.boolean(),
    notesForModel: z.array(z.string()),
  }),

  ruleOutsAndLimits: z.object({
    cautionFlags: z.array(z.string()),
    missingCriticalData: z.array(z.string()),
  }),

  nextSteps: z.array(z.string()),

  uiHints: z.object({
    tone: z.literal("warm_clear_grounded"),
    showCrisisBoundary: z.boolean(),
    emphasizeMaintenanceLoop: z.boolean(),
    preferSimpleLanguage: z.literal(true),
  }),
});

export type RelativeSignalLevel = z.infer<typeof RelativeSignalLevelSchema>;
export type ScreeningConfidence = z.infer<typeof ScreeningConfidenceSchema>;

export const AnxietyProfilePreviewRequestSchema = z.object({
  profile: DerivedAnxietyProfileSchema,
  locale: z.string().optional(),
});

export type AnxietyProfilePreviewRequest = z.infer<
  typeof AnxietyProfilePreviewRequestSchema
>;
