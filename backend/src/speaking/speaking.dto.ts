import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LevelCode } from '@prisma/client';

export class CreateSpeakingSessionDto {
  @IsString()
  @IsNotEmpty()
  topic!: string;

  @IsEnum(LevelCode)
  levelCode!: LevelCode;
}

export class SendSpeakingMessageDto {
  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsOptional()
  @IsString()
  audioUrl?: string;
}
