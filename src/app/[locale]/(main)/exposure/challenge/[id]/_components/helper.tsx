export const BASE_STEP = [
  {
    id: "hadCompletedChallenge",
    titleKey: "challengeSteps.hadCompletedChallenge.title",
    subtitleKey: "challengeSteps.hadCompletedChallenge.subtitle",
  },
] as const;

export const ANXIETY_CHECK = [
  {
    id: "hadAnxietyAttack",
    titleKey: "challengeSteps.hadAnxietyAttack.title",
    subtitleKey: "challengeSteps.hadAnxietyAttack.subtitle",
  },
] as const;

export const REASONS_FOR_SKIPPING_CHALLENGE = [
  {
    id: "reasonsNotDone",
    titleKey: "challengeSteps.reasonsNotDone.title",
    subtitleKey: "challengeSteps.reasonsNotDone.subtitle",
  },
] as const;

export const AVOIDANCE_STEPS = [
  {
    id: "stoppedEarly",
    titleKey: "challengeSteps.stoppedEarly.title",
    subtitleKey: "challengeSteps.stoppedEarly.subtitle",
  },
] as const;

export const CONTINUED_CHALLENGE = [
  {
    id: "copingStrategies",
    titleKey: "challengeSteps.copingStrategies.title",
    subtitleKey: "challengeSteps.copingStrategies.subtitle",
  },
  {
    id: "typesOfBodySymptoms",
    titleKey: "challengeSteps.typesOfBodySymptomsWhileContinuing.title",
    subtitleKey: "challengeSteps.typesOfBodySymptomsWhileContinuing.subtitle",
  },
  {
    id: "anxietyLevelRating",
    titleKey: "challengeSteps.anxietyLevelRating.title",
    subtitleKey: "challengeSteps.anxietyLevelRating.subtitle",
  },
  {
    id: "challengeRating",
    titleKey: "challengeSteps.challengeRating.title",
    subtitleKey: "challengeSteps.challengeRating.subtitle",
  },
] as const;

export const STOPPED_CHALLENGE = [
  {
    id: "stopReasons",
    titleKey: "challengeSteps.stopReasons.title",
    subtitleKey: "challengeSteps.stopReasons.subtitle",
  },
  {
    id: "actionsTaken",
    titleKey: "challengeSteps.actionsTaken.title",
    subtitleKey: "challengeSteps.actionsTaken.subtitle",
  },
  {
    id: "typesOfBodySymptoms",
    titleKey: "challengeSteps.typesOfBodySymptoms.title",
    subtitleKey: "challengeSteps.typesOfBodySymptoms.subtitle",
  },
  {
    id: "anxietyLevelRating",
    titleKey: "challengeSteps.anxietyLevelRating.title",
    subtitleKey: "challengeSteps.anxietyLevelRating.subtitle",
  },
] as const;

export const NO_ANXIETY_STEPS = [
  {
    id: "challengeRating",
    titleKey: "challengeSteps.challengeRating.title",
    subtitleKey: "challengeSteps.challengeRating.subtitle",
  },
] as const;

type BaseStep = (typeof BASE_STEP)[number];
type DidTheChallenge = (typeof ANXIETY_CHECK)[number];
type ReasonsWhyYouDidNotDoTheChallenge =
  (typeof REASONS_FOR_SKIPPING_CHALLENGE)[number];
type AvoidanceStep = (typeof AVOIDANCE_STEPS)[number];
type AnxietyStep = (typeof NO_ANXIETY_STEPS)[number];
type StoppedChallengeStep = (typeof STOPPED_CHALLENGE)[number];
type ContinuedChallengeThoughAnxiety = (typeof CONTINUED_CHALLENGE)[number];

export type Step =
  | BaseStep
  | AvoidanceStep
  | AnxietyStep
  | StoppedChallengeStep
  | ContinuedChallengeThoughAnxiety
  | DidTheChallenge
  | ReasonsWhyYouDidNotDoTheChallenge;
