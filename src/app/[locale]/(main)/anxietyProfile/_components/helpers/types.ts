export type SupportedReasoningLocale = "en" | "de" | "ar" | "ar-LB";

export type RelativeSignalLevel = "none" | "low" | "moderate" | "high";
export type ScreeningConfidence = "low" | "moderate";

export type DerivedAnxietyProfile = {
  schemaVersion: "anxiety_profile";
  generatedFrom: "screening_and_maintaining_factors";
  localeReady: true;
  interpretationGuardrails: {
    screeningOnly: true;
    nonDiagnostic: true;
    relativeInterpretationOnly: true;
    clinicianAssessmentStillNeeded: true;
  };
  summary: {
    dominantPattern:
      | "panic_cycle"
      | "generalized_worry"
      | "mixed_anxiety"
      | "uncertain";
    secondaryPatterns: Array<
      | "panic_maintainers"
      | "worry_maintainers"
      | "impairment"
      | "rule_out_uncertainty"
    >;
    confidence: ScreeningConfidence;
    rationale: string;
  };
  screeners: {
    gad7: {
      total: number;
      severityBand: "minimal" | "mild" | "moderate" | "severe";
      durationSixMonthsOrMore: boolean | null;
      uncontrollableWorryCorePresent: boolean;
      possibleSignal: boolean;
      relativeSignal: RelativeSignalLevel;
    };
    panic: {
      peakSymptomCount: number;
      panicAttackSignal: boolean;
      recurrentAttackSignal: boolean;
      unexpectedAttackSignal: boolean | null;
      oneMonthConcernOrBehaviorChangeSignal: boolean | null;
      possibleSignal: boolean;
      relativeSignal: RelativeSignalLevel;
    };
  };
  maintainingFactors: {
    dominantLoop: "panic" | "worry" | "mixed" | "low_signal";
    worry: {
      total: number;
      relativeSignal: RelativeSignalLevel;
      factors: Array<{
        id:
          | "reassuranceSeeking"
          | "checkingAndResearching"
          | "overPreparing"
          | "avoidingUncertainty"
          | "mentalReviewing";
        score: number;
        label: string;
      }>;
      highlights: string[];
    };
    panic: {
      total: number;
      relativeSignal: RelativeSignalLevel;
      factors: Array<{
        id:
          | "bodyScanning"
          | "carryingSafetyItems"
          | "escapePlanning"
          | "avoidingPhysicalExertion"
          | "needingSafePersonOrExit";
        score: number;
        label: string;
      }>;
      highlights: string[];
    };
  };
  impairment: {
    maxLevel: "none" | "mild" | "moderate" | "marked" | "severe";
    clinicallyMeaningful: boolean;
  };
  cbtFormulation: {
    focus: "panic_cycle" | "generalized_worry" | "mixed_anxiety" | "uncertain";
    whyThisFocus: string;
    maintainingLoop: string;
    targets: {
      interpretation: string;
      behavior: string;
      relearning: string;
    };
    psychoeducationHooks: string[];
  };
  evidenceSnapshot: {
    bodyAlarmMisinterpretationLikely: boolean;
    reassuranceMaintenanceLikely: boolean;
    escapeMaintenanceLikely: boolean;
    intoleranceOfUncertaintyLikely: boolean;
    notesForModel: string[];
  };
  ruleOutsAndLimits: {
    cautionFlags: string[];
    missingCriticalData: string[];
  };
  nextSteps: string[];
  uiHints: {
    tone: "warm_clear_grounded";
    showCrisisBoundary: boolean;
    emphasizeMaintenanceLoop: boolean;
    preferSimpleLanguage: true;
  };
};
