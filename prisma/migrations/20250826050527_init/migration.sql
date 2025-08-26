/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "public"."Company" AS ENUM ('ALONE', 'WITH_OTHERS');

-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "public"."Post";

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."Journal" (
    "id" TEXT NOT NULL,
    "hasAnxietyAttack" BOOLEAN,
    "hasAvoidedSituations" BOOLEAN,
    "typesOfSituationYouAvoided" TEXT[],
    "typesOfSituationYouWereIn" TEXT[],
    "whyYourWereAvoidingIt" TEXT[],
    "typesOfBodySymptoms" TEXT[],
    "anxietyLevelRating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "Journal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Challenge" (
    "id" TEXT NOT NULL,
    "company" "public"."Company" NOT NULL,
    "challengeOption" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);
