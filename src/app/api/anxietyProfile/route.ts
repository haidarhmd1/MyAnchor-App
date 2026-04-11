import { NextResponse } from "next/server";

import { normalizeReasoningLocale } from "@/lib/ai/normalizeReasoningLocale";
import { AnxietyProfilePreviewRequestSchema } from "@/lib/ai/anxietyProfile/schema/request.schema";
import { AnxietyProfilePreviewResponseSchema } from "@/lib/ai/anxietyProfile/schema/response.schema";
import { generateAnxietyProfilePreview } from "@/lib/ai/anxietyProfile/service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = AnxietyProfilePreviewRequestSchema.safeParse(body);
    console.log("body", body);

    console.log("parsed", parsed);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const locale = normalizeReasoningLocale(parsed.data.locale ?? "en");

    const preview = await generateAnxietyProfilePreview({
      profile: parsed.data.profile,
      locale,
    });

    const payload = AnxietyProfilePreviewResponseSchema.parse(preview);

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Create anxiety profile preview response error:", error);

    return NextResponse.json(
      {
        error: "Failed to create anxiety profile preview response",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
