import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt, Max, Min, ValidateNested } from 'class-validator';

export class GrammarQuizResultDto {
  @IsInt()
  @Min(1)
  @Max(100)
  ruleId!: number;

  @IsInt()
  @Min(0)
  @Max(50)
  correct!: number;

  @IsInt()
  @Min(1)
  @Max(50)
  total!: number;
}

/** Шалгалт дууссаны дараа дүрэм бүрийн оноо (бүрэн шалгалтад олон дүрэм нэг дор ирнэ) */
export class SubmitGrammarQuizDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => GrammarQuizResultDto)
  results!: GrammarQuizResultDto[];
}
