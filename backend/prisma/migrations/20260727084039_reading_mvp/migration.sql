-- CreateTable
CREATE TABLE "reading_stories" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "levelCode" "LevelCode" NOT NULL DEFAULT 'A1',
    "order" INTEGER NOT NULL DEFAULT 1,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reading_stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_words" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "meaningMn" TEXT NOT NULL,

    CONSTRAINT "reading_words_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reading_words_storyId_word_key" ON "reading_words"("storyId", "word");

-- AddForeignKey
ALTER TABLE "reading_words" ADD CONSTRAINT "reading_words_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "reading_stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
