export const BASE_STEP = [
  {
    id: "hadCompletedChallenge",
    title: "",
    subtitle: "Did you do the challenge?",
  },
] as const;

export const ANXIETY_CHECK = [
  {
    id: "hadAnxietyAttack",
    title: "Did you had an Anxiety attack",
    subtitle: "Did you have had an anxiety attack during this challenge?",
  },
] as const;

export const REASONS_FOR_SKIPPING_CHALLENGE = [
  {
    id: "reasonsNotDone",
    title: "Why did not you do the challenge?",
    subtitle: "Reasons on why you did not it",
  },
] as const;

export const AVOIDANCE_STEPS = [
  {
    id: "stoppedEarly",
    title: "Stopped the Challenge",
    subtitle: "Did you stopped the challenge though?",
  },
] as const;

export const CONTINUED_CHALLENGE = [
  {
    id: "copingStrategies",
    title: "You kept going though you had an attack!",
    subtitle: "Tell me about your motivations on why?",
  },
  {
    id: "typesOfBodySymptoms",
    title: "Body Sensations while continuing the challenge",
    subtitle: "What were the symptoms you had?",
  },
  {
    id: "anxietyLevelRating",
    title: "Rate Anxiety",
    subtitle: "How intense was your anxiety?",
  },
  {
    id: "challengeRating",
    title: "How did you find this challenge?",
    subtitle: "Rate how did you find this challenge",
  },
] as const;

export const STOPPED_CHALLENGE = [
  {
    id: "stopReasons",
    title: "Reasons why you stopped the challenge",
    subtitle: "Tell me why you stopped the challenge?",
  },
  {
    id: "actionsTaken",
    title: "",
    subtitle: "What did you ?",
  },
  {
    id: "typesOfBodySymptoms",
    title: "Body Sensations",
    subtitle: "What did you feel in your body?",
  },
  {
    id: "anxietyLevelRating",
    title: "Rate Anxiety",
    subtitle: "How intense was your anxiety?",
  },
] as const;

export const NO_ANXIETY_STEPS = [
  {
    id: "challengeRating",
    title: "How did you find this challenge?",
    subtitle: "Rate how did you find this challenge",
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
