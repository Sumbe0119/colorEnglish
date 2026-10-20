// backend/src/games/games.dto.ts
// Тоглоомын оноо / leaderboard / өгүүлбэрийн эзэмшлийн DTO-ууд
import { GameKind } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

/** Нэг тоглолт дууссаны дараа client илгээх оноо */
export class SubmitScoreDto {
  @IsEnum(GameKind)
  game!: GameKind;

  @IsInt()
  @Min(0)
  @Max(1_000_000)
  score!: number;

  /** Тоглоомоос хамаарсан нэмэлт мэдээлэл (level, wpm, accuracy …) */
  @IsOptional()
  @IsObject()
  meta?: Record<string, unknown>;
}

export const LEADERBOARD_SCOPES = ['ALL', ...Object.values(GameKind)] as const;
export type LeaderboardScope = (typeof LEADERBOARD_SCOPES)[number];

export class LeaderboardQueryDto {
  @IsOptional()
  @IsIn(LEADERBOARD_SCOPES as unknown as string[])
  game?: LeaderboardScope;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

/** Асуудалгүй зөв хариулсан өгүүлбэрүүдийн түлхүүр (normalizeSentence) */
export class SentenceMasteryItemDto {
  @IsString()
  @MaxLength(200)
  key!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  level?: number;
}

export class AddSentenceMasteryDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => SentenceMasteryItemDto)
  items!: SentenceMasteryItemDto[];
}
