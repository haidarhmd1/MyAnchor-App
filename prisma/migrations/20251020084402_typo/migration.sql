/*
  Warnings:

  - You are about to drop the column `whyYourWereAvoidingIt` on the `Journal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Journal" DROP COLUMN "whyYourWereAvoidingIt",
ADD COLUMN     "whyYouWereAvoidingIt" TEXT[];
