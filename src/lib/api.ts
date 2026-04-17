import { User } from "next-auth";
import {
  ChallengeOutcomeSchema,
  ChallengeSchema,
  MomentLogFormSchema,
} from "./zod.types";
import { z } from "zod";
import {
  ChallengeStatus,
  Gender,
  SocialContext,
} from "@/generated/prisma/enums";
import {
  Challenge,
  ChallengeOutcome,
  MomentLog,
} from "@/generated/prisma/browser";
import {
  AnxietySupportPreviewResponse,
  AnxietySupportPreviewResponseSchema,
  SupportedReasoningLocale,
} from "./ai/anxietySupport/types";
import { DerivedAnxietyProfile } from "@/app/[locale]/(main)/anxietyProfile/_components/helpers/types";
import { AnxietyScreeningInput } from "@/app/[locale]/(main)/anxietyProfile/_components/helpers/schema";
import { AnxietyProfilePreviewResponse } from "./ai/anxietyProfile/schema/response.schema";
import { AnxietyResultResponse } from "./ai/anxietyProfile/types";

type CreateChallengeInputType = z.infer<typeof ChallengeSchema>;
export async function createChallenge({
  data,
}: {
  data: CreateChallengeInputType;
}): Promise<Challenge> {
  const res = await fetch("/api/challenges", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      socialContext:
        data.socialContext === "ALONE"
          ? SocialContext.ALONE
          : SocialContext.WITH_OTHERS,
      challengeOptionId: data.challengeOptionId,
      status: ChallengeStatus.NOT_STARTED,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create challenge failed: ${res.status} ${text}`);
  }

  return (await res.json()) as Challenge;
}

type ChallengeOutcomeInputType = z.infer<typeof ChallengeOutcomeSchema>;
export async function createChallengeOutcome({
  id,
  data,
}: {
  id: string;
  data: ChallengeOutcomeInputType;
}): Promise<ChallengeOutcome> {
  const res = await fetch(`/api/challenges/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create challenge outcome failed: ${res.status} ${text}`);
  }

  return (await res.json()) as ChallengeOutcome;
}

type MomentLogInputType = z.infer<typeof MomentLogFormSchema>;
export async function createMomentLogEntry({
  data,
}: {
  data: MomentLogInputType;
}): Promise<MomentLog> {
  const res = await fetch("/api/momentLog", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create moment log entry failed: ${res.status} ${text}`);
  }
  return (await res.json()) as MomentLog;
}

export async function getAnxietyProfilePreview({
  profile,
  locale,
}: {
  profile: DerivedAnxietyProfile;
  locale?: string;
}): Promise<AnxietyProfilePreviewResponse> {
  const res = await fetch("/api/anxietyProfile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      profile,
      locale,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }

  const result = await res.json();
  return result;
}

export async function getAnxietyProfileEntry() {
  const res = await fetch("/api/anxietyProfile", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }

  const result = await res.json();
  return result;
}

export async function deleteAnxietyProfileEntry(id: string) {
  const res = await fetch(`/api/anxietyProfile/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }

  return res.json();
}

export async function deleteMomentLogEntry(id: string) {
  const res = await fetch(`/api/momentLog/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }

  return res.json();
}

export async function deleteChallengeEntry(id: string) {
  const res = await fetch(`/api/challenges/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }

  return res.json();
}

export async function createAnxietyProfileEntry({
  locale,
  anxietyScreeningFormInputs,
  derivedAnxietyProfile,
  anxietyProfileResult,
}: {
  locale?: string;
  anxietyScreeningFormInputs: AnxietyScreeningInput;
  derivedAnxietyProfile: DerivedAnxietyProfile;
  anxietyProfileResult: AnxietyResultResponse;
}): Promise<{
  locale: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}> {
  const res = await fetch("/api/anxietyProfile/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      locale,
      input: anxietyScreeningFormInputs,
      profile: derivedAnxietyProfile,
      result: anxietyProfileResult,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }

  const result = await res.json();
  return result;
}

export async function getReasoningPreview({
  data,
}: {
  data: {
    location: string;
    symptoms: string[];
    locale: SupportedReasoningLocale;
  };
}): Promise<AnxietySupportPreviewResponse> {
  const res = await fetch("/api/reasoning", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(
      `Getting reasoning preview failed: ${res.status} ${await res.text()}`,
    );
  }

  const json = await res.json();
  return AnxietySupportPreviewResponseSchema.parse(json);
}

export async function updateUserProfile({
  data,
}: {
  data: {
    dob?: Date;
    gender?: Gender;
    name?: string;
  };
}): Promise<User> {
  const res = await fetch("/api/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Updating user failed: ${res.status} ${text}`);
  }

  return await res.json();
}

export async function getMomentLog(): Promise<MomentLog> {
  const res = await fetch("/api/momentLog", {
    next: { tags: ["momentLog"] },
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error fetching momentLogs: ${res.status} ${text}`);
  }

  return await res.json();
}

export async function getAnxietyAnalytics(startDate: string) {
  const res = await fetch(`/api/analytics?startDate=${startDate}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error fetching analytics: ${res.status} ${text}`);
  }

  return await res.json();
}
