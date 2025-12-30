import { FormJournalType } from "@/app/[locale]/(main)/journal/_components/helper";
import {
  Challenge,
  ChallengeOutcome,
  Company,
  Gender,
  Journal,
  User,
} from "@prisma/client";
import { ChallengeOutcomeSchema, ChallengeSchema } from "./zod.types";
import { z } from "zod";
import { AnalyticsRow } from "@/app/[locale]/(main)/anxiety-analytics/_components/Analytics";

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
      company: data.company === "ALONE" ? Company.ALONE : Company.WITH_OTHERS,
      challengeOptionId: data.challengeOptionId,
      status: data.status ?? "NOT_STARTED",
    }),
    // optional in Next.js to avoid caching for mutations:
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
    // optional in Next.js to avoid caching for mutations:
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create challenge outcome failed: ${res.status} ${text}`);
  }

  return (await res.json()) as ChallengeOutcome;
}

export async function createJournalEntry({
  data,
}: {
  data: FormJournalType;
}): Promise<Journal> {
  const res = await fetch("/api/journal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create journal entry failed: ${res.status} ${text}`);
  }
  return (await res.json()) as Journal;
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

export async function getJournals(): Promise<Journal> {
  const res = await fetch("/api/journal", {
    next: { tags: ["journals"] },
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error fetching journals: ${res.status} ${text}`);
  }

  return await res.json();
}

export async function getAnxietyAnalytics(
  startDate: string,
): Promise<AnalyticsRow[]> {
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
