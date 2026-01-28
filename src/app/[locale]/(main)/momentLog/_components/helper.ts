export const BASE_STEP = [
  {
    id: "location",
    titleKey: "momentLog.steps.location.title",
    subtitleKey: "momentLog.steps.location.question",
  },
  {
    id: "urge",
    titleKey: "momentLog.steps.urge.title",
    subtitleKey: "momentLog.steps.urge.question",
  },
  {
    id: "actionTaken",
    titleKey: "momentLog.steps.actionTaken.title",
    subtitleKey: "momentLog.steps.actionTaken.question",
  },
] as const;

export const PARTIALY_NO = [
  {
    id: "outcomePartialNo",
    titleKey: "challengeSteps.partialNoScreen.title",
    subtitleKey: "challengeSteps.partialNoScreen.subtitle",
  },
] as const;

export const STAYED_BEHAVIOR = [
  {
    id: "outcomeStayed",
    titleKey: "momentLog.steps.outcome-stayed.title",
    subtitleKey: "momentLog.steps.outcome-stayed.subtitle",
  },
] as const;

type BaseStep = (typeof BASE_STEP)[number];
type StayedBehavior = (typeof STAYED_BEHAVIOR)[number];
type PartialNo = (typeof PARTIALY_NO)[number];

export type Step = BaseStep | StayedBehavior | PartialNo;

export type OptionItem = {
  id: string;
  slug: string;
};

export const locationOptions: OptionItem[] = [
  {
    id: "locationOptions_0",
    slug: "gym",
  },
  {
    id: "locationOptions_1",
    slug: "work",
  },
  {
    id: "locationOptions_2",
    slug: "cafe",
  },
  {
    id: "locationOptions_3",
    slug: "transport",
  },
  {
    id: "locationOptions_4",
    slug: "home",
  },
  {
    id: "locationOptions_5",
    slug: "social-gathering",
  },
  {
    id: "locationOptions_6",
    slug: "other",
  },
];

export const urgeOptions: OptionItem[] = [
  {
    id: "urgeOptions_0",
    slug: "leave",
  },
  {
    id: "urgeOptions_1",
    slug: "avoid-engaging",
  },
  {
    id: "urgeOptions_2",
    slug: "pause-to-reset",
  },
  {
    id: "urgeOptions_3",
    slug: "seek-reassurance",
  },
  {
    id: "urgeOptions_4",
    slug: "change-plans",
  },
  {
    id: "urgeOptions_5",
    slug: "nothing-noticeable",
  },
  {
    id: "urgeOptions_6",
    slug: "other",
  },
];

export const actionTakenOptions: OptionItem[] = [
  {
    id: "actionTaken_7",
    slug: "stayed",
  },
  {
    id: "actionTaken_8",
    slug: "stayed-and-participated",
  },
  {
    id: "actionTaken_0",
    slug: "left-early",
  },
  {
    id: "actionTaken_1",
    slug: "pause-to-reset",
  },
  {
    id: "actionTaken_2",
    slug: "avoided-speaking-engaging",
  },
  {
    id: "actionTaken_3",
    slug: "checked-symptoms",
  },
  {
    id: "actionTaken_4",
    slug: "sought-reassurance",
  },
  {
    id: "actionTaken_5",
    slug: "delayed-until-felt-ready",
  },
  {
    id: "actionTaken_6",
    slug: "changed-plans-because-of-anxiety",
  },
];
