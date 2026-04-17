import { AnxietySupportResult } from "@/lib/ai/anxietySupport/types";

export type AnxietySupportSection =
  | { id: string; type: "title"; content: string }
  | { id: string; type: "intro"; content: string }
  | { id: string; type: "steps"; title: string; items: string[] }
  | { id: string; type: "text"; title: string; content: string }
  | {
      id: string;
      type: "symptoms";
      title: string;
      items: Array<{ symptom: string; explanation: string }>;
    }
  | { id: string; type: "affirmation"; content: string }
  | { id: string; type: "red_flags"; title: string; items: string[] };

export function toRenderSections(
  result: AnxietySupportResult,
): AnxietySupportSection[] {
  return [
    { id: "title", type: "title", content: result.title },
    { id: "affirmation", type: "affirmation", content: result.affirmation },
    { id: "intro", type: "intro", content: result.intro },
    {
      id: "symptoms",
      type: "symptoms",
      title: "Why these feelings can happen",
      items: result.symptom_explanations.map((item) => ({
        symptom: item.symptom,
        explanation: item.why_it_can_happen_with_anxiety,
      })),
    },
    {
      id: "tolerance_message",
      type: "text",
      title: "How to ride the wave",
      content: result.tolerance_message,
    },
    {
      id: "mechanism",
      type: "text",
      title: "What may be happening in your body",
      content: result.mechanism,
    },
    {
      id: "location_support",
      type: "text",
      title: "For this place specifically",
      content: result.location_support,
    },
    {
      id: "catastrophic_thought_reframe",
      type: "text",
      title: "A more balanced thought",
      content: result.catastrophic_thought_reframe,
    },
    {
      id: "reassurance_without_certainty",
      type: "text",
      title: "Keep perspective",
      content: result.reassurance_without_certainty,
    },
    {
      id: "what_to_do_now",
      type: "steps",
      title: "What to do right now",
      items: result.what_to_do_now,
    },
    {
      id: "red_flags",
      type: "red_flags",
      title: "Get urgent help if",
      items: result.red_flags,
    },
  ];
}
