export type SafetyBehaviorOptionItem = {
  id: string;
  slug: string;
};

export type SafetyBehaviorOptions = {
  title: string;
  principle: string;
  options: SafetyBehaviorOptionItem[];
};

export const PARTIAL_NO_REASONS: SafetyBehaviorOptionItem[] = [
  {
    id: "PARTIAL_NO_REASONS_0",
    slug: "left-early",
  },
  {
    id: "PARTIAL_NO_REASONS_1",
    slug: "pause-to-reset",
  },
  {
    id: "PARTIAL_NO_REASONS_2",
    slug: "avoided-speaking-engaging",
  },
  {
    id: "PARTIAL_NO_REASONS_3",
    slug: "checked-symptoms",
  },
  {
    id: "PARTIAL_NO_REASONS_4",
    slug: "sought-reassurance",
  },
  {
    id: "PARTIAL_NO_REASONS_5",
    slug: "delayed-until-felt-ready",
  },
  {
    id: "PARTIAL_NO_REASONS_6",
    slug: "changed-plans-because-of-anxiety",
  },
];

export const OPTION_STAY: SafetyBehaviorOptions = {
  title: "I remain in the situation without escaping or resetting",
  principle: "Principle: Staying is about location and duration, not comfort.",
  options: [
    {
      id: "stay-0",
      slug: "full-duration",
    },
    { id: "stay-1", slug: "no-early-exit" },
    {
      id: "stay-2",
      slug: "no-reset",
    },
    { id: "stay-3", slug: "no-exits" },
    {
      id: "stay-4",
      slug: "no-seat-change",
    },
    {
      id: "stay-5",
      slug: "no-self-check",
    },
    {
      id: "stay-6",
      slug: "despite-symptoms",
    },
    {
      id: "stay-7",
      slug: "natural-end",
    },
  ],
};

export const OPTION_PARTICIPATE: SafetyBehaviorOptions = {
  title: "I engaged with life despite discomfort",
  principle:
    "Principle: Participation does not require presence, clarity, or confidence.",
  options: [
    { id: "participate-0", slug: "responded" },
    {
      id: "participate-1",
      slug: "initiated",
    },
    {
      id: "participate-2",
      slug: "brain-fog",
    },
    {
      id: "participate-3",
      slug: "kept-talking",
    },
    {
      id: "participate-4",
      slug: "raised-voice",
    },
    {
      id: "participate-5",
      slug: "eye-contact",
    },
    {
      id: "participate-6",
      slug: "ordered-paid",
    },
    {
      id: "participate-7",
      slug: "kept-task",
    },
    {
      id: "participate-8",
      slug: "no-ready",
    },
  ],
};

export const OPTION_STRETCH: SafetyBehaviorOptions = {
  title: "I dropped one safety behavior or went slightly beyond avoidance",
  principle:
    "Principle: Stretch ≠ suffering. Stretch = dropping one control habit.",
  options: [
    { id: "stretch-0", slug: "responded" },
    {
      id: "stretch-1",
      slug: "initiated",
    },
    {
      id: "stretch-2",
      slug: "brain-fog",
    },
    {
      id: "stretch-3",
      slug: "kept-talking",
    },
    {
      id: "stretch-4",
      slug: "raised-voice",
    },
    {
      id: "stretch-5",
      slug: "eye-contact",
    },
    {
      id: "stretch-6",
      slug: "ordered-paid",
    },
    {
      id: "stretch-7",
      slug: "kept-task",
    },
    {
      id: "stretch-8",
      slug: "no-ready",
    },
  ],
};
