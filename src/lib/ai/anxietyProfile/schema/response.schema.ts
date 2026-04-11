import { z } from "zod";

export const AnxietyProfileResponseSchema = z.object({
  big_picture: z.string(),
  what_happens_in_the_moment: z.string(),
  why_it_feels_so_real: z.string(),
  why_it_keeps_repeating: z.string(),
  what_the_real_problem_is: z.string(),
  what_needs_to_change: z.object({
    interpretation: z.string(),
    behavior: z.string(),
    relearning: z.string(),
  }),
  boundary_note: z.string(),
});

export type AnxietyProfileResponse = z.infer<
  typeof AnxietyProfileResponseSchema
>;

export const AnxietyProfilePreviewResponseSchema = z.object({
  reasoning: AnxietyProfileResponseSchema,
  reasoningLocale: z.enum(["en", "de", "ar", "ar-LB"]),
});

export type AnxietyProfilePreviewResponse = z.infer<
  typeof AnxietyProfilePreviewResponseSchema
>;
