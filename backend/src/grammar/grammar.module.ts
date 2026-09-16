import { Module } from '@nestjs/common';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { GrammarController } from './grammar.controller';
import { GrammarService } from './grammar.service';

@Module({
  imports: [SubscriptionsModule],
  controllers: [GrammarController],
  providers: [GrammarService],
})
export class GrammarModule {}
