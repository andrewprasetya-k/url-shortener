import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail({}, { message: 'Email tidak valid' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  email: string;

  @IsString({ message: 'OTP harus berupa string' })
  @IsNotEmpty({ message: 'OTP tidak boleh kosong' })
  @Length(6, 6, { message: 'OTP harus 6 digit' })
  otp: string;
}