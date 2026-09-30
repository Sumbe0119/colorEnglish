import { IsEmail, IsOptional, IsString, Length, Matches, MaxLength } from 'class-validator';

export class VerifyEmailDto {
  @IsEmail({}, { message: 'И-мэйл хаяг буруу байна' })
  email: string;

  @IsString()
  @Length(6, 6, { message: 'Баталгаажуулах код 6 оронтой байх ёстой' })
  @Matches(/^\d{6}$/, { message: 'Код зөвхөн тооноос бүрдэнэ' })
  code: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  @Matches(/^[A-Za-z0-9_-]+$/)
  deviceId?: string;
}
