export type ResoningOutput = {
  title: string;
  intro: string;
  mechanism: string;
  symptom_explanations: {
    symptom:
      | "racing_heart"
      | "shortness_of_breath"
      | "dizziness"
      | "chest_tightness"
      | "nausea"
      | "tingling"
      | "sweating"
      | "hot_flush"
      | "shaking"
      | "blurred_vision"
      | "derealization_depersonalization"
      | "cold_chills";
    why_it_can_happen_with_anxiety: string;
  }[];
  what_to_do_now: string[];
  location_support: string;
  catastrophic_thought_reframe: string;
  tolerance_message: string;
  reassurance_without_certainty: string;
  affirmation: string;
  red_flags: string[];
  response_intent:
    | "regulate_and_continue"
    | "pause_and_step_away"
    | "seek_support_person"
    | "seek_medical_attention";
};
