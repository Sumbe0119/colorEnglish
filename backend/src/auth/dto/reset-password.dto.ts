import { IsEmail, IsString, Length, MaxLength, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail({}, { message: 'И-мэйл хаяг буруу байна' })
  email: string;

  @IsString()
  @Length(6, 6, { message: 'Баталгаажуулах код 6 оронтой байх ёстой' })
  code: string;

  @IsString()
  @MinLength(8, { message: 'Нууц үг доод тал нь 8 тэмдэгт байх ёстой' })
  @MaxLength(72, { message: 'Нууц үг хэт урт байна' })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Нууц үг дор хаяж 1 том үсэг, 1 жижиг үсэг, 1 тоо агуулсан байх ёстой',
  })
  newPassword: string;
}
