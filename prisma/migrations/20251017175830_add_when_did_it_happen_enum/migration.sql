/*
  Warnings:

  - You are about to drop the column `challengeOption` on the `Challenge` table. All the data in the column will be lost.
  - Added the required column `challengeOptionId` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whenDidItHappen` to the `Journal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TaxonomyType" AS ENUM ('LOCATION', 'CHALLENGE', 'AVOIDANCE_REASON', 'SYMPTOM', 'STOP_REASON', 'AFTER_ATTACK_ACTION', 'KEPT_GOING_REASON', 'SKIPPED_CHALLENGE_REASON');

-- CreateEnum
CREATE TYPE "public"."WhenDidItHappen" AS ENUM ('MORNING', 'NOON', 'AFTERNOON', 'EVENING', 'NIGHT');

-- AlterTable
ALTER TABLE "public"."Challenge" DROP COLUMN "challengeOption",
ADD COLUMN     "challengeOptionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Journal" ADD COLUMN     "whenDidItHappen" "public"."WhenDidItHappen" NOT NULL;

-- CreateTable
CREATE TABLE "public"."TaxonomyGroup" (
    "id" TEXT NOT NULL,
    "type" "public"."TaxonomyType" NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxonomyGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Taxonomy" (
    "id" TEXT NOT NULL,
    "type" "public"."TaxonomyType" NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "difficulty" "public"."Difficulty",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "groupId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Taxonomy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CustomTaxonomy" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."TaxonomyType" NOT NULL,
    "label" TEXT NOT NULL,
    "normalizedLabel" TEXT NOT NULL,
    "description" TEXT,
    "difficulty" "public"."Difficulty",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "taxonomyGroupId" TEXT,
    "groupId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CustomTaxonomy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserTaxonomy" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taxonomyId" TEXT,
    "customId" TEXT,
    "firstSeenAt" TIMESTAMP(3),
    "lastSeenAt" TIMESTAMP(3),
    "timesSelected" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserTaxonomy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaxonomyGroup_type_slug_key" ON "public"."TaxonomyGroup"("type", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Taxonomy_slug_key" ON "public"."Taxonomy"("slug");

-- CreateIndex
CREATE INDEX "Taxonomy_type_groupId_sortOrder_idx" ON "public"."Taxonomy"("type", "groupId", "sortOrder");

-- CreateIndex
CREATE INDEX "CustomTaxonomy_type_groupId_sortOrder_idx" ON "public"."CustomTaxonomy"("type", "groupId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "CustomTaxonomy_userId_type_normalizedLabel_key" ON "public"."CustomTaxonomy"("userId", "type", "normalizedLabel");

-- CreateIndex
CREATE INDEX "UserTaxonomy_userId_lastSeenAt_idx" ON "public"."UserTaxonomy"("userId", "lastSeenAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserTaxonomy_userId_taxonomyId_key" ON "public"."UserTaxonomy"("userId", "taxonomyId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTaxonomy_userId_customId_key" ON "public"."UserTaxonomy"("userId", "customId");

-- AddForeignKey
ALTER TABLE "public"."Taxonomy" ADD CONSTRAINT "Taxonomy_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."TaxonomyGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CustomTaxonomy" ADD CONSTRAINT "CustomTaxonomy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CustomTaxonomy" ADD CONSTRAINT "CustomTaxonomy_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."TaxonomyGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserTaxonomy" ADD CONSTRAINT "UserTaxonomy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserTaxonomy" ADD CONSTRAINT "UserTaxonomy_taxonomyId_fkey" FOREIGN KEY ("taxonomyId") REFERENCES "public"."Taxonomy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserTaxonomy" ADD CONSTRAINT "UserTaxonomy_customId_fkey" FOREIGN KEY ("customId") REFERENCES "public"."CustomTaxonomy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Challenge" ADD CONSTRAINT "Challenge_challengeOptionId_fkey" FOREIGN KEY ("challengeOptionId") REFERENCES "public"."Taxonomy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
