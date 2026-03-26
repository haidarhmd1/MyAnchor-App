import { z } from "zod";

export const LocationSchema = z.enum([
  "gym",
  "work",
  "cafe",
  "transport",
  "home",
  "social_gathering",
]);

export const SymptomSchema = z.enum([
  "racing_heart",
  "shortness_of_breath",
  "dizziness",
  "chest_tightness",
  "nausea",
  "tingling",
  "sweating",
  "hot_flush",
  "shaking",
  "blurred_vision",
  "derealization_depersonalization",
  "cold_chills",
]);

export const SupportedReasoningLocaleSchema = z.enum([
  "en",
  "de",
  "ar",
  "ar-LB",
]);
export type SupportedReasoningLocale = z.infer<
  typeof SupportedReasoningLocaleSchema
>;

export const AnxietySupportRequestSchema = z.object({
  location: LocationSchema,
  symptoms: z.array(SymptomSchema).min(1).max(12),
  locale: SupportedReasoningLocaleSchema.default("en"),
});

export type AnxietySupportRequest = z.infer<typeof AnxietySupportRequestSchema>;

export const ResponseIntentSchema = z.enum([
  "regulate_and_continue",
  "pause_and_step_away",
  "seek_support_person",
  "seek_medical_attention",
]);

export const AnxietySupportResultZodSchema = z.object({
  title: z.string(),
  intro: z.string(),
  mechanism: z.string(),
  symptom_explanations: z
    .array(
      z.object({
        symptom: SymptomSchema,
        why_it_can_happen_with_anxiety: z.string(),
      }),
    )
    .min(1)
    .max(12),
  what_to_do_now: z.array(z.string()).min(1),
  location_support: z.string(),
  catastrophic_thought_reframe: z.string(),
  tolerance_message: z.string(),
  reassurance_without_certainty: z.string(),
  affirmation: z.string(),
  red_flags: z.array(z.string()).min(1),
  response_intent: ResponseIntentSchema,
});

export type AnxietySupportResult = z.infer<
  typeof AnxietySupportResultZodSchema
>;

export const AnxietySupportPreviewResponseSchema = z.object({
  reasoningEn: AnxietySupportResultZodSchema,
  reasoning: AnxietySupportResultZodSchema,
  reasoningLocale: SupportedReasoningLocaleSchema,
});

export type AnxietySupportPreviewResponse = z.infer<
  typeof AnxietySupportPreviewResponseSchema
>;
