import { zodResponseFormat } from "openai/helpers/zod";

import type { SupportedReasoningLocale } from "./types";
import {
  AnxietyProfileResponse,
  AnxietyProfileResponseSchema,
} from "./schema/response.schema";
import { openai } from "../openai";
import { DerivedAnxietyProfile } from "@/app/[locale]/(main)/anxietyProfile/_components/helpers/types";
import { buildAnxietyProfilePrompt } from "./prompts";

const MODEL = "gpt-5-nano";

type GenerateStructuredAnxietyProfileParams = {
  profile: DerivedAnxietyProfile;
  locale: SupportedReasoningLocale;
};

async function generateStructuredAnxietyProfile({
  profile,
  locale,
}: GenerateStructuredAnxietyProfileParams): Promise<AnxietyProfileResponse> {
  const completion = await openai.chat.completions.parse({
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You produce structured, non-diagnostic psychoeducational anxiety explanations. Return content that matches the required schema exactly.",
      },
      {
        role: "user",
        content: buildAnxietyProfilePrompt(profile, locale),
      },
    ],
    response_format: zodResponseFormat(
      AnxietyProfileResponseSchema,
      "anxiety_profile_translation",
    ),
  });

  const message = completion.choices[0]?.message;

  if (!message) {
    throw new Error("No model message returned");
  }

  if (message.refusal) {
    throw new Error(`Model refused request: ${message.refusal}`);
  }

  if (!message.parsed) {
    throw new Error("Model did not return parsed structured output");
  }

  return message.parsed;
}

export async function generateAnxietyProfilePreview({
  profile,
  locale = "en",
}: GenerateStructuredAnxietyProfileParams): Promise<{
  reasoning: AnxietyProfileResponse;
  reasoningLocale: SupportedReasoningLocale;
}> {
  const reasoning = await generateStructuredAnxietyProfile({
    profile,
    locale,
  });

  return {
    reasoning,
    reasoningLocale: locale,
  };
}
