import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'И-мэйл хаяг буруу байна' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Нууц үг доод тал нь 8 тэмдэгт байх ёстой' })
  @MaxLength(72, { message: 'Нууц үг хэт урт байна' })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Нууц үг дор хаяж 1 том үсэг, 1 жижиг үсэг, 1 тоо агуулсан байх ёстой',
  })
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;
}
