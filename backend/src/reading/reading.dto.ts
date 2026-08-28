// backend/src/reading/reading.dto.ts
import { IsBoolean, IsEnum, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { LevelCode } from '@prisma/client';

export class CreateReadingStoryDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  body!: string;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsEnum(LevelCode)
  levelCode?: LevelCode;

  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class UpdateReadingStoryDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  coverUrl?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  author?: string | null;

  @IsOptional()
  @IsEnum(LevelCode)
  levelCode?: LevelCode;

  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class CreateReadingChapterDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  body!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;
}

export class UpdateReadingChapterDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;

  /** true = админ цоож тайлаад үнэгүй нээсэн */
  @IsOptional()
  @IsBoolean()
  isFree?: boolean;
}

export class CreateReadingWordDto {
  @IsString()
  @IsNotEmpty()
  word!: string;

  @IsString()
  @IsNotEmpty()
  meaningMn!: string;

  @IsOptional()
  @IsString()
  chapterId?: string;

  @IsOptional()
  @ValidateIf((_, v) => v !== undefined && v !== null)
  @Type(() => Number)
  @IsInt()
  @Min(0)
  startOffset?: number;

  @IsOptional()
  @ValidateIf((_, v) => v !== undefined && v !== null)
  @Type(() => Number)
  @IsInt()
  @Min(0)
  endOffset?: number;
}

export class UpdateReadingWordDto {
  @IsOptional()
  @IsString()
  word?: string;

  @IsOptional()
  @IsString()
  meaningMn?: string;
}

export class SaveUserReadingWordDto {
  @IsString()
  @IsNotEmpty()
  word!: string;

  @IsString()
  @IsNotEmpty()
  meaningMn!: string;

  @IsString()
  @IsNotEmpty()
  storyId!: string;

  @IsOptional()
  @IsString()
  readingWordId?: string;
}

export class ReadingTtsDto {
  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsOptional()
  @IsIn(['female', 'male'])
  gender?: 'female' | 'male';

  /** Frontend rate (0.7–1.15) → ElevenLabs speed */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.5)
  @Max(1.5)
  rate?: number;
}
