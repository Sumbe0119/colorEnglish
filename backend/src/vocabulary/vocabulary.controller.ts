import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { VocabularyService } from './vocabulary.service';

@Controller('vocabulary')
export class VocabularyController {
  constructor(private vocabularyService: VocabularyService) {}

  @Get('lesson/:lessonId')
  getByLesson(@Param('lessonId') lessonId: string, @CurrentUser('userId') userId: string) {
    return this.vocabularyService.getByLesson(lessonId, userId);
  }

  @Get('review')
  getReviewQueue(@CurrentUser('userId') userId: string) {
    return this.vocabularyService.getReviewQueue(userId);
  }

  @Get('progress')
  getAllProgress(@CurrentUser('userId') userId: string) {
    return this.vocabularyService.getAllProgress(userId);
  }

  @Post(':vocabId/review')
  reviewWord(
    @CurrentUser('userId') userId: string,
    @Param('vocabId') vocabId: string,
    @Body('correct') correct: boolean,
  ) {
    return this.vocabularyService.reviewWord(userId, vocabId, correct);
  }
}
