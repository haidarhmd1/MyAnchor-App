-- CreateTable
CREATE TABLE "public"."ChallengeOutcome" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "didComplete" BOOLEAN NOT NULL,
    "reasonsNotDone" TEXT[],
    "hadAnxietyAttack" BOOLEAN NOT NULL,
    "stoppedEarly" BOOLEAN NOT NULL,
    "stopReasons" TEXT[],
    "actionsTaken" TEXT[],
    "bodySymptoms" TEXT[],
    "anxietyLevel" INTEGER,
    "challengeRating" INTEGER,
    "copingStrategies" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ChallengeOutcome_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeOutcome_challengeId_key" ON "public"."ChallengeOutcome"("challengeId");

-- AddForeignKey
ALTER TABLE "public"."ChallengeOutcome" ADD CONSTRAINT "ChallengeOutcome_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "public"."Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
