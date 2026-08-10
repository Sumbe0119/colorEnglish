import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ProgressService } from './progress.service';
import { SubmitLessonDto } from './progress.dto';

@Controller('progress')
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get('dashboard')
  getDashboard(@CurrentUser('userId') userId: string) {
    return this.progressService.getDashboard(userId);
  }

  @Get('enrollments')
  getEnrollments(@CurrentUser('userId') userId: string) {
    return this.progressService.getEnrollments(userId);
  }

  @Post('enroll')
  enroll(@CurrentUser('userId') userId: string, @Body('levelId') levelId?: string) {
    return this.progressService.enroll(userId, levelId);
  }

  @Post('lessons/:lessonId/start')
  startLesson(@CurrentUser('userId') userId: string, @Param('lessonId') lessonId: string) {
    return this.progressService.startLesson(userId, lessonId);
  }

  @Post('lessons/:lessonId/submit')
  submitLesson(
    @CurrentUser('userId') userId: string,
    @Param('lessonId') lessonId: string,
    @Body() dto: SubmitLessonDto,
  ) {
    return this.progressService.submitLesson(userId, lessonId, dto);
  }

  @Get('lessons/:lessonId')
  getLessonProgress(@CurrentUser('userId') userId: string, @Param('lessonId') lessonId: string) {
    return this.progressService.getLessonProgress(userId, lessonId);
  }
}
