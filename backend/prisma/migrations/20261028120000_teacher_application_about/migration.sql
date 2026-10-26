-- Багшийн CV: өөрийн тухай танилцуулга, бусад гадаад хэлний мэдлэг
ALTER TABLE "teacher_applications" ADD COLUMN IF NOT EXISTS "aboutMe" TEXT;
ALTER TABLE "teacher_applications" ADD COLUMN IF NOT EXISTS "otherLanguages" JSONB NOT NULL DEFAULT '[]';
