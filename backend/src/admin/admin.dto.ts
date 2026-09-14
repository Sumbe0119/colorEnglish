import { IsBoolean, IsEnum, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { LevelCode, ModuleType, QuestionType, Role } from '@prisma/client';

/** Админ хэрэглэгчийн жагсаалт — хуудаслалт, хайлт, шүүлтүүр */
export class ListUsersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;

  /** Нэр / и-мэйлээр хайх */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;

  /** all | pro | free */
  @IsOptional()
  @IsIn(['all', 'pro', 'free'])
  plan?: 'all' | 'pro' | 'free';

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  /** all | verified | unverified */
  @IsOptional()
  @IsIn(['all', 'verified', 'unverified'])
  verified?: 'all' | 'verified' | 'unverified';
}

export class CreateLevelDto {
  @IsEnum(LevelCode)
  code!: LevelCode;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  order!: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class CreateUnitDto {
  @IsString()
  @IsNotEmpty()
  levelId!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  order!: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class UpdateUnitDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  moduleId!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsInt()
  @Min(1)
  order!: number;

  @IsOptional()
  content?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  audioUrl?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  estimatedMins?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class UpdateLessonDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;

  @IsOptional()
  content?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  audioUrl?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  estimatedMins?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class CreateQuestionDto {
  @IsEnum(QuestionType)
  type!: QuestionType;

  @IsInt()
  @Min(1)
  order!: number;

  @IsString()
  @IsNotEmpty()
  prompt!: string;

  @IsOptional()
  options?: unknown;

  @IsNotEmpty()
  correctAnswer!: unknown;

  @IsString()
  @IsNotEmpty()
  explanation!: string;

  @IsOptional()
  @IsString()
  audioUrl?: string;

  @IsOptional()
  @IsString()
  hint?: string;
}

export class UpdateQuestionDto {
  @IsOptional()
  @IsEnum(QuestionType)
  type?: QuestionType;

  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;

  @IsOptional()
  @IsString()
  prompt?: string;

  @IsOptional()
  options?: unknown;

  @IsOptional()
  correctAnswer?: unknown;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  @IsString()
  audioUrl?: string;

  @IsOptional()
  @IsString()
  hint?: string;
}

export class CreateVocabDto {
  @IsString()
  @IsNotEmpty()
  word!: string;

  @IsString()
  @IsNotEmpty()
  meaningMn!: string;

  @IsString()
  @IsNotEmpty()
  exampleSentence!: string;

  @IsOptional()
  @IsString()
  partOfSpeech?: string;

  @IsOptional()
  @IsString()
  colorTag?: string;

  @IsOptional()
  @IsString()
  audioUrl?: string;
}

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  unitId!: string;

  @IsEnum(ModuleType)
  type!: ModuleType;

  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  order!: number;
}

export class LevelFilterDto {
  @IsOptional()
  @IsEnum(LevelCode)
  levelCode?: LevelCode;
}
