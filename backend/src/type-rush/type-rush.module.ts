// backend/src/type-rush/type-rush.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GamesModule } from '../games/games.module';
import { TypeRushGateway } from './type-rush.gateway';
import { TypeRushService } from './type-rush.service';

@Module({
  // Secret-ийг verifyAsync дээр ConfigService-ээс шууд өгнө; GamesModule — оноо бүртгэх
  imports: [JwtModule.register({}), GamesModule],
  providers: [TypeRushService, TypeRushGateway],
})
export class TypeRushModule {}
