-- Дүрмийн хичээлийн явц (DB-г db push-оор үүсгэсэн орчинд давхар ажиллуулж болохоор idempotent)

-- CreateTable
CREATE TABLE IF NOT EXISTS "grammar_rule_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level" "LevelCode" NOT NULL,
    "ruleId" INTEGER NOT NULL,
    "viewedAt" TIMESTAMP(3),
    "bestCorrect" INTEGER NOT NULL DEFAULT 0,
    "bestTotal" INTEGER NOT NULL DEFAULT 0,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "passedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grammar_rule_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "grammar_quiz_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level" "LevelCode" NOT NULL,
    "ruleId" INTEGER NOT NULL,
    "correct" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grammar_quiz_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "grammar_rule_progress_userId_level_ruleId_key" ON "grammar_rule_progress"("userId", "level", "ruleId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "grammar_rule_progress_userId_level_idx" ON "grammar_rule_progress"("userId", "level");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "grammar_quiz_attempts_userId_level_ruleId_idx" ON "grammar_quiz_attempts"("userId", "level", "ruleId");

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "grammar_rule_progress" ADD CONSTRAINT "grammar_rule_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "grammar_quiz_attempts" ADD CONSTRAINT "grammar_quiz_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
