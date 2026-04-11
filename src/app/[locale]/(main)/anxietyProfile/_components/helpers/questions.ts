import {
  gad7ItemIds,
  panicAttackFrequencyOptions,
  panicMaintainerIds,
  panicSymptomIds,
  worryMaintainerIds,
  gadDurationOptions,
  impairmentOptions,
  yesNoUnknownOptions,
  GadDurationOption,
  ImpairmentOption,
  PanicAttackFrequencyOption,
  YesNoUnknown,
} from "./schema";

/**
 * Question
 */
export const gad7QuestionLikertLabels: Record<
  (typeof gad7ItemIds)[number],
  string
> = {
  feelingNervousOrOnEdge: "gadStep.gad7ItemQuestions.feelingNervousOrOnEdge",
  difficultyControllingWorry:
    "gadStep.gad7ItemQuestions.difficultyControllingWorry",
  worryingTooMuchAboutDifferentThings:
    "gadStep.gad7ItemQuestions.worryingTooMuchAboutDifferentThings",
  troubleRelaxing: "gadStep.gad7ItemQuestions.troubleRelaxing",
  restlessness: "gadStep.gad7ItemQuestions.restlessness",
  irritability: "gadStep.gad7ItemQuestions.irritability",
  fearThatSomethingAwfulMayHappen:
    "gadStep.gad7ItemQuestions.fearThatSomethingAwfulMayHappen",
};
/**
 * END Question
 */

/**
 * Options
 */
export const likertLabels: Record<number, string> = {
  0: "anxietyScreening.common.likertLabels.0",
  1: "anxietyScreening.common.likertLabels.1",
  2: "anxietyScreening.common.likertLabels.2",
  3: "anxietyScreening.common.likertLabels.3",
};

export const gadDurationLabels: Record<GadDurationOption, string> = {
  lessThan6Months: "anxietyScreening.common.gadDurationLabels.lessThan6Months",
  sixMonthsOrMore: "anxietyScreening.common.gadDurationLabels.sixMonthsOrMore",
  notSure: "anxietyScreening.common.gadDurationLabels.notSure",
};

export const panicFrequencyLabels: Record<PanicAttackFrequencyOption, string> =
  {
    none: "anxietyScreening.common.frequencyLabels.none",
    one: "anxietyScreening.common.frequencyLabels.one",
    twoToThree: "anxietyScreening.common.frequencyLabels.twoToThree",
    fourOrMore: "anxietyScreening.common.frequencyLabels.fourOrMore",
    notSure: "anxietyScreening.common.frequencyLabels.notSure",
  };

export const yesNoUnknownLabels: Record<YesNoUnknown, string> = {
  yes: "anxietyScreening.common.yesNoUnknownLabels.yes",
  no: "anxietyScreening.common.yesNoUnknownLabels.no",
  notSure: "anxietyScreening.common.yesNoUnknownLabels.notSure",
};

export const panicSymptomLabels: Record<
  (typeof panicSymptomIds)[number],
  string
> = {
  palpitationsOrRacingHeart:
    "anxietyScreening.common.panicSymptomLabels.palpitationsOrRacingHeart",
  sweating: "anxietyScreening.common.panicSymptomLabels.sweating",
  tremblingOrShaking:
    "anxietyScreening.common.panicSymptomLabels.tremblingOrShaking",
  shortnessOfBreath:
    "anxietyScreening.common.panicSymptomLabels.shortnessOfBreath",
  chokingSensations:
    "anxietyScreening.common.panicSymptomLabels.chokingSensations",
  chestPainOrDiscomfort:
    "anxietyScreening.common.panicSymptomLabels.chestPainOrDiscomfort",
  nauseaOrAbdominalDistress:
    "anxietyScreening.common.panicSymptomLabels.nauseaOrAbdominalDistress",
  dizzinessOrLightheadedness:
    "anxietyScreening.common.panicSymptomLabels.dizzinessOrLightheadedness",
  chillsOrHeatSensations:
    "anxietyScreening.common.panicSymptomLabels.chillsOrHeatSensations",
  numbnessOrTingling:
    "anxietyScreening.common.panicSymptomLabels.numbnessOrTingling",
  derealizationOrDepersonalization:
    "anxietyScreening.common.panicSymptomLabels.derealizationOrDepersonalization",
  fearOfLosingControlOrGoingCrazy:
    "anxietyScreening.common.panicSymptomLabels.fearOfLosingControlOrGoingCrazy",
  fearOfDying: "anxietyScreening.common.panicSymptomLabels.fearOfDying",
};

export const worryMaintainerLabels: Record<
  (typeof worryMaintainerIds)[number],
  string
> = {
  reassuranceSeeking:
    "anxietyScreening.maintainerStep.worryMaintainerLabels.reassuranceSeeking",
  checkingAndResearching:
    "anxietyScreening.maintainerStep.worryMaintainerLabels.checkingAndResearching",
  overPreparing:
    "anxietyScreening.maintainerStep.worryMaintainerLabels.overPreparing",
  avoidingUncertainty:
    "anxietyScreening.maintainerStep.worryMaintainerLabels.avoidingUncertainty",
  mentalReviewing:
    "anxietyScreening.maintainerStep.worryMaintainerLabels.mentalReviewing",
};

export const panicMaintainerLabels: Record<
  (typeof panicMaintainerIds)[number],
  string
> = {
  bodyScanning:
    "anxietyScreening.maintainerStep.panicMaintainerLabels.bodyScanning",
  carryingSafetyItems:
    "anxietyScreening.maintainerStep.panicMaintainerLabels.carryingSafetyItems",
  escapePlanning:
    "anxietyScreening.maintainerStep.panicMaintainerLabels.escapePlanning",
  avoidingPhysicalExertion:
    "anxietyScreening.maintainerStep.panicMaintainerLabels.avoidingPhysicalExertion",
  needingSafePersonOrExit:
    "anxietyScreening.maintainerStep.panicMaintainerLabels.needingSafePersonOrExit",
};

export const impairmentLabels: Record<ImpairmentOption, string> = {
  none: "anxietyScreening.impairmentStep.impairmentLabels.none",
  mild: "anxietyScreening.impairmentStep.impairmentLabels.mild",
  moderate: "anxietyScreening.impairmentStep.impairmentLabels.moderate",
  marked: "anxietyScreening.impairmentStep.impairmentLabels.marked",
  severe: "anxietyScreening.impairmentStep.impairmentLabels.severe",
};

export type ScreenerStepId =
  | "intro"
  | "gad"
  | "panic"
  | "maintainers"
  | "impact"
  | "ruleouts"
  | "review"
  | "results";

export const allOptionSets = {
  gadDurationOptions,
  panicAttackFrequencyOptions,
  yesNoUnknownOptions,
  impairmentOptions,
};
