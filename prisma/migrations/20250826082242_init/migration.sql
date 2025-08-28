-- CreateEnum
CREATE TYPE "public"."ChallengeStatus" AS ENUM ('NOT_STARTED', 'FINISHED');

-- AlterTable
ALTER TABLE "public"."Challenge" ADD COLUMN     "status" "public"."ChallengeStatus" NOT NULL DEFAULT 'NOT_STARTED';
