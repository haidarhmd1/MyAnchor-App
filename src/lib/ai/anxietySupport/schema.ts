export const anxietySupportJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    intro: { type: "string" },
    mechanism: { type: "string" },
    symptom_explanations: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          symptom: { type: "string" },
          why_it_can_happen_with_anxiety: { type: "string" },
        },
        required: ["symptom", "why_it_can_happen_with_anxiety"],
      },
    },
    what_to_do_now: {
      type: "array",
      items: { type: "string" },
    },
    location_support: { type: "string" },
    catastrophic_thought_reframe: { type: "string" },
    tolerance_message: { type: "string" },
    reassurance_without_certainty: { type: "string" },
    affirmation: { type: "string" },
    red_flags: {
      type: "array",
      items: { type: "string" },
    },
    response_intent: {
      type: "string",
      enum: [
        "regulate_and_continue",
        "pause_and_step_away",
        "seek_support_person",
        "seek_medical_attention",
      ],
    },
  },
  required: [
    "title",
    "intro",
    "mechanism",
    "symptom_explanations",
    "what_to_do_now",
    "location_support",
    "catastrophic_thought_reframe",
    "tolerance_message",
    "reassurance_without_certainty",
    "affirmation",
    "red_flags",
    "response_intent",
  ],
} as const;
