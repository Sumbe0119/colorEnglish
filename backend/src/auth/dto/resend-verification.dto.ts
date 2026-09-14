import { IsEmail } from 'class-validator';

export class ResendVerificationDto {
  @IsEmail({}, { message: 'И-мэйл хаяг буруу байна' })
  email: string;
}
