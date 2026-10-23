// backend/src/placement-test/placement-test.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { PlacementTestController } from './placement-test.controller';
import { PlacementTestService } from './placement-test.service';

/**
 * Түвшин тогтоох тест — нэвтрэхгүй өгч, үр дүнг QPay төлбөрөөр нээнэ.
 * QpayService-ийг SubscriptionsModule-оос, JwtService-ийг нэвтэрсэн хэрэглэгчийг
 * заавал биш таних зорилгоор (secret-ийг verify дээр дамжуулна) ашиглана.
 */
@Module({
  imports: [SubscriptionsModule, JwtModule.register({})],
  controllers: [PlacementTestController],
  providers: [PlacementTestService],
  exports: [PlacementTestService],
})
export class PlacementTestModule {}
