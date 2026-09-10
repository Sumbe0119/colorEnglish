-- CreateTable
CREATE TABLE "translation_memory" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "meaningMn" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'mymemory',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "translation_memory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "translation_memory_word_key" ON "translation_memory"("word");
