import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { MBTI_LETTERS, MbtiLetter } from './mbti';
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

  /** MBTI тест: асуулт бүрд сонгосон сонголтын үсэг (E/I/S/N/T/F/J/P) */
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(40)
  @IsIn(MBTI_LETTERS, { each: true })
  mbtiAnswers?: MbtiLetter[];
}

/** MBTI тестийг дангаар нь (дахин) өгөх */
export class MbtiDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(40)
  @IsIn(MBTI_LETTERS, { each: true })
  answers!: MbtiLetter[];
}

/** Дутуу бөглөсөн / бөглөөгүй хэрэглэгч судалгааг дахин өгөх */
export class LearningStyleDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(30)
  @IsEnum(LearningStyle, { each: true })
  answers!: LearningStyle[];
}
