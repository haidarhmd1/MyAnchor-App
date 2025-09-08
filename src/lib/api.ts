import { FormChallengeOutcomeType } from "@/app/(main)/exposure/challenge/[id]/_components/helper";
import { FormJournalType } from "@/app/(main)/journal/_components/helper";
import {
  Challenge,
  ChallengeOutcome,
  ChallengeStatus,
  Company,
  Gender,
  Journal,
  Prisma,
  User,
} from "@prisma/client";

type CreateChallengeInput = {
  company: Company;
  challengeOption: Prisma.JsonObject;
  status?: ChallengeStatus;
};

export async function createChallenge({
  data,
}: {
  data: CreateChallengeInput;
}): Promise<Challenge> {
  const res = await fetch("/api/challenges", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      company: data.company === "ALONE" ? Company.ALONE : Company.WITH_OTHERS,
      challengeOption: data.challengeOption,
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

export async function createChallengeOutcome({
  id,
  data,
}: {
  id: string;
  data: FormChallengeOutcomeType;
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
  const res = await fetch("api/profile", {
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
