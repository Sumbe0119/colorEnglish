// backend/src/tug-of-war/tug-of-war.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GamesModule } from '../games/games.module';
import { TugOfWarGateway } from './tug-of-war.gateway';
import { TugOfWarService } from './tug-of-war.service';

@Module({
  // Secret-ийг verifyAsync дээр ConfigService-ээс шууд өгнө; GamesModule — оноо бүртгэх
  imports: [JwtModule.register({}), GamesModule],
  providers: [TugOfWarService, TugOfWarGateway],
})
export class TugOfWarModule {}
