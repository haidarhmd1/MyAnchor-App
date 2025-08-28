export interface FormJournalType {
  hasAnxietyAttack?: boolean;
  hasAvoidedSituations?: boolean;
  typesOfSituationYouAvoided?: string[];
  typesOfSituationYouWereIn?: string[];
  whyYourWhereAvoidingIt?: string[];
  typesOfBodySymptoms?: string[];
  anxietyLevelRating?: number;
}

export const BASE_STEP = [
  {
    id: "hasAnxietyAttack",
    title: "Anxiety attack",
    subtitle: "Did you have had an anxiety attack today?",
  },
] as const;

export const AVOIDANCE_STEPS = [
  {
    id: "hasAvoidedSituations",
    title: "Avoidance",
    subtitle: "Did you avoid any situations today?",
  },
  {
    id: "typesOfSituationYouAvoided",
    title: "Situations Avoided",
    subtitle: "Which ones did you avoid?",
  },
  {
    id: "whyYourWhereAvoidingIt",
    title: "Reasons why you avoided it",
    subtitle:
      "Tell me what where you afraid off ? Why you were trying to avoid it?",
  },
  {
    id: "anxietyLevelRating",
    title: "Rate Anxiety",
    subtitle: "How afraid where you that something would happen?",
  },
] as const;

export const HAS_ANXIETY_STEPS = [
  {
    id: "typesOfSituationYouWereIn",
    title: "Situations Faced",
    subtitle: "Where were you / what was happening?",
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

type BaseStep = (typeof BASE_STEP)[number];
type AvoidanceStep = (typeof AVOIDANCE_STEPS)[number];
type AnxietyStep = (typeof HAS_ANXIETY_STEPS)[number];

export type Step = BaseStep | AvoidanceStep | AnxietyStep;
