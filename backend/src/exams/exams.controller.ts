import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ExamsService } from './exams.service';
import { SubmitExamDto } from './exams.dto';

@Controller('exams')
export class ExamsController {
  constructor(private examsService: ExamsService) {}

  @Get('by-unit/:unitId')
  getByUnit(@Param('unitId') unitId: string) {
    return this.examsService.getByUnit(unitId);
  }

  @Post(':examId/attempts')
  startAttempt(@CurrentUser('userId') userId: string, @Param('examId') examId: string) {
    return this.examsService.startAttempt(userId, examId);
  }

  @Post('attempts/:attemptId/submit')
  submitAttempt(
    @CurrentUser('userId') userId: string,
    @Param('attemptId') attemptId: string,
    @Body() dto: SubmitExamDto,
  ) {
    return this.examsService.submitAttempt(userId, attemptId, dto);
  }

  @Get('attempts')
  getAttempts(@CurrentUser('userId') userId: string, @Query('examId') examId?: string) {
    return this.examsService.getAttempts(userId, examId);
  }
}
