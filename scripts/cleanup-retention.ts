import { prisma } from "../lib/prisma";

function retentionDays(name: string, fallback: number) {
  const parsed = Number(process.env[name]);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function before(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1_000);
}

async function main() {
  const otpCutoff = before(retentionDays("RETENTION_OTP_DAYS", 1));
  const emailLogCutoff = before(retentionDays("RETENTION_EMAIL_LOG_DAYS", 90));
  const signInAuditCutoff = before(
    retentionDays("RETENTION_SIGN_IN_AUDIT_DAYS", 365),
  );
  const rateLimitCutoff = before(retentionDays("RETENTION_RATE_LIMIT_DAYS", 1));

  const [emailOtps, emailLogs, signInAudits, rateLimitBuckets, idempotency] =
    await prisma.$transaction([
      prisma.emailOTP.deleteMany({
        where: {
          OR: [
            { expiresAt: { lt: otpCutoff } },
            { consumedAt: { not: null, lt: otpCutoff } },
          ],
        },
      }),
      prisma.emailLog.deleteMany({
        where: { createdAt: { lt: emailLogCutoff } },
      }),
      prisma.signInAudit.deleteMany({
        where: { createdAt: { lt: signInAuditCutoff } },
      }),
      prisma.rateLimitBucket.deleteMany({
        where: { updatedAt: { lt: rateLimitCutoff } },
      }),
      prisma.idempotencyRecord.deleteMany({
        where: { expiresAt: { lt: new Date() } },
      }),
    ]);

  process.stdout.write(
    `${JSON.stringify({
      event: "retention_cleanup_complete",
      deleted: {
        emailOtps: emailOtps.count,
        emailLogs: emailLogs.count,
        signInAudits: signInAudits.count,
        rateLimitBuckets: rateLimitBuckets.count,
        idempotencyRecords: idempotency.count,
      },
    })}\n`,
  );
}

main()
  .catch((error: unknown) => {
    process.stderr.write(
      `${JSON.stringify({
        event: "retention_cleanup_failed",
        error: error instanceof Error ? error.name : "UnknownError",
      })}\n`,
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
