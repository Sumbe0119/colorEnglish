import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWritingSubmissionDto {
  @IsString()
  @IsNotEmpty()
  prompt!: string;

  @IsString()
  @IsNotEmpty()
  originalText!: string;
}
