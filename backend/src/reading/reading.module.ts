import { Module } from '@nestjs/common';
import { TranslationModule } from '../translation/translation.module';
import { ReadingController, ReadingAdminController } from './reading.controller';
import { ReadingService } from './reading.service';
import { ElevenLabsService } from './elevenlabs.service';

@Module({
  imports: [TranslationModule],
  controllers: [ReadingController, ReadingAdminController],
  providers: [ReadingService, ElevenLabsService],
  exports: [ReadingService, ElevenLabsService],
})
export class ReadingModule {}
