// backend/src/games/games.controller.ts
// Тоглоомын оноо, leaderboard, өгүүлбэрийн эзэмшил — нэвтэрсэн хэрэглэгч (global JwtAuthGuard)
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AddSentenceMasteryDto, LeaderboardQueryDto, SubmitScoreDto } from './games.dto';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private games: GamesService) {}

  /** Нэг тоглолтын оноо бүртгэх (sentence-builder, type-rush solo). Socket тоглоомууд серверээс шууд бүртгэнэ. */
  @Post('scores')
  @HttpCode(HttpStatus.OK)
  submitScore(@CurrentUser('userId') userId: string, @Body() dto: SubmitScoreDto) {
    return this.games.submitScore(userId, dto.game, dto.score, dto.meta);
  }

  /** Leaderboard: ?game=ALL|SENTENCE_BUILDER|TYPE_RUSH|DRAW_GUESS&limit=50 */
  @Get('leaderboard')
  leaderboard(@CurrentUser('userId') userId: string, @Query() q: LeaderboardQueryDto) {
    return this.games.leaderboard(q.game ?? 'ALL', userId, q.limit ?? 50);
  }

  @Get('sentence-mastery')
  getMastery(@CurrentUser('userId') userId: string) {
    return this.games.getSentenceMastery(userId);
  }

  @Post('sentence-mastery')
  @HttpCode(HttpStatus.OK)
  addMastery(@CurrentUser('userId') userId: string, @Body() dto: AddSentenceMasteryDto) {
    return this.games.addSentenceMastery(userId, dto.items);
  }

  @Delete('sentence-mastery')
  resetMastery(@CurrentUser('userId') userId: string) {
    return this.games.resetSentenceMastery(userId);
  }
}
