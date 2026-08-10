// backend/src/subscriptions/subscriptions.module.ts
import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { QpayService } from './qpay.service';

@Module({
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, QpayService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
