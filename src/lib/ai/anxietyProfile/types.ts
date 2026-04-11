export type SupportedReasoningLocale = "en" | "de" | "ar" | "ar-LB";

export type AnxietyResultResponse = {
  big_picture: string;
  what_happens_in_the_moment: string;
  why_it_feels_so_real: string;
  why_it_keeps_repeating: string;
  what_the_real_problem_is: string;
  what_needs_to_change: {
    interpretation: string;
    behavior: string;
    relearning: string;
  };
  boundary_note: string;
};
