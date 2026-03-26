import { prisma } from "../../../../lib/prisma";
import { translateSupportResult } from "./service";
import {
  AnxietySupportRequest,
  AnxietySupportRequestSchema,
  AnxietySupportResult,
  AnxietySupportResultZodSchema,
  SupportedReasoningLocale,
} from "./types";

export async function createMomentLog(params: {
  userId: string;
  input: {
    location: string;
    symptoms: string[];
  };
  aiResponseEn: AnxietySupportResult;
}) {
  const parsedInput = AnxietySupportRequestSchema.omit({ locale: true }).parse(
    params.input,
  );

  const parsedReasoningEn = AnxietySupportResultZodSchema.parse(
    params.aiResponseEn,
  );

  return prisma.momentLog.create({
    data: {
      userId: params.userId,
      location: parsedInput.location,
      symptoms: parsedInput.symptoms,
      aiResponseEn: parsedReasoningEn,
    },
  });
}

export async function upsertMomentLogTranslation(params: {
  momentLogId: string;
  locale: Exclude<SupportedReasoningLocale, "en">;
  content: AnxietySupportResult;
}) {
  const parsedContent = AnxietySupportResultZodSchema.parse(params.content);

  return prisma.momentLogTranslation.upsert({
    where: {
      momentLogId_locale: {
        momentLogId: params.momentLogId,
        locale: params.locale,
      },
    },
    update: {
      content: parsedContent,
    },
    create: {
      momentLogId: params.momentLogId,
      locale: params.locale,
      content: parsedContent,
    },
  });
}

export async function getMomentLogLocalizedReasoning(params: {
  momentLogId: string;
  userId: string;
  locale: SupportedReasoningLocale;
}): Promise<AnxietySupportResult> {
  const momentLog = await prisma.momentLog.findFirst({
    where: {
      id: params.momentLogId,
      userId: params.userId,
      deletedAt: null,
    },
    include: {
      translations:
        params.locale === "en"
          ? false
          : {
              where: { locale: params.locale },
              take: 1,
            },
    },
  });

  if (!momentLog) {
    throw new Error("Moment log not found");
  }

  const english = AnxietySupportResultZodSchema.parse(momentLog.aiResponseEn);

  if (params.locale === "en") {
    return english;
  }

  const cached = momentLog.translations?.[0];
  if (cached) {
    return AnxietySupportResultZodSchema.parse(cached.content);
  }

  const translated = await translateSupportResult(english, params.locale);

  await prisma.momentLogTranslation.upsert({
    where: {
      momentLogId_locale: {
        momentLogId: momentLog.id,
        locale: params.locale,
      },
    },
    update: {
      content: translated,
    },
    create: {
      momentLogId: momentLog.id,
      locale: params.locale,
      content: translated,
    },
  });

  return translated;
}
