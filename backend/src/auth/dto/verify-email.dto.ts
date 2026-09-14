import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class VerifyEmailDto {
  @IsEmail({}, { message: 'И-мэйл хаяг буруу байна' })
  email: string;

  @IsString()
  @Length(6, 6, { message: 'Баталгаажуулах код 6 оронтой байх ёстой' })
  @Matches(/^\d{6}$/, { message: 'Код зөвхөн тооноос бүрдэнэ' })
  code: string;
}
