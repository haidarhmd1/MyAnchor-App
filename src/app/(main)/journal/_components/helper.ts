import { Taxonomy, WhenDidItHappen } from "@prisma/client";

export interface FormJournalType {
  hasAnxietyAttack?: boolean;
  hasAvoidedSituations?: boolean;
  typesOfSituationYouAvoided?: string[];
  typesOfSituationYouWereIn?: string[];
  whyYourWhereAvoidingIt?: string[];
  typesOfBodySymptoms?: string[];
  whenDidItHappen?: WhenDidItHappen;
  anxietyLevelRating?: number;
}

// used it for the bare minimum to not pass dozens of T1 | T2 | T3 types when changing anything
export type FormFieldType = {
  id: string;
  label: string;
  description: string | null;
  whenDidItHappen?: WhenDidItHappen;
  TaxonomyType?: Taxonomy[];
};

export type WhenDidItHappenType = {
  id: string;
  label: string;
  description: string;
  whenDidItHappen: WhenDidItHappen;
};

export const whenDidItHappenConst: WhenDidItHappenType[] = [
  {
    id: "1",
    label: "In the morning",
    description: "",
    whenDidItHappen: WhenDidItHappen.MORNING,
  },
  {
    id: "2",
    label: "At noon",
    description: "",
    whenDidItHappen: WhenDidItHappen.NOON,
  },
  {
    id: "3",
    label: "In the afternoon",
    description: "",
    whenDidItHappen: WhenDidItHappen.AFTERNOON,
  },
  {
    id: "4",
    label: "In the evening",
    description: "",
    whenDidItHappen: WhenDidItHappen.EVENING,
  },
  {
    id: "5",
    label: "At night",
    description: "",
    whenDidItHappen: WhenDidItHappen.NIGHT,
  },
];

export const BASE_STEP = [
  {
    id: "hasAnxietyAttack",
    title: "Anxiety attack",
    subtitle: "Did you have had an anxiety attack?",
  },
] as const;

export const AVOIDANCE_STEPS = [
  {
    id: "hasAvoidedSituations",
    title: "Avoidance",
    subtitle: "Did you avoid any situations?",
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
    id: "whenDidItHappen",
    title: "When did it happen?",
    subtitle: "Tell us when this happened?",
  },
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
