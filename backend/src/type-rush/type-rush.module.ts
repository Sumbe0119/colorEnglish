// backend/src/type-rush/type-rush.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeRushGateway } from './type-rush.gateway';
import { TypeRushService } from './type-rush.service';

@Module({
  // Secret-ийг verifyAsync дээр ConfigService-ээс шууд өгнө
  imports: [JwtModule.register({})],
  providers: [TypeRushService, TypeRushGateway],
})
export class TypeRushModule {}
