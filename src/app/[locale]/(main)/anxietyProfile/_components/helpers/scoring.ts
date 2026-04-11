import { AnxietyResultResponse } from "@/lib/ai/anxietyProfile/types";
import { AnxietyScreeningRequestInput } from "./request.schema";
import {
  gad7ItemIds,
  panicSymptomIds,
  panicMaintainerIds,
  worryMaintainerIds,
  ImpairmentOption,
} from "./schema";
import { DerivedAnxietyProfile, RelativeSignalLevel } from "./types";

export type GAD7Severity = "minimal" | "mild" | "moderate" | "severe";

const impairmentRank: Record<ImpairmentOption, number> = {
  none: 0,
  mild: 1,
  moderate: 2,
  marked: 3,
  severe: 4,
};

const worryMaintainerDescriptions: Record<
  (typeof worryMaintainerIds)[number],
  string
> = {
  reassuranceSeeking: "reassurance seeking",
  checkingAndResearching: "checking or researching",
  overPreparing: "over-preparing",
  avoidingUncertainty: "avoiding uncertainty",
  mentalReviewing: "mental reviewing",
};

const panicMaintainerDescriptions: Record<
  (typeof panicMaintainerIds)[number],
  string
> = {
  bodyScanning: "body scanning",
  carryingSafetyItems: "safety-item reliance",
  escapePlanning: "escape planning",
  avoidingPhysicalExertion: "avoiding feared physical sensations",
  needingSafePersonOrExit: "needing a safe person or easy exit",
};

function scoreGad7Severity(total: number): GAD7Severity {
  if (total >= 15) return "severe";
  if (total >= 10) return "moderate";
  if (total >= 5) return "mild";
  return "minimal";
}

function toRelativeSignal(
  total: number,
  thresholds: { low: number; moderate: number; high: number },
): RelativeSignalLevel {
  if (total >= thresholds.high) return "high";
  if (total >= thresholds.moderate) return "moderate";
  if (total >= thresholds.low) return "low";
  return "none";
}

function yesNoUnknownToNullableBoolean(
  value: "yes" | "no" | "notSure",
): boolean | null {
  if (value === "yes") return true;
  if (value === "no") return false;
  return null;
}

function getMaintainerHighlights<T extends string>(
  source: Record<T, number>,
  labels: Record<T, string>,
): Array<{ id: T; score: number; label: string }> {
  return (Object.entries(source) as Array<[T, number]>)
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([id, score]) => ({ id, score, label: labels[id] }));
}

function getMaxImpairment(
  values: AnxietyScreeningRequestInput["impairment"],
): ImpairmentOption {
  const entries = Object.entries(values) as Array<
    [keyof AnxietyScreeningRequestInput["impairment"], ImpairmentOption]
  >;

  return entries.reduce<ImpairmentOption>((currentMax, [, currentValue]) => {
    return impairmentRank[currentValue] > impairmentRank[currentMax]
      ? currentValue
      : currentMax;
  }, "none");
}

type PanicDerived = {
  peakSymptomCount: number;
  panicAttackSignal: boolean;
  recurrentAttackSignal: boolean;
  unexpectedAttackSignal: boolean | null;
  oneMonthConcernOrBehaviorChangeSignal: boolean | null;
  catastrophicBodyMeaningLikely: boolean;
};

