import { ArrayMaxSize, IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

/** Төхөөрөмжийн лимит дүүрсэн үед сонгосон session-үүдийг хааж нэвтрэх. */
export class LoginReplaceDto {
  @IsString()
  @MaxLength(2048)
  ticket: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  revokeSessionIds?: string[];
}
