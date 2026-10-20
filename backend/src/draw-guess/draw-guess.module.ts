// backend/src/draw-guess/draw-guess.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GamesModule } from '../games/games.module';
import { DrawGuessGateway } from './draw-guess.gateway';
import { DrawGuessService } from './draw-guess.service';

@Module({
  // Secret-ийг verifyAsync дээр ConfigService-ээс шууд өгнө; GamesModule — оноо бүртгэх
  imports: [JwtModule.register({}), GamesModule],
  providers: [DrawGuessService, DrawGuessGateway],
})
export class DrawGuessModule {}
