-- Тоглоомын оноо / leaderboard / өгүүлбэрийн эзэмшил
-- (DB-г db push-оор үүсгэсэн орчинд давхар ажиллуулж болохоор idempotent)

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "GameKind" AS ENUM ('SENTENCE_BUILDER', 'TYPE_RUSH', 'DRAW_GUESS');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "game_scores" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "game" "GameKind" NOT NULL,
    "score" INTEGER NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "game_bests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "game" "GameKind" NOT NULL,
    "bestScore" INTEGER NOT NULL DEFAULT 0,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "plays" INTEGER NOT NULL DEFAULT 0,
    "bestAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_bests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "sentence_mastery" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sentenceKey" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sentence_mastery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "game_scores_userId_game_idx" ON "game_scores"("userId", "game");
CREATE INDEX IF NOT EXISTS "game_scores_game_score_idx" ON "game_scores"("game", "score");
CREATE UNIQUE INDEX IF NOT EXISTS "game_bests_userId_game_key" ON "game_bests"("userId", "game");
CREATE INDEX IF NOT EXISTS "game_bests_game_bestScore_idx" ON "game_bests"("game", "bestScore");
CREATE UNIQUE INDEX IF NOT EXISTS "sentence_mastery_userId_sentenceKey_key" ON "sentence_mastery"("userId", "sentenceKey");
CREATE INDEX IF NOT EXISTS "sentence_mastery_userId_idx" ON "sentence_mastery"("userId");

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "game_scores" ADD CONSTRAINT "game_scores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "game_bests" ADD CONSTRAINT "game_bests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "sentence_mastery" ADD CONSTRAINT "sentence_mastery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
