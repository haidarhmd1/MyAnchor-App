/*
  Warnings:

  - You are about to drop the column `stopReason` on the `ChallengeOutcome` table. All the data in the column will be lost.
  - You are about to drop the `Journal` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Journal" DROP CONSTRAINT "Journal_userId_fkey";

-- AlterTable
ALTER TABLE "ChallengeOutcome" DROP COLUMN "stopReason",
ADD COLUMN     "safetyBehavior" TEXT;

-- DropTable
DROP TABLE "Journal";

-- CreateTable
CREATE TABLE "MomentLog" (
    "id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "urge" TEXT NOT NULL,
    "actionTaken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "MomentLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MomentLog_userId_createdAt_idx" ON "MomentLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "MomentLog_deletedAt_idx" ON "MomentLog"("deletedAt");

-- AddForeignKey
ALTER TABLE "MomentLog" ADD CONSTRAINT "MomentLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
