import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { WritingService } from './writing.service';
import { CreateWritingSubmissionDto } from './writing.dto';

@Controller('writing')
export class WritingController {
  constructor(private writingService: WritingService) {}

  @Get('submissions')
  listSubmissions(@CurrentUser('userId') userId: string) {
    return this.writingService.listSubmissions(userId);
  }

  @Post('submissions')
  createSubmission(@CurrentUser('userId') userId: string, @Body() dto: CreateWritingSubmissionDto) {
    return this.writingService.createSubmission(userId, dto);
  }

  @Get('submissions/:id')
  getSubmission(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.writingService.getSubmission(userId, id);
  }
}
