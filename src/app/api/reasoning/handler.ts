import { NextResponse } from "next/server";
import {
  AnxietySupportPreviewRequestSchema,
  AnxietySupportPreviewResponseSchema,
} from "@/lib/ai/anxietySupport/types";
import {
  generateAIResponse,
  translateSupportResult,
} from "@/lib/ai/anxietySupport/service";
import { normalizeReasoningLocale } from "@/lib/ai/normalizeReasoningLocale";
import { getUserOrThrow } from "@/lib/auth/auth-helpers";
import { apiErrorResponse, RateLimitError } from "@/lib/api-errors";
import { takeFixedWindowLimit } from "@/lib/rate-limit";
import { recordHealthDataConsent } from "@/lib/consent";

type ReasoningDependencies = {
  authenticate: typeof getUserOrThrow;
  generate: typeof generateAIResponse;
  translate: typeof translateSupportResult;
  takeLimit: typeof takeFixedWindowLimit;
};

export function createReasoningPost(
  dependencies: ReasoningDependencies = {
    authenticate: getUserOrThrow,
    generate: generateAIResponse,
    translate: translateSupportResult,
    takeLimit: takeFixedWindowLimit,
  },
) {
  return async function POST(req: Request) {
    try {
      const { userId } = await dependencies.authenticate();
      const allowed = await dependencies.takeLimit({
        key: `ai:reasoning:user:${userId}`,
        limit: 20,
        windowSeconds: 10 * 60,
      });
      if (!allowed) throw new RateLimitError();

      const body = await req.json();
      const parsed = AnxietySupportPreviewRequestSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid request body", details: parsed.error.flatten() },
          { status: 400 },
        );
      }

      const { location, symptoms } = parsed.data;
      const locale = normalizeReasoningLocale(parsed.data.locale);
      await recordHealthDataConsent(userId);

      const reasoningEn = await dependencies.generate({
        location,
        symptoms,
        locale: "en",
      });
      const reasoning =
        locale === "en"
          ? reasoningEn
          : await dependencies.translate(reasoningEn, locale);

      return NextResponse.json(
        AnxietySupportPreviewResponseSchema.parse({
          reasoningEn,
          reasoning,
          reasoningLocale: locale,
        }),
      );
    } catch (error) {
      return apiErrorResponse(error, "reasoning_preview_failed", req);
    }
  };
}
