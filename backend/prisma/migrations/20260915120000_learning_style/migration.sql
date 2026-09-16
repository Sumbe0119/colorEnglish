-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "LearningStyle" AS ENUM ('VISUAL', 'AUDITORY', 'READING_WRITING', 'KINESTHETIC');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AlterTable
ALTER TABLE "student_profiles"
  ADD COLUMN IF NOT EXISTS "dominantLearningStyle" "LearningStyle",
  ADD COLUMN IF NOT EXISTS "learningStyleScores" JSONB;