function getPanicSignals(panic: AnxietyScreeningRequestInput["panic"]) {
  if (!panic.hadSuddenFearSurgesLastMonth) {
    return {
      peakSymptomCount: 0,
      panicAttackSignal: false,
      recurrentAttackSignal: false,
      unexpectedAttackSignal: null as boolean | null,
      oneMonthConcernOrBehaviorChangeSignal: null as boolean | null,
      catastrophicBodyMeaningLikely: false,
    };
  }

  const peakSymptomCount = panicSymptomIds.reduce((sum, symptomId) => {
    return sum + (panic.symptomsAtWorstPoint[symptomId] ? 1 : 0);
  }, 0);

  const panicAttackSignal =
    panic.surgesPeakWithinMinutes && peakSymptomCount >= 4;

  const recurrentAttackSignal =
    panic.attackFrequencyLastMonth === "twoToThree" ||
    panic.attackFrequencyLastMonth === "fourOrMore";

  const unexpectedAttackSignal = yesNoUnknownToNullableBoolean(
    panic.attacksSeemedUnexpected,
  );

  const oneMonthConcernOrBehaviorChangeSignal =
    panic.persistentConcernMoreThanOneMonth === "yes" ||
    panic.maladaptiveBehaviorChangeMoreThanOneMonth === "yes"
      ? true
      : panic.persistentConcernMoreThanOneMonth === "no" &&
          panic.maladaptiveBehaviorChangeMoreThanOneMonth === "no"
        ? false
        : null;

  const catastrophicBodyMeaningLikely =
    panic.symptomsAtWorstPoint.fearOfDying ||
    panic.symptomsAtWorstPoint.fearOfLosingControlOrGoingCrazy;

  return {
    peakSymptomCount,
    panicAttackSignal,
    recurrentAttackSignal,
    unexpectedAttackSignal,
    oneMonthConcernOrBehaviorChangeSignal,
    catastrophicBodyMeaningLikely,
  };
}

function buildCbtFormulation(args: {
  gadPossibleSignal: boolean;
  panicPossibleSignal: boolean;
  panicAttackSignal: boolean;
  worryRelativeSignal: RelativeSignalLevel;
  panicRelativeSignal: RelativeSignalLevel;
  clinicallyMeaningfulImpairment: boolean;
  catastrophicBodyMeaningLikely: boolean;
  panicRuleOutConcern: boolean;
}): DerivedAnxietyProfile["cbtFormulation"] {
  const worryLoopStrong =
    args.worryRelativeSignal === "moderate" ||
    args.worryRelativeSignal === "high";
  const panicLoopStrong =
    args.panicRelativeSignal === "moderate" ||
    args.panicRelativeSignal === "high";

  if (
    (args.gadPossibleSignal && args.panicPossibleSignal) ||
    (worryLoopStrong && panicLoopStrong)
  ) {
    return {
      focus: "mixed_anxiety",
      whyThisFocus:
        "The answers suggest two overlapping loops: chronic worry and certainty-seeking on one side, and rapid body-alarm reactions with safety habits on the other.",
      maintainingLoop:
        "Worry keeps the system tense in the background, while body scanning, escape planning, or safety dependence keep sudden alarm episodes feeling dangerous and unfinished.",
      targets: {
        interpretation:
          "Separate future-focused worry from body-alarm reactions instead of treating every anxious feeling as the same problem.",
        behavior:
          "Reduce the reassurance, checking, and safety habits that keep giving short-term relief but stop the brain from updating.",
        relearning:
          "Repeated staying, allowing, and not over-correcting gives the brain better evidence than repeated control attempts.",
      },
      psychoeducationHooks: [
        "Two anxiety loops can coexist without proving two diagnoses.",
        "Short-term relief can maintain both chronic worry and sudden panic.",
        "The main target is the maintenance pattern, not just the symptom list.",
      ],
    };
  }

  if (
    args.panicPossibleSignal ||
    ((args.panicAttackSignal || panicLoopStrong) &&
      args.catastrophicBodyMeaningLikely &&
      !args.panicRuleOutConcern)
  ) {
    return {
      focus: "panic_cycle",
      whyThisFocus:
        "The stronger signal is a body-alarm loop where sensations are quickly treated as danger, fear rises fast, and safety behaviors block relearning.",
      maintainingLoop:
        "A sensation shows up, it gets read as dangerous, fear intensifies the body response, and body scanning, escape planning, or safety aids briefly calm things while teaching the brain the alarm was necessary.",
      targets: {
        interpretation:
          "Shift from reading sensations as signs of catastrophe toward reading them as signs of a sensitive alarm system.",
        behavior:
          "Reduce body scanning, exit dependence, and other safety moves that keep the alarm feeling justified.",
        relearning:
          "The brain updates when sensations are allowed and the predicted catastrophe does not happen, not when every sign of discomfort is controlled.",
      },
      psychoeducationHooks: [
        "The loop is sensation, danger meaning, more fear, then more sensation.",
        "The reaction feels convincing because the brain predicts danger before slow reasoning catches up.",
        "Safety behaviors can preserve fear even when they feel protective.",
      ],
    };
  }

  if (
    args.gadPossibleSignal ||
    (worryLoopStrong && args.clinicallyMeaningfulImpairment)
  ) {
    return {
      focus: "generalized_worry",
      whyThisFocus:
        "The stronger signal is a chronic worry loop built around future threat scanning, difficulty letting uncertainty stay unresolved, and repeated certainty-seeking habits.",
      maintainingLoop:
        "A possible future threat appears, the mind keeps rehearsing it, checking or over-preparing brings short-term relief, and that relief teaches the brain the uncertainty really was dangerous.",
      targets: {
        interpretation:
          "Move from treating uncertainty as danger toward treating uncertainty as uncomfortable but survivable.",
        behavior:
          "Reduce checking, researching, reassurance, and over-preparing when they are mainly trying to erase doubt.",
        relearning:
          "The brain relearns by leaving some uncertainty unanswered and discovering that tension can fall without full certainty.",
      },
      psychoeducationHooks: [
        "Chronic worry often feels like preparation but usually multiplies possible threats.",
        "Trying to get complete certainty teaches the brain that uncertainty is unsafe.",
        "The CBT target is the process that keeps worry alive, not just the topic of worry.",
      ],
    };
  }

  return {
    focus: "uncertain",
    whyThisFocus:
      "The current answers are too mixed, too weak, or too limited by rule-out concerns to justify a narrow formulation focus.",
    maintainingLoop:
      "There is not enough clean evidence yet to say whether the main maintaining process is chronic worry, panic-style alarm learning, both, or something else.",
    targets: {
      interpretation:
        "Do not force a strong meaning from weak or ambiguous screening data.",
      behavior:
        "Collect better information on triggers, feared outcomes, and what happens right after anxiety rises.",
      relearning:
        "Delay disorder-specific assumptions until the maintenance pattern is clearer.",
    },
    psychoeducationHooks: [
      "A careful screen is allowed to remain uncertain.",
      "Mixed anxiety presentations need better mapping before stronger claims.",
      "Better data should come before stronger treatment assumptions.",
    ],
  };
}

