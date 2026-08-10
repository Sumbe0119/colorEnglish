-- Clear legacy word-level rows (no reliable offsets); admin can re-run auto-translate
DELETE FROM "reading_words";

-- Drop old unique constraint
DROP INDEX IF EXISTS "reading_words_storyId_word_key";

-- Occurrence-based annotations
ALTER TABLE "reading_words" ADD COLUMN "startOffset" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "reading_words" ADD COLUMN "endOffset" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "reading_words" ADD COLUMN "contextSentence" TEXT NOT NULL DEFAULT '';

ALTER TABLE "reading_words" ALTER COLUMN "startOffset" DROP DEFAULT;
ALTER TABLE "reading_words" ALTER COLUMN "endOffset" DROP DEFAULT;

CREATE UNIQUE INDEX "reading_words_storyId_startOffset_endOffset_key" ON "reading_words"("storyId", "startOffset", "endOffset");
CREATE INDEX "reading_words_storyId_idx" ON "reading_words"("storyId");
