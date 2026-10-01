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
import type { MomentLog } from "@/generated/prisma/browser";
import {
  AnxietySupportPreviewResponse,
  AnxietySupportPreviewResponseSchema,
  SupportedReasoningLocale,
} from "./ai/anxietySupport/types";
import { DerivedAnxietyProfile } from "@/app/[locale]/(main)/anxietyProfile/_components/helpers/types";
import { AnxietyScreeningInput } from "@/app/[locale]/(main)/anxietyProfile/_components/helpers/schema";
import { AnxietyProfilePreviewResponse } from "./ai/anxietyProfile/schema/response.schema";
import { AnxietyResultResponse } from "./ai/anxietyProfile/types";

function writeHeaders() {
  return {
    "Content-Type": "application/json",
    "Idempotency-Key": crypto.randomUUID(),
  };
}

type CreateChallengeInputType = z.infer<typeof ChallengeSchema>;
export async function createChallenge({
  data,
}: {
  data: CreateChallengeInputType;
}): Promise<{ id: string }> {
  const res = await fetch("/api/challenges", {
    method: "POST",
    headers: writeHeaders(),
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

  return (await res.json()) as { id: string };
}

type ChallengeOutcomeInputType = z.infer<typeof ChallengeOutcomeSchema>;
export async function createChallengeOutcome({
  id,
  data,
}: {
  id: string;
  data: ChallengeOutcomeInputType;
}): Promise<{ message: string }> {
  const res = await fetch(`/api/challenges/${id}`, {
    method: "POST",
    headers: writeHeaders(),
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create challenge outcome failed: ${res.status} ${text}`);
  }

  return (await res.json()) as { message: string };
}

type MomentLogInputType = z.infer<typeof MomentLogFormSchema>;
export async function createMomentLogEntry({
  data,
}: {
  data: MomentLogInputType;
}): Promise<{ id: string }> {
  const res = await fetch("/api/momentLog", {
    method: "POST",
    headers: writeHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create moment log entry failed: ${res.status} ${text}`);
  }
  return (await res.json()) as { id: string };
}

export async function getAnxietyProfilePreview({
  profile,
  locale,
  consentsToHealthDataProcessing,
}: {
  profile: DerivedAnxietyProfile;
  locale?: string;
  consentsToHealthDataProcessing: true;
}): Promise<AnxietyProfilePreviewResponse> {
  const res = await fetch("/api/anxietyProfile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      profile,
      locale,
      consentsToHealthDataProcessing,
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
    headers: writeHeaders(),
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
    consentsToHealthDataProcessing: true;
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

export async function savePushSubscription(
  subscription: PushSubscriptionJSON,
): Promise<void> {
  const res = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Saving push subscription failed: ${res.status} ${text}`);
  }
}

export async function deletePushSubscription(endpoint: string): Promise<void> {
  const res = await fetch("/api/push/subscribe", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Removing push subscription failed: ${res.status} ${text}`);
  }
}

export async function sendTestPush(
  message: string,
): Promise<{ sent: number; removed: number }> {
  const res = await fetch("/api/push/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sending notification failed: ${res.status} ${text}`);
  }

  return await res.json();
}
