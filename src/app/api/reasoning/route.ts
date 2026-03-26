import { NextResponse } from "next/server";
import {
  AnxietySupportPreviewResponseSchema,
  AnxietySupportRequestSchema,
} from "@/lib/ai/anxietySupport/types";

import {
  generateAIResponse,
  translateSupportResult,
} from "@/lib/ai/anxietySupport/service";
import { normalizeReasoningLocale } from "@/lib/ai/normalizeReasoningLocale";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = AnxietySupportRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const location = parsed.data.location;
    const symptoms = parsed.data.symptoms;
    const locale = normalizeReasoningLocale(parsed.data.locale);

    const reasoningEn = await generateAIResponse({
      location,
      symptoms,
      locale: "en",
    });

    const reasoning =
      locale === "en"
        ? reasoningEn
        : await translateSupportResult(reasoningEn, locale);

    const payload = AnxietySupportPreviewResponseSchema.parse({
      reasoningEn,
      reasoning,
      reasoningLocale: locale,
    });

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Create AI preview response error:", error);

    return NextResponse.json(
      {
        error: "Failed to create AI preview response",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
