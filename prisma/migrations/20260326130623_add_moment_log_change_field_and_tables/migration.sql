/*
  Warnings:

  - You are about to drop the column `actionTaken` on the `MomentLog` table. All the data in the column will be lost.
  - You are about to drop the column `urge` on the `MomentLog` table. All the data in the column will be lost.
  - Added the required column `aiResponseEn` to the `MomentLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MomentLog" DROP COLUMN "actionTaken",
DROP COLUMN "urge",
ADD COLUMN     "aiResponseEn" JSONB NOT NULL,
ADD COLUMN     "symptoms" TEXT[];

-- CreateTable
CREATE TABLE "MomentLogTranslation" (
    "id" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "momentLogId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MomentLogTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MomentLogTranslation_locale_idx" ON "MomentLogTranslation"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "MomentLogTranslation_momentLogId_locale_key" ON "MomentLogTranslation"("momentLogId", "locale");

-- AddForeignKey
ALTER TABLE "MomentLogTranslation" ADD CONSTRAINT "MomentLogTranslation_momentLogId_fkey" FOREIGN KEY ("momentLogId") REFERENCES "MomentLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
