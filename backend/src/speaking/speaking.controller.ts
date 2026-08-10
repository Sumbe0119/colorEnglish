import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SpeakingService } from './speaking.service';
import { CreateSpeakingSessionDto, SendSpeakingMessageDto } from './speaking.dto';

@Controller('speaking')
export class SpeakingController {
  constructor(private speakingService: SpeakingService) {}

  @Get('sessions')
  listSessions(@CurrentUser('userId') userId: string) {
    return this.speakingService.listSessions(userId);
  }

  @Post('sessions')
  createSession(@CurrentUser('userId') userId: string, @Body() dto: CreateSpeakingSessionDto) {
    return this.speakingService.createSession(userId, dto);
  }

  @Get('sessions/:sessionId')
  getSession(@CurrentUser('userId') userId: string, @Param('sessionId') sessionId: string) {
    return this.speakingService.getSession(userId, sessionId);
  }

  @Post('sessions/:sessionId/messages')
  sendMessage(
    @CurrentUser('userId') userId: string,
    @Param('sessionId') sessionId: string,
    @Body() dto: SendSpeakingMessageDto,
  ) {
    return this.speakingService.sendMessage(userId, sessionId, dto);
  }

  @Patch('sessions/:sessionId/end')
  endSession(@CurrentUser('userId') userId: string, @Param('sessionId') sessionId: string) {
    return this.speakingService.endSession(userId, sessionId);
  }
}
