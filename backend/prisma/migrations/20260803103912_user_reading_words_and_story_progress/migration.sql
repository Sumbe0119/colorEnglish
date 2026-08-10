-- CreateTable
CREATE TABLE "user_reading_words" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "readingWordId" TEXT,
    "word" TEXT NOT NULL,
    "meaningMn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_reading_words_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_story_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "quizPassed" BOOLEAN NOT NULL DEFAULT false,
    "racePassed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_story_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_reading_words_userId_idx" ON "user_reading_words"("userId");

-- CreateIndex
CREATE INDEX "user_reading_words_storyId_idx" ON "user_reading_words"("storyId");

-- CreateIndex
CREATE UNIQUE INDEX "user_reading_words_userId_storyId_word_key" ON "user_reading_words"("userId", "storyId", "word");

-- CreateIndex
CREATE INDEX "user_story_progress_userId_idx" ON "user_story_progress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_story_progress_userId_storyId_key" ON "user_story_progress"("userId", "storyId");

-- AddForeignKey
ALTER TABLE "user_reading_words" ADD CONSTRAINT "user_reading_words_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_reading_words" ADD CONSTRAINT "user_reading_words_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "reading_stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_story_progress" ADD CONSTRAINT "user_story_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_story_progress" ADD CONSTRAINT "user_story_progress_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "reading_stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
