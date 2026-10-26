-- Багшийн CV: олон боловсрол/туршлага, шагнал, хэлний оноо, сошиал хаяг
-- (idempotent — db push орчинд давхар ажиллуулж болно)
ALTER TABLE "teacher_applications" ADD COLUMN IF NOT EXISTS "instagram" TEXT;
ALTER TABLE "teacher_applications" ADD COLUMN IF NOT EXISTS "facebook" TEXT;
ALTER TABLE "teacher_applications" ADD COLUMN IF NOT EXISTS "educations" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "teacher_applications" ADD COLUMN IF NOT EXISTS "experiences" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "teacher_applications" ADD COLUMN IF NOT EXISTS "awards" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "teacher_applications" ADD COLUMN IF NOT EXISTS "hasLanguageScore" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "teacher_applications" ADD COLUMN IF NOT EXISTS "languageScores" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "teacher_applications" ALTER COLUMN "education" DROP NOT NULL;
ALTER TABLE "teacher_applications" ALTER COLUMN "experience" DROP NOT NULL;
