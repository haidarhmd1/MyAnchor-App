import { Taxonomy, WhenDidItHappen } from "@prisma/client";

export interface FormJournalType {
  hasAnxietyAttack?: boolean;
  hasAvoidedSituations?: boolean;
  typesOfSituationYouAvoided?: string[];
  typesOfSituationYouWereIn?: string;
  whyYouWereAvoidingIt?: string[];
  typesOfBodySymptoms?: string[];
  whenDidItHappen?: WhenDidItHappen;
  anxietyLevelRating?: number;
}

export type FormFieldType = {
  id: string;
  label: string;
  description: string | null;
  whenDidItHappen?: WhenDidItHappen;
  TaxonomyType?: Taxonomy[];
};

export type WhenDidItHappenOption = {
  id: WhenDidItHappen;
  whenDidItHappen: WhenDidItHappen;
  label: string;
  description: string;
};

export const whenDidItHappenConst: WhenDidItHappenOption[] = [
  {
    id: WhenDidItHappen.MORNING,
    whenDidItHappen: WhenDidItHappen.MORNING,
    label: "journal.journalQuestionnaire.whenDidItHappen.morning",
    description: "",
  },
  {
    id: WhenDidItHappen.NOON,
    whenDidItHappen: WhenDidItHappen.NOON,
    label: "journal.journalQuestionnaire.whenDidItHappen.noon",
    description: "",
  },
  {
    id: WhenDidItHappen.AFTERNOON,
    whenDidItHappen: WhenDidItHappen.AFTERNOON,
    label: "journal.journalQuestionnaire.whenDidItHappen.afternoon",
    description: "",
  },
  {
    id: WhenDidItHappen.EVENING,
    whenDidItHappen: WhenDidItHappen.EVENING,
    label: "journal.journalQuestionnaire.whenDidItHappen.evening",
    description: "",
  },
  {
    id: WhenDidItHappen.NIGHT,
    whenDidItHappen: WhenDidItHappen.NIGHT,
    label: "journal.journalQuestionnaire.whenDidItHappen.night",
    description: "",
  },
];

export type StepId =
  | "hasAnxietyAttack"
  | "hasAvoidedSituations"
  | "typesOfSituationYouAvoided"
  | "typesOfSituationYouWereIn"
  | "whyYouWereAvoidingIt"
  | "typesOfBodySymptoms"
  | "whenDidItHappen"
  | "anxietyLevelRating";

export type Step = {
  id: StepId;
  titleKey: string;
  subtitleKey: string;
};

export const BASE_STEP: Step[] = [
  {
    id: "hasAnxietyAttack",
    titleKey: "journal.journalQuestionnaire.steps.hasAnxietyAttack.title",
    subtitleKey: "journal.journalQuestionnaire.steps.hasAnxietyAttack.subtitle",
  },
];

export const AVOIDANCE_STEPS: Step[] = [
  {
    id: "hasAvoidedSituations",
    titleKey: "journal.journalQuestionnaire.steps.hasAvoidedSituations.title",
    subtitleKey:
      "journal.journalQuestionnaire.steps.hasAvoidedSituations.subtitle",
  },
  {
    id: "typesOfSituationYouAvoided",
    titleKey:
      "journal.journalQuestionnaire.steps.typesOfSituationYouAvoided.title",
    subtitleKey:
      "journal.journalQuestionnaire.steps.typesOfSituationYouAvoided.subtitle",
  },
  {
    id: "whyYouWereAvoidingIt",
    titleKey: "journal.journalQuestionnaire.steps.whyYouWereAvoidingIt.title",
    subtitleKey:
      "journal.journalQuestionnaire.steps.whyYouWereAvoidingIt.subtitle",
  },
  {
    id: "anxietyLevelRating",
    titleKey: "journal.journalQuestionnaire.steps.anxietyLevelRating.title",
    subtitleKey:
      "journal.journalQuestionnaire.steps.anxietyLevelRating.subtitleAvoidance",
  },
];

export const HAS_ANXIETY_STEPS: Step[] = [
  {
    id: "whenDidItHappen",
    titleKey: "journal.journalQuestionnaire.steps.whenDidItHappen.title",
    subtitleKey: "journal.journalQuestionnaire.steps.whenDidItHappen.subtitle",
  },
  {
    id: "typesOfSituationYouWereIn",
    titleKey:
      "journal.journalQuestionnaire.steps.typesOfSituationYouWereIn.title",
    subtitleKey:
      "journal.journalQuestionnaire.steps.typesOfSituationYouWereIn.subtitle",
  },
  {
    id: "typesOfBodySymptoms",
    titleKey: "journal.journalQuestionnaire.steps.typesOfBodySymptoms.title",
    subtitleKey:
      "journal.journalQuestionnaire.steps.typesOfBodySymptoms.subtitle",
  },
  {
    id: "anxietyLevelRating",
    titleKey: "journal.journalQuestionnaire.steps.anxietyLevelRating.title",
    subtitleKey:
      "journal.journalQuestionnaire.steps.anxietyLevelRating.subtitleAttack",
  },
];
