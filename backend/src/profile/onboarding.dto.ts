import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { GoalInterest, LearningStyle, LevelCode } from '@prisma/client';

export class OnboardingDto {
  @IsOptional()
  interests?: GoalInterest[];

  @IsOptional()
  @IsEnum(LevelCode)
  selfAssessedLevel?: LevelCode;

  @IsOptional()
  @IsInt()
  @Min(10)
  @Max(120)
  dailyGoalMinutes?: number;

  @IsOptional()
  @IsString()
  motivationNote?: string;

  /** Суралцах арга барилын судалгаа: асуулт бүрд сонгосон сонголтын арга барил */
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @IsEnum(LearningStyle, { each: true })
  learningStyleAnswers?: LearningStyle[];
}

/** Дутуу бөглөсөн / бөглөөгүй хэрэглэгч судалгааг дахин өгөх */
export class LearningStyleDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(30)
  @IsEnum(LearningStyle, { each: true })
  answers!: LearningStyle[];
}
