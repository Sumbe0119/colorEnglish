-- Багшаар ажиллах хүсэлт (CV) — footer-оос нэвтрэхгүй илгээнэ, админ хянана
-- (DB-г db push-оор үүсгэсэн орчинд давхар ажиллуулж болохоор idempotent)

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "TeacherApplicationStatus" AS ENUM ('NEW', 'REVIEWED', 'ACCEPTED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "teacher_applications" (
    "id" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "contactName" TEXT,
    "contactPhone" TEXT NOT NULL,
    "birthDate" DATE NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "hobbies" TEXT NOT NULL,
    "fiveYearGoals" TEXT NOT NULL,
    "contentInterest" BOOLEAN NOT NULL,
    "contentReason" TEXT NOT NULL,
    "note" TEXT,
    "status" "TeacherApplicationStatus" NOT NULL DEFAULT 'NEW',
    "adminNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teacher_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "teacher_applications_status_createdAt_idx" ON "teacher_applications"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "teacher_applications_phone_idx" ON "teacher_applications"("phone");
