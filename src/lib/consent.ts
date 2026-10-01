import { prisma } from "../../lib/prisma";

export const HEALTH_DATA_POLICY = "health_data_processing";

export function getPrivacyPolicyVersion() {
  const version = process.env.PRIVACY_POLICY_VERSION;
  if (version) return version;

  if (process.env.NODE_ENV === "production") {
    throw new Error("PRIVACY_POLICY_VERSION is not configured");
  }

  return "local-development";
}

export async function recordHealthDataConsent(userId: string) {
  const version = getPrivacyPolicyVersion();
  const existingConsent = await prisma.consent.findFirst({
    where: {
      userId,
      policy: HEALTH_DATA_POLICY,
      version,
      withdrawnAt: null,
    },
  });

  if (!existingConsent) {
    await prisma.consent.create({
      data: {
        userId,
        policy: HEALTH_DATA_POLICY,
        version,
      },
    });
  }
}
