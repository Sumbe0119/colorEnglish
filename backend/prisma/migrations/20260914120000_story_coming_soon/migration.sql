-- AlterTable
ALTER TABLE "reading_stories" ADD COLUMN IF NOT EXISTS "isComingSoon" BOOLEAN NOT NULL DEFAULT false;
