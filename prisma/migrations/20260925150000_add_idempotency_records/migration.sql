CREATE TABLE "IdempotencyRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "route" VARCHAR(120) NOT NULL,
    "key" VARCHAR(128) NOT NULL,
    "statusCode" INTEGER,
    "response" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdempotencyRecord_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "IdempotencyRecord_userId_route_key_key"
ON "IdempotencyRecord"("userId", "route", "key");

CREATE INDEX "IdempotencyRecord_expiresAt_idx"
ON "IdempotencyRecord"("expiresAt");

ALTER TABLE "IdempotencyRecord"
ADD CONSTRAINT "IdempotencyRecord_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
