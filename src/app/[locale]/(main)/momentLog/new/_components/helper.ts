export const FORM_STEPS = [
  {
    id: "location",
    titleKey: "momentLog.steps.location.title",
    subtitleKey: "momentLog.steps.location.question",
  },
  {
    id: "symptoms",
    titleKey: "momentLog.steps.symptom.title",
    subtitleKey: "momentLog.steps.symptom.question",
  },
  {
    id: "reasoning",
    titleKey: "",
    subtitleKey: "",
  },
] as const;

type BaseStep = (typeof FORM_STEPS)[number];

export type Step = BaseStep;

export type OptionItem = {
  id: string;
  slug: string;
  descriptionSlug?: string;
};

export const locationOptions: OptionItem[] = [
  {
    id: "gym",
    slug: "gym",
  },
  {
    id: "work",
    slug: "work",
  },
  {
    id: "cafe",
    slug: "cafe",
  },
  {
    id: "transport",
    slug: "transport",
  },
  {
    id: "home",
    slug: "home",
  },
  {
    id: "social_gathering",
    slug: "social_gathering",
  },
];

export const feelingOptions: OptionItem[] = [
  {
    id: "racing_heart",
    slug: "Racing heartbeat",
    descriptionSlug: "Fast or pounding heart feels dangerous",
  },
  {
    id: "shortness_of_breath",
    slug: "Shortness of breath",
    descriptionSlug: "Feeling like I can’t get enough air",
  },
  {
    id: "dizziness",
    slug: "Dizziness / lightheadedness",
    descriptionSlug: "Fear of fainting or losing balance",
  },
  {
    id: "chest_tightness",
    slug: "Chest tightness",
    descriptionSlug: "Pressure or heaviness in the chest",
  },
  {
    id: "nausea",
    slug: "Nausea",
    descriptionSlug: "Fear of vomiting or stomach upset",
  },
  {
    id: "tingling",
    slug: "Tingling",
    descriptionSlug: "Pins and needles in face or hands",
  },
  {
    id: "sweating",
    slug: "Sweating",
    descriptionSlug: "Fear of others noticing sweat",
  },
  {
    id: "hot_flush",
    slug: "Hot flush",
    descriptionSlug: "Sudden warmth or blushing",
  },
  {
    id: "shaking",
    slug: "Shaking",
    descriptionSlug: "Trembling or trembling hands",
  },
  {
    id: "blurred_vision",
    slug: "Blurred vision",
    descriptionSlug: "Difficulty focusing, fear of collapse",
  },
  {
    id: "derealization_depersonalization",
    slug: "Derealization / depersonalization",
    descriptionSlug: "Feeling detached or unreal",
  },
  {
    id: "cold_chills",
    slug: "Cold chills",
    descriptionSlug: "Sudden cold or shivering sensations",
  },
];
