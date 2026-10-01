import { Prisma } from "@/generated/prisma/client";
import { prisma } from "../../lib/prisma";

type FixedWindowLimit = {
  key: string;
  limit: number;
  windowSeconds: number;
};

/**
 * Atomically increments a PostgreSQL-backed fixed-window counter. This is
 * intentionally small and dependency-free; move it to a managed limiter only
 * if traffic or multi-region deployment requires that complexity.
 */
export async function takeFixedWindowLimit({
  key,
  limit,
  windowSeconds,
}: FixedWindowLimit) {
  const rows = await prisma.$queryRaw<Array<{ tokens: number }>>(Prisma.sql`
    INSERT INTO "RateLimitBucket" ("key", "tokens", "updatedAt", "createdAt")
    VALUES (${key}, 1, NOW(), NOW())
    ON CONFLICT ("key") DO UPDATE SET
      "tokens" = CASE
        WHEN "RateLimitBucket"."updatedAt" < NOW() - (${windowSeconds} * INTERVAL '1 second')
          THEN 1
        ELSE "RateLimitBucket"."tokens" + 1
      END,
      "updatedAt" = CASE
        WHEN "RateLimitBucket"."updatedAt" < NOW() - (${windowSeconds} * INTERVAL '1 second')
          THEN NOW()
        ELSE "RateLimitBucket"."updatedAt"
      END
    RETURNING "tokens"
  `);

  return (rows[0]?.tokens ?? limit + 1) <= limit;
}

export function getClientAddress(request: Request) {
  if (process.env.TRUST_PROXY_HEADERS !== "true") return null;

  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
}
