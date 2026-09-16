-- AlterTable
ALTER TABLE "student_profiles" ADD COLUMN IF NOT EXISTS "learningStyleCompletedAt" TIMESTAMP(3);

-- Backfill: onboarding-ийн судалгааны алхам бүх асуултыг заавал хариулуулдаг тул
-- арга барил нь тооцогдсон профайлыг бүрэн бөглөсөн гэж үзнэ.
UPDATE "student_profiles"
SET "learningStyleCompletedAt" = COALESCE("onboardingCompletedAt", "updatedAt")
WHERE "dominantLearningStyle" IS NOT NULL
  AND "learningStyleCompletedAt" IS NULL;
