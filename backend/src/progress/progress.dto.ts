import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SubmitAnswerDto {
  @IsNotEmpty()
  questionId!: string;

  @IsNotEmpty()
  userAnswer!: unknown;
}

export class SubmitLessonDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmitAnswerDto)
  answers!: SubmitAnswerDto[];
}
