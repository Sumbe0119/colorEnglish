import { Module } from '@nestjs/common';
import { TranslationModule } from '../translation/translation.module';
import { ReadingController, ReadingAdminController } from './reading.controller';
import { ReadingService } from './reading.service';

@Module({
  imports: [TranslationModule],
  controllers: [ReadingController, ReadingAdminController],
  providers: [ReadingService],
  exports: [ReadingService],
})
export class ReadingModule {}