function buildRationale(args: {
  focus: DerivedAnxietyProfile["cbtFormulation"]["focus"];
  gadPossibleSignal: boolean;
  panicPossibleSignal: boolean;
  worryRelativeSignal: RelativeSignalLevel;
  panicRelativeSignal: RelativeSignalLevel;
  clinicallyMeaningfulImpairment: boolean;
  cautionFlags: string[];
}): string {
  const parts: string[] = [];

  if (args.gadPossibleSignal) {
    parts.push("generalized worry screening signal present");
  }

  if (args.panicPossibleSignal) {
    parts.push("panic-style screening signal present");
  }

  if (
    args.worryRelativeSignal === "moderate" ||
    args.worryRelativeSignal === "high"
  ) {
    parts.push("worry maintainers elevated");
  }

  if (
    args.panicRelativeSignal === "moderate" ||
    args.panicRelativeSignal === "high"
  ) {
    parts.push("panic maintainers elevated");
  }

  if (args.clinicallyMeaningfulImpairment) {
    parts.push("daily-life impact meaningful");
  }

  if (parts.length === 0) {
    parts.push("screening pattern remains limited or mixed");
  }

  const tail =
    args.cautionFlags.length > 0
      ? " Interpretation should stay cautious because important uncertainty or rule-out flags are present."
      : "";

  return `${args.focus.replace(/_/g, " ")}: ${parts.join(", ")}.${tail}`;
}

