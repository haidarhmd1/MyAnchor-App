import { NextResponse } from "next/server";
import { normalizeReasoningLocale } from "@/lib/ai/normalizeReasoningLocale";
import { AnxietyProfilePreviewRequestSchema } from "@/lib/ai/anxietyProfile/schema/request.schema";
import { AnxietyProfilePreviewResponseSchema } from "@/lib/ai/anxietyProfile/schema/response.schema";
import { generateAnxietyProfilePreview } from "@/lib/ai/anxietyProfile/service";
import { getUserOrThrow } from "@/lib/auth/auth-helpers";
import { apiErrorResponse, RateLimitError } from "@/lib/api-errors";
import { takeFixedWindowLimit } from "@/lib/rate-limit";
import { recordHealthDataConsent } from "@/lib/consent";

type AnxietyProfileDependencies = {
  authenticate: typeof getUserOrThrow;
  generate: typeof generateAnxietyProfilePreview;
  takeLimit: typeof takeFixedWindowLimit;
};

export function createAnxietyProfilePost(
  dependencies: AnxietyProfileDependencies = {
    authenticate: getUserOrThrow,
    generate: generateAnxietyProfilePreview,
    takeLimit: takeFixedWindowLimit,
  },
) {
  return async function POST(req: Request) {
    try {
      const { userId } = await dependencies.authenticate();
      const allowed = await dependencies.takeLimit({
        key: `ai:profile:user:${userId}`,
        limit: 10,
        windowSeconds: 10 * 60,
      });
      if (!allowed) throw new RateLimitError();

      const body = await req.json();
      const parsed = AnxietyProfilePreviewRequestSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid request body", details: parsed.error.flatten() },
          { status: 400 },
        );
      }

      await recordHealthDataConsent(userId);
      const locale = normalizeReasoningLocale(parsed.data.locale ?? "en");
      const preview = await dependencies.generate({
        profile: parsed.data.profile,
        locale,
      });

      return NextResponse.json(
        AnxietyProfilePreviewResponseSchema.parse(preview),
      );
    } catch (error) {
      return apiErrorResponse(error, "anxiety_profile_preview_failed", req);
    }
  };
}
