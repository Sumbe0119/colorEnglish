import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ExamAnswerDto {
  @IsNotEmpty()
  examQuestionId!: string;

  @IsNotEmpty()
  userAnswer!: unknown;
}

export class SubmitExamDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExamAnswerDto)
  answers!: ExamAnswerDto[];
}
