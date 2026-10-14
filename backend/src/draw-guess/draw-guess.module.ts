// backend/src/draw-guess/draw-guess.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DrawGuessGateway } from './draw-guess.gateway';
import { DrawGuessService } from './draw-guess.service';

@Module({
  // Secret-ийг verifyAsync дээр ConfigService-ээс шууд өгнө
  imports: [JwtModule.register({})],
  providers: [DrawGuessService, DrawGuessGateway],
})
export class DrawGuessModule {}
