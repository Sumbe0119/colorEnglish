// backend/src/listening/listening.module.ts
import { Module } from '@nestjs/common';
import { GamesModule } from '../games/games.module';
import { TranslationModule } from '../translation/translation.module';
import { ListeningController } from './listening.controller';
import { ListeningService } from './listening.service';
import { WordInfoService } from './word-info.service';

@Module({
  imports: [GamesModule, TranslationModule],
  controllers: [ListeningController],
  providers: [ListeningService, WordInfoService],
})
export class ListeningModule {}
