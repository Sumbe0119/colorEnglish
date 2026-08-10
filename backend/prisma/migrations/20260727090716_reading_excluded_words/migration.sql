-- AlterTable
ALTER TABLE "reading_stories" ADD COLUMN     "excludedWords" TEXT[] DEFAULT ARRAY[]::TEXT[];
