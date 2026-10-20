// backend/src/games/games.module.ts
import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';

/** Тоглоомын оноо / leaderboard. GamesService-ийг socket тоглоомын модулиуд (type-rush, draw-guess) импортолж ашиглана. */
@Module({
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
