import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { AuthService } from '../Service/AuthService';
import { CreateUserDto } from '../Dto/CreateUserDto';
import { LoginUserDto } from '../Dto/LoginUserDto';
import { RefreshTokenDto } from '../Dto/RefreshTokenDto';
import { VerifyOtpDto } from '../Dto/VerifyOtpDto'; // Import new DTO
import { JwtAuthGuard } from '../Auth/AuthGuard';
import { CurrentUser } from '../Decorator/UserDecorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK) // Changed to OK as it's an initiation, not final creation
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('register/verify')
  @HttpCode(HttpStatus.CREATED)
  async verifyRegistration(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtpAndCreateUser(verifyOtpDto.email, verifyOtpDto.otp);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto.refresh_token);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(refreshTokenDto.refresh_token);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMe(@CurrentUser() user: { userId: string; username: string }) {
    return { userId: user.userId, username: user.username };
  }
}
