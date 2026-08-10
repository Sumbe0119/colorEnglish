import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { GoalInterest, LevelCode } from '@prisma/client';

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
}