export function deriveAnxietyProfile(
  input: AnxietyScreeningRequestInput,
): DerivedAnxietyProfile {
  const gadTotal = gad7ItemIds.reduce(
    (sum, itemId) => sum + input.gad7[itemId],
    0,
  );

  const gadSeverity = scoreGad7Severity(gadTotal);

  const durationSixMonthsOrMore =
    input.gadDuration === "sixMonthsOrMore"
      ? true
      : input.gadDuration === "lessThan6Months"
        ? false
        : null;

  const uncontrollableWorryCorePresent =
    input.gad7.difficultyControllingWorry >= 2 ||
    input.gad7.worryingTooMuchAboutDifferentThings >= 2;

  const {
    peakSymptomCount,
    panicAttackSignal,
    recurrentAttackSignal,
    unexpectedAttackSignal,
    oneMonthConcernOrBehaviorChangeSignal,
    catastrophicBodyMeaningLikely,
  } = getPanicSignals(input.panic);

  const panicRuleOutConcern =
    input.ruleOutFlags.symptomsOnlyDuringSubstanceUse === "yes" ||
    input.ruleOutFlags.symptomsBetterExplainedByMedicalProblem === "yes" ||
    input.ruleOutFlags.recentTraumaCueDominant === "yes" ||
    input.ruleOutFlags.recentManiaLikeState === "yes";

  const possiblePanicSignal =
    panicAttackSignal &&
    recurrentAttackSignal &&
    unexpectedAttackSignal === true &&
    oneMonthConcernOrBehaviorChangeSignal === true &&
    !panicRuleOutConcern;

  const possibleGadSignal =
    gadTotal >= 10 &&
    durationSixMonthsOrMore === true &&
    uncontrollableWorryCorePresent &&
    input.ruleOutFlags.recentManiaLikeState !== "yes";

  const worryFactors = getMaintainerHighlights(
    input.maintainingFactors.worry,
    worryMaintainerDescriptions,
  );

  const panicFactors = getMaintainerHighlights(
    input.maintainingFactors.panic,
    panicMaintainerDescriptions,
  );

  const worryTotal = worryFactors.reduce((sum, item) => sum + item.score, 0);
  const panicTotal = panicFactors.reduce((sum, item) => sum + item.score, 0);

  const worryRelativeSignal = toRelativeSignal(worryTotal, {
    low: 2,
    moderate: 5,
    high: 8,
  });

  const panicRelativeSignal = toRelativeSignal(panicTotal, {
    low: 2,
    moderate: 5,
    high: 8,
  });

  const dominantLoop: DerivedAnxietyProfile["maintainingFactors"]["dominantLoop"] =
    worryTotal < 2 && panicTotal < 2
      ? "low_signal"
      : Math.abs(worryTotal - panicTotal) <= 1
        ? "mixed"
        : worryTotal > panicTotal
          ? "worry"
          : "panic";

  const maxImpairment = getMaxImpairment(input.impairment);
  const clinicallyMeaningfulImpairment =
    impairmentRank[maxImpairment] >= impairmentRank.moderate;

  const reassuranceMaintenanceLikely =
    input.maintainingFactors.worry.reassuranceSeeking >= 2 ||
    input.maintainingFactors.worry.checkingAndResearching >= 2;

  const escapeMaintenanceLikely =
    input.maintainingFactors.panic.escapePlanning >= 2 ||
    input.maintainingFactors.panic.needingSafePersonOrExit >= 2 ||
    input.maintainingFactors.panic.carryingSafetyItems >= 2;

  const intoleranceOfUncertaintyLikely =
    input.maintainingFactors.worry.avoidingUncertainty >= 2 ||
    input.maintainingFactors.worry.overPreparing >= 2 ||
    input.maintainingFactors.worry.mentalReviewing >= 2;

  const cautionFlags = new Set<string>();
  const missingCriticalData = new Set<string>();

  if (durationSixMonthsOrMore === false) {
    cautionFlags.add(
      "Six-month generalized-worry duration threshold is not met.",
    );
  }

  if (durationSixMonthsOrMore === null) {
    cautionFlags.add("Generalized-worry duration is unclear.");
  }

  if (
    input.panic.hadSuddenFearSurgesLastMonth &&
    unexpectedAttackSignal === null
  ) {
    cautionFlags.add("Whether sudden surges were unexpected remains unclear.");
  }

  if (
    input.panic.hadSuddenFearSurgesLastMonth &&
    oneMonthConcernOrBehaviorChangeSignal === null
  ) {
    cautionFlags.add("The one-month panic persistence marker remains unclear.");
  }

  if (panicRuleOutConcern) {
    cautionFlags.add(
      "One or more rule-out flags reduce confidence in a simple anxiety interpretation.",
    );
  }

  if (input.safety.currentlyFeelsUnsafe) {
    cautionFlags.add(
      "Current safety concern present; screening explanation should not be the only next step.",
    );
  }

  if (
    input.ruleOutFlags.symptomsBetterExplainedByMedicalProblem === "notSure"
  ) {
    missingCriticalData.add("Medical explanation remains uncertain.");
  }

  if (input.ruleOutFlags.recentTraumaCueDominant === "notSure") {
    missingCriticalData.add("Trauma-linked cue pattern remains uncertain.");
  }

  if (input.ruleOutFlags.symptomsOnlyDuringSubstanceUse === "notSure") {
    missingCriticalData.add("Substance-related timing remains uncertain.");
  }

  if (input.ruleOutFlags.recentManiaLikeState === "notSure") {
    missingCriticalData.add("Recent mania-like activation remains uncertain.");
  }

  const cbtFormulation = buildCbtFormulation({
    gadPossibleSignal: possibleGadSignal,
    panicPossibleSignal: possiblePanicSignal,
    panicAttackSignal,
    worryRelativeSignal,
    panicRelativeSignal,
    clinicallyMeaningfulImpairment,
    catastrophicBodyMeaningLikely: catastrophicBodyMeaningLikely ?? false,
    panicRuleOutConcern,
  });

  const secondaryPatterns: DerivedAnxietyProfile["summary"]["secondaryPatterns"] =
    [];

  if (worryTotal >= 4) secondaryPatterns.push("worry_maintainers");
  if (panicTotal >= 4) secondaryPatterns.push("panic_maintainers");
  if (clinicallyMeaningfulImpairment) secondaryPatterns.push("impairment");
  if (cautionFlags.size > 0 || missingCriticalData.size > 0) {
    secondaryPatterns.push("rule_out_uncertainty");
  }

  const confidence: DerivedAnxietyProfile["summary"]["confidence"] =
    cautionFlags.size > 1 || missingCriticalData.size > 1 ? "low" : "moderate";

  const nextSteps: string[] = [];

  if (input.safety.currentlyFeelsUnsafe) {
    nextSteps.push(
      "Use immediate real-world support rather than relying only on a screening explanation.",
    );
  }

  nextSteps.push(
    "Treat this result as a starting explanation, not a diagnosis.",
  );
  nextSteps.push(
    "Focus on the habits that keep the alarm cycle going rather than chasing a perfect label.",
  );

  return {
    schemaVersion: "anxiety_profile",
    generatedFrom: "screening_and_maintaining_factors",
    localeReady: true,
    interpretationGuardrails: {
      screeningOnly: true,
      nonDiagnostic: true,
      relativeInterpretationOnly: true,
      clinicianAssessmentStillNeeded: true,
    },
    summary: {
      dominantPattern: cbtFormulation.focus,
      secondaryPatterns,
      confidence,
      rationale: buildRationale({
        focus: cbtFormulation.focus,
        gadPossibleSignal: possibleGadSignal,
        panicPossibleSignal: possiblePanicSignal,
        worryRelativeSignal,
        panicRelativeSignal,
        clinicallyMeaningfulImpairment,
        cautionFlags: Array.from(cautionFlags),
      }),
    },
    screeners: {
      gad7: {
        total: gadTotal,
        severityBand: gadSeverity,
        durationSixMonthsOrMore,
        uncontrollableWorryCorePresent,
        possibleSignal: possibleGadSignal,
        relativeSignal: toRelativeSignal(gadTotal, {
          low: 5,
          moderate: 10,
          high: 15,
        }),
      },
      panic: {
        peakSymptomCount,
        panicAttackSignal,
        recurrentAttackSignal,
        unexpectedAttackSignal,
        oneMonthConcernOrBehaviorChangeSignal,
        possibleSignal: possiblePanicSignal,
        relativeSignal: possiblePanicSignal
          ? "high"
          : panicAttackSignal ||
              panicRelativeSignal === "moderate" ||
              panicRelativeSignal === "high"
            ? "moderate"
            : panicRelativeSignal,
      },
    },
    maintainingFactors: {
      dominantLoop,
      worry: {
        total: worryTotal,
        relativeSignal: worryRelativeSignal,
        factors: worryFactors,
        highlights: worryFactors.slice(0, 3).map((item) => item.label),
      },
      panic: {
        total: panicTotal,
        relativeSignal: panicRelativeSignal,
        factors: panicFactors,
        highlights: panicFactors.slice(0, 3).map((item) => item.label),
      },
    },
    impairment: {
      maxLevel: maxImpairment,
      clinicallyMeaningful: clinicallyMeaningfulImpairment,
    },
    cbtFormulation,
    evidenceSnapshot: {
      bodyAlarmMisinterpretationLikely: catastrophicBodyMeaningLikely ?? false,
      reassuranceMaintenanceLikely,
      escapeMaintenanceLikely,
      intoleranceOfUncertaintyLikely,
      notesForModel: [
        possiblePanicSignal
          ? "Panic-style signal is present, but interpretation must remain formulation-based rather than diagnostic."
          : panicAttackSignal
            ? "There may be panic-attack features without enough evidence for a panic-disorder-style screening signal."
            : "No strong panic-style screening signal is present.",
        possibleGadSignal
          ? "Generalized-worry signal is present based on GAD-7 severity plus duration and uncontrollability indicators."
          : "Generalized-worry interpretation should remain cautious and relative.",
        worryRelativeSignal === "high" || panicRelativeSignal === "high"
          ? "Maintaining-factor totals are relatively elevated and should shape the psychoeducational narrative more than raw symptom presence alone."
          : "Maintaining factors matter even when totals are not strongly elevated.",
        ...Array.from(cautionFlags).map((flag) => `Caution: ${flag}`),
        ...Array.from(missingCriticalData).map(
          (note) => `Missing data: ${note}`,
        ),
      ],
    },
    ruleOutsAndLimits: {
      cautionFlags: Array.from(cautionFlags),
      missingCriticalData: Array.from(missingCriticalData),
    },
    nextSteps,
    uiHints: {
      tone: "warm_clear_grounded",
      showCrisisBoundary: true,
      emphasizeMaintenanceLoop: true,
      preferSimpleLanguage: true,
    },
  };
}

