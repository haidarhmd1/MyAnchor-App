import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: positiveInteger(process.env.DATABASE_POOL_MAX, 5),
  connectionTimeoutMillis: positiveInteger(
    process.env.DATABASE_CONNECT_TIMEOUT_MS,
    5_000,
  ),
  idleTimeoutMillis: positiveInteger(
    process.env.DATABASE_IDLE_TIMEOUT_MS,
    30_000,
  ),
});
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
