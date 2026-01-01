-- DropForeignKey
ALTER TABLE "ChallengeOutcome" DROP CONSTRAINT "ChallengeOutcome_challengeId_fkey";

-- AddForeignKey
ALTER TABLE "ChallengeOutcome" ADD CONSTRAINT "ChallengeOutcome_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