export function buildLocalResultNarrative(
  profile: DerivedAnxietyProfile,
): AnxietyResultResponse {
  const focus = profile.cbtFormulation.focus;

  if (focus === "panic_cycle") {
    return {
      big_picture:
        "Your answers suggest that your alarm system may be reacting too quickly to body sensations. That does not prove a diagnosis. It points to a pattern where normal or stress-linked sensations start to feel dangerous, and that can make the whole system fire harder.",
      what_happens_in_the_moment:
        "A sensation shows up, like a racing heart, dizziness, tightness, or shortness of breath. It gets read as a sign that something is wrong. Fear rises, your body responds even more strongly, and those stronger sensations then seem to confirm the danger.",
      why_it_feels_so_real:
        "It feels real because the reaction is fast, physical, and automatic. Your brain is acting as if danger has already been detected, so the body response arrives before calm reasoning has much chance to slow things down.",
      why_it_keeps_repeating:
        "Checking your body, planning escape routes, needing safety items, or trying to shut sensations down can bring short-term relief. The problem is that this relief can teach the brain that the alarm was necessary, so the loop stays alive.",
      what_the_real_problem_is:
        "The main problem is usually not the sensation itself. The bigger problem is the learned pattern of reading the sensation as danger and responding in ways that keep the fear believable.",
      what_needs_to_change: profile.cbtFormulation.targets,
      boundary_note:
        "This is a simplified explanation based on your answers. It is meant to help you understand a possible pattern, not to diagnose you.",
    };
  }

  if (focus === "generalized_worry") {
    return {
      big_picture:
        "Your answers suggest a pattern of chronic worry, tension, and trying to get ahead of possible problems. That does not prove a diagnosis. It points to an alarm system that may have learned to treat uncertainty itself as something dangerous.",
      what_happens_in_the_moment:
        "A possible problem comes to mind. Your attention locks onto it, your mind starts rehearsing what could go wrong, and the urge to check, prepare, or get reassurance rises. That can create a sense that the threat must be important because it keeps needing so much mental effort.",
      why_it_feels_so_real:
        "It feels real because worry can imitate preparation. The mind keeps generating possibilities, and that constant mental activity makes the danger feel close, urgent, and hard to dismiss.",
      why_it_keeps_repeating:
        "Reassurance, checking, researching, over-preparing, and mentally reviewing can all lower uncertainty for a moment. The problem is that this can teach the brain that uncertainty really was unsafe and had to be controlled.",
      what_the_real_problem_is:
        "The main problem is often not a single topic of worry. It is the repeated pattern of treating uncertainty as danger and then using habits that keep uncertainty feeling intolerable.",
      what_needs_to_change: profile.cbtFormulation.targets,
      boundary_note:
        "This is a simplified explanation based on your answers. It is meant to help you understand a possible pattern, not to diagnose you.",
    };
  }

  if (focus === "mixed_anxiety") {
    return {
      big_picture:
        "Your answers suggest two overlapping anxiety loops: one built around chronic worry and uncertainty, and another built around fast body-alarm reactions. That does not prove two diagnoses. It points to a mixed pattern where both loops may be reinforcing each other.",
      what_happens_in_the_moment:
        "Sometimes anxiety may begin with a future-focused thought, uncertainty, or mental what-if spiral. Other times it may begin with a body sensation that quickly feels dangerous. Once activated, worry, body sensations, and protective behaviors can start feeding each other.",
      why_it_feels_so_real:
        "It feels real because both loops amplify threat. Worry keeps the system tense and watchful, while body-alarm reactions make danger feel immediate and physical.",
      why_it_keeps_repeating:
        "Reassurance, checking, over-preparing, body scanning, escape planning, or relying on safety cues can all reduce distress for a moment. That short-term relief can teach the brain to keep using both loops.",
      what_the_real_problem_is:
        "The main problem is usually not just the thoughts or just the sensations. It is the learned interaction between threat interpretation and protective habits that keeps the alarm system active.",
      what_needs_to_change: profile.cbtFormulation.targets,
      boundary_note:
        "This is a simplified explanation based on your answers. It is meant to help you understand possible patterns, not to diagnose you.",
    };
  }

  return {
    big_picture:
      "Your answers suggest that anxiety may be getting maintained by more than one loop, or the pattern may still be too mixed to narrow down confidently. That does not make your experience unreal. It means a careful explanation should stay honest about uncertainty.",
    what_happens_in_the_moment:
      "Sometimes the cycle may start with a body sensation. Other times it may start with worry, uncertainty, or a mental prediction. Once the alarm is active, thoughts, body sensations, and protective behaviors can all feed each other.",
    why_it_feels_so_real:
      "It feels real because anxiety is not just a thought problem. It is a whole-body threat response. Once that response turns on, your brain and body both start gathering evidence that something is wrong.",
    why_it_keeps_repeating:
      "Short-term relief habits such as checking, reassurance, body monitoring, over-preparing, or leaving situations can calm things briefly. That brief relief can accidentally train the brain to keep using the same alarm pattern next time.",
    what_the_real_problem_is:
      "The main problem is not that you are weak or imagining things. The problem is that a threat-and-response pattern may have become learned and self-reinforcing.",
    what_needs_to_change: profile.cbtFormulation.targets,
    boundary_note:
      "This is a simplified explanation based on your answers. It is meant to help you understand possible patterns, not to diagnose you.",
  };
}
