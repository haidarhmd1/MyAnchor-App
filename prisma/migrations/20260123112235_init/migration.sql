-- CreateEnum
CREATE TYPE "TaxonomyType" AS ENUM ('AVOIDANCE_REASON', 'SYMPTOM', 'STOP_REASON', 'AFTER_ATTACK_ACTION', 'KEPT_GOING_REASON', 'SKIPPED_CHALLENGE_REASON');

-- CreateEnum
CREATE TYPE "WhenDidItHappen" AS ENUM ('MORNING', 'NOON', 'AFTERNOON', 'EVENING', 'NIGHT');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Engagement" AS ENUM ('STAY', 'PARTICIPATE', 'STRETCH');

-- CreateEnum
CREATE TYPE "SocialContext" AS ENUM ('ALONE', 'WITH_OTHERS');

-- CreateEnum
CREATE TYPE "ChallengeStatus" AS ENUM ('NOT_STARTED', 'STARTED', 'FINISHED');

-- CreateTable
CREATE TABLE "EmailOTP" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "tokenHash" VARCHAR(255) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "EmailOTP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL,
    "toEmail" VARCHAR(255) NOT NULL,
    "template" TEXT,
    "providerId" TEXT,
    "success" BOOLEAN NOT NULL,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignInAudit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "method" TEXT NOT NULL DEFAULT 'email-otp',
    "outcome" TEXT NOT NULL DEFAULT 'success',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SignInAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "policy" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "withdrawnAt" TIMESTAMP(3),

    CONSTRAINT "Consent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimitBucket" (
    "key" TEXT NOT NULL,
    "tokens" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateLimitBucket_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "dob" TIMESTAMP(3),
    "gender" "Gender",
    "image" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxonomyItem" (
    "id" TEXT NOT NULL,
    "type" "TaxonomyType" NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TaxonomyItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeOption" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "engagement" "Engagement" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChallengeOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "socialContext" "SocialContext" NOT NULL,
    "status" "ChallengeStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "userId" TEXT NOT NULL,
    "challengeOptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeOutcome" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "didComplete" BOOLEAN NOT NULL,
    "stopReason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ChallengeOutcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationOption" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocationOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Journal" (
    "id" TEXT NOT NULL,
    "hasAnxietyAttack" BOOLEAN,
    "hasAvoidedSituations" BOOLEAN,
    "typesOfSituationYouAvoided" TEXT[],
    "whenDidItHappen" "WhenDidItHappen",
    "typesOfSituationYouWereIn" TEXT,
    "whyYouWereAvoidingIt" TEXT[],
    "typesOfBodySymptoms" TEXT[],
    "anxietyLevelRating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "Journal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmailOTP_email_idx" ON "EmailOTP"("email");

-- CreateIndex
CREATE INDEX "EmailOTP_expiresAt_idx" ON "EmailOTP"("expiresAt");

-- CreateIndex
CREATE INDEX "EmailLog_toEmail_createdAt_idx" ON "EmailLog"("toEmail", "createdAt");

-- CreateIndex
CREATE INDEX "SignInAudit_userId_createdAt_idx" ON "SignInAudit"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Consent_userId_policy_idx" ON "Consent"("userId", "policy");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TaxonomyItem_slug_key" ON "TaxonomyItem"("slug");

-- CreateIndex
CREATE INDEX "TaxonomyItem_type_sortOrder_idx" ON "TaxonomyItem"("type", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeOption_slug_key" ON "ChallengeOption"("slug");

-- CreateIndex
CREATE INDEX "ChallengeOption_sortOrder_idx" ON "ChallengeOption"("sortOrder");

-- CreateIndex
CREATE INDEX "Challenge_userId_createdAt_idx" ON "Challenge"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Challenge_deletedAt_idx" ON "Challenge"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeOutcome_challengeId_key" ON "ChallengeOutcome"("challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "LocationOption_slug_key" ON "LocationOption"("slug");

-- CreateIndex
CREATE INDEX "LocationOption_sortOrder_idx" ON "LocationOption"("sortOrder");

-- CreateIndex
CREATE INDEX "Journal_userId_createdAt_idx" ON "Journal"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Journal_deletedAt_idx" ON "Journal"("deletedAt");

-- AddForeignKey
ALTER TABLE "SignInAudit" ADD CONSTRAINT "SignInAudit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consent" ADD CONSTRAINT "Consent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_challengeOptionId_fkey" FOREIGN KEY ("challengeOptionId") REFERENCES "ChallengeOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeOutcome" ADD CONSTRAINT "ChallengeOutcome_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Journal" ADD CONSTRAINT "Journal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
