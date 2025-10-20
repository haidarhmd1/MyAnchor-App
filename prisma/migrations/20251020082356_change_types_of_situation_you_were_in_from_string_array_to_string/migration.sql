-- AlterTable
ALTER TABLE "public"."Journal" ALTER COLUMN "typesOfSituationYouWereIn" DROP NOT NULL,
ALTER COLUMN "typesOfSituationYouWereIn" SET DATA TYPE TEXT;
