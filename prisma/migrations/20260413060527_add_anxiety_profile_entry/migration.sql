-- CreateTable
CREATE TABLE "AnxietyProfileEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "locale" VARCHAR(12) NOT NULL,
    "input" JSONB NOT NULL,
    "derivedProfile" JSONB NOT NULL,
    "result" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AnxietyProfileEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnxietyProfileEntryTranslation" (
    "id" TEXT NOT NULL,
    "anxietyProfileEntryId" TEXT NOT NULL,
    "locale" VARCHAR(12) NOT NULL,
    "result" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnxietyProfileEntryTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnxietyProfileEntry_userId_createdAt_idx" ON "AnxietyProfileEntry"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AnxietyProfileEntry_locale_idx" ON "AnxietyProfileEntry"("locale");

-- CreateIndex
CREATE INDEX "AnxietyProfileEntry_deletedAt_idx" ON "AnxietyProfileEntry"("deletedAt");

-- CreateIndex
CREATE INDEX "AnxietyProfileEntryTranslation_locale_idx" ON "AnxietyProfileEntryTranslation"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "AnxietyProfileEntryTranslation_anxietyProfileEntryId_locale_key" ON "AnxietyProfileEntryTranslation"("anxietyProfileEntryId", "locale");

-- AddForeignKey
ALTER TABLE "AnxietyProfileEntry" ADD CONSTRAINT "AnxietyProfileEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnxietyProfileEntryTranslation" ADD CONSTRAINT "AnxietyProfileEntryTranslation_anxietyProfileEntryId_fkey" FOREIGN KEY ("anxietyProfileEntryId") REFERENCES "AnxietyProfileEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
