import { openai } from "@/lib/ai/openai";
import {
  AnxietySupportRequest,
  AnxietySupportResult,
  AnxietySupportResultZodSchema,
  SupportedReasoningLocale,
} from "./types";
import { LOCATION_CONTEXT, SYMPTOM_CONTEXT } from "./helpers";
import {
  ANXIETY_SUPPORT_SYSTEM_PROMPT,
  ANXIETY_SUPPORT_TRANSLATION_PROMPT,
} from "./prompts";
import { anxietySupportJsonSchema } from "./schema";

const MODEL = "gpt-5-nano";

function buildModelInput(input: AnxietySupportRequest, correction?: string) {
  return {
    location: input.location,
    symptoms: input.symptoms,
    location_context: LOCATION_CONTEXT[input.location],
    symptom_context: input.symptoms.map((symptom) => ({
      symptom,
      ...SYMPTOM_CONTEXT[symptom],
    })),
    correction,
  };
}

export async function generateAIResponse(
  input: AnxietySupportRequest,
  correction?: string,
): Promise<AnxietySupportResult> {
  const response = await openai.responses.create({
    model: MODEL,
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: `${ANXIETY_SUPPORT_SYSTEM_PROMPT}

Write the response in English.`,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: JSON.stringify(buildModelInput(input, correction)),
          },
        ],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "anxiety_support_result",
        schema: anxietySupportJsonSchema,
      },
    },
  });

  if (!response.output_text) {
    throw new Error("Model returned no output_text");
  }

  return AnxietySupportResultZodSchema.parse(JSON.parse(response.output_text));
}

export async function translateSupportResult(
  source: AnxietySupportResult,
  targetLocale: Exclude<SupportedReasoningLocale, "en">,
): Promise<AnxietySupportResult> {
  const response = await openai.responses.create({
    model: "gpt-5-nano",
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: ANXIETY_SUPPORT_TRANSLATION_PROMPT,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: JSON.stringify({
              target_locale: targetLocale,
              source,
            }),
          },
        ],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "translated_anxiety_support_result",
        schema: anxietySupportJsonSchema,
      },
    },
  });

  if (!response.output_text) {
    throw new Error(`Model returned no output_text for locale ${targetLocale}`);
  }

  return AnxietySupportResultZodSchema.parse(JSON.parse(response.output_text));
}
