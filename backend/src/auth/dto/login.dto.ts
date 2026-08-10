import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'И-мэйл хаяг буруу байна' })
  email: string;

  @IsString()
  @MinLength(1, { message: 'Нууц үгээ оруулна уу' })
  password: string;
}
