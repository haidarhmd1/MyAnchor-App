/*
  Warnings:

  - Added the required column `userId` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Journal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Challenge" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Journal" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Challenge_userId_createdAt_idx" ON "public"."Challenge"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Challenge_deletedAt_idx" ON "public"."Challenge"("deletedAt");

-- CreateIndex
CREATE INDEX "Journal_userId_createdAt_idx" ON "public"."Journal"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Journal_deletedAt_idx" ON "public"."Journal"("deletedAt");

-- AddForeignKey
ALTER TABLE "public"."Journal" ADD CONSTRAINT "Journal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Challenge" ADD CONSTRAINT "Challenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
