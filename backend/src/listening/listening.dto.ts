// backend/src/listening/listening.dto.ts
import { LevelCode } from '@prisma/client';
import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateClipDto {
  /** YouTube URL эсвэл 11 тэмдэгттэй ID */
  @IsString()
  @MinLength(11)
  @MaxLength(300)
  youtube!: string;

  @IsInt()
  @Min(0)
  startSec!: number;

  @IsInt()
  @Min(5)
  @Max(36_000)
  endSec!: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsEnum(LevelCode)
  levelCode?: LevelCode;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class UpdateClipDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsEnum(LevelCode)
  levelCode?: LevelCode;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  /** Хугацаа өөрчилбөл transcript дахин татаж тайрна */
  @IsOptional()
  @IsInt()
  @Min(0)
  startSec?: number;

  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(36_000)
  endSec?: number;
}

export class SubmitAttemptDto {
  @IsString()
  clipId!: string;

  @IsString()
  @MaxLength(60)
  word!: string;

  @IsInt()
  @Min(0)
  @Max(500)
  clicked!: number;

  /** Дарсан мөчүүд (видеоны секунд) — шинжилгээнд */
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(500)
  @IsNumber({}, { each: true })
  @Type(() => Number)
  clickTimes?: number[];
}
