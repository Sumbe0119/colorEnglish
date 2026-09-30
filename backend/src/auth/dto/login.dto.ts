import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'И-мэйл хаяг буруу байна' })
  email: string;

  @IsString()
  @MinLength(1, { message: 'Нууц үгээ оруулна уу' })
  password: string;

  /** Frontend-ийн localStorage дахь төхөөрөмжийн UUID (нэг browser = нэг төхөөрөмж) */
  @IsOptional()
  @IsString()
  @MaxLength(64)
  @Matches(/^[A-Za-z0-9_-]+$/)
  deviceId?: string;
}
