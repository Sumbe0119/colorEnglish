-- AlterTable
ALTER TABLE "reading_stories" ALTER COLUMN "body" SET DEFAULT '';
ALTER TABLE "reading_stories" ADD COLUMN IF NOT EXISTS "coverUrl" TEXT;
ALTER TABLE "reading_stories" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "reading_stories" ADD COLUMN IF NOT EXISTS "author" TEXT;

-- CreateTable
CREATE TABLE IF NOT EXISTS "reading_chapters" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reading_chapters_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "reading_chapters_storyId_order_key" ON "reading_chapters"("storyId", "order");
CREATE INDEX IF NOT EXISTS "reading_chapters_storyId_idx" ON "reading_chapters"("storyId");

ALTER TABLE "reading_chapters" DROP CONSTRAINT IF EXISTS "reading_chapters_storyId_fkey";
ALTER TABLE "reading_chapters"
  ADD CONSTRAINT "reading_chapters_storyId_fkey"
  FOREIGN KEY ("storyId") REFERENCES "reading_stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed Chapter 1 from existing story body (only if story has no chapters yet)
INSERT INTO "reading_chapters" ("id", "storyId", "title", "body", "order", "createdAt", "updatedAt")
SELECT
  md5(random()::text || clock_timestamp()::text || s.id),
  s.id,
  'Chapter 1',
  COALESCE(NULLIF(s.body, ''), ' '),
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "reading_stories" s
WHERE NOT EXISTS (
  SELECT 1 FROM "reading_chapters" c WHERE c."storyId" = s.id
);

-- Drop old unique on reading_words
ALTER TABLE "reading_words" DROP CONSTRAINT IF EXISTS "reading_words_storyId_startOffset_endOffset_key";

-- Add chapterId nullable first
ALTER TABLE "reading_words" ADD COLUMN IF NOT EXISTS "chapterId" TEXT;

-- Backfill chapterId from each story's first chapter
UPDATE "reading_words" w
SET "chapterId" = c.id
FROM "reading_chapters" c
WHERE c."storyId" = w."storyId"
  AND c."order" = 1
  AND w."chapterId" IS NULL;

-- Safety: any orphan words get a chapter too
UPDATE "reading_words" w
SET "chapterId" = (
  SELECT c.id FROM "reading_chapters" c WHERE c."storyId" = w."storyId" ORDER BY c."order" ASC LIMIT 1
)
WHERE w."chapterId" IS NULL;

DELETE FROM "reading_words" WHERE "chapterId" IS NULL;

ALTER TABLE "reading_words" ALTER COLUMN "chapterId" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "reading_words_chapterId_startOffset_endOffset_key"
  ON "reading_words"("chapterId", "startOffset", "endOffset");
CREATE INDEX IF NOT EXISTS "reading_words_chapterId_idx" ON "reading_words"("chapterId");

ALTER TABLE "reading_words" DROP CONSTRAINT IF EXISTS "reading_words_chapterId_fkey";
ALTER TABLE "reading_words"
  ADD CONSTRAINT "reading_words_chapterId_fkey"
  FOREIGN KEY ("chapterId") REFERENCES "reading_chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
