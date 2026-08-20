import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'И-мэйл хаяг буруу байна' })
  email: string;
}
