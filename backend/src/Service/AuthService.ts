
import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from '../Model/UserModel';
import { RefreshToken, RefreshTokenDocument } from '../Model/RefreshTokenModel';
import { Otp, OtpDocument } from '../Model/OtpModel';
import { CreateUserDto } from '../Dto/CreateUserDto';
import { LoginUserDto } from '../Dto/LoginUserDto';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private transporter: Mail;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshTokenDocument>,
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: this.configService.get<number>('EMAIL_PORT') === 465, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async register(createUserDto: CreateUserDto): Promise<{ message: string }> {
    const { username, email, password } = createUserDto;

    const existingUser = await this.userModel.findOne({ $or: [{ username }, { email }] }).exec();
    if (existingUser) {
      throw new ConflictException('Username or email is already registered');
    }

    const existingOtp = await this.otpModel.findOne({ email }).exec();
    if (existingOtp) {
      // Optionally, update the existing OTP or throw an error if too many requests
      await this.otpModel.deleteOne({ email }).exec(); // For simplicity, delete old OTP
    }

    // 3. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    // 4. Hash password for temporary storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Set OTP expiry (e.g., 5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

    // 6. Store OTP and user data temporarily
    await this.otpModel.create({
      email,
      otp: hashedOtp,
      expiresAt,
      userData: { username, email, password },
    });

    // 7. Send OTP via email
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_FROM'),
        to: email,
        subject: 'Verify Your Account',
        html: `<p>Your verification code is: <strong>${otp}</strong></p><p>This code will expire in 5 minutes.</p>`,
      });
      return { message: 'OTP code has been sent to your email.' };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new InternalServerErrorException('Failed to send verification code. Please try again.');
    }
  }

  async login(loginDto: LoginUserDto): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userModel.findOne({ username: loginDto.username }).exec();
    if (!user || !(await user.validatePassword(loginDto.password))) {
      throw new UnauthorizedException('Invalid credentials provided');
    }
    const payload = { username: user.username, sub: user._id };

    // Generate access token (30 minutes)
    const access_token = this.jwtService.sign(payload, { expiresIn: '30m' });

    // Generate refresh token (7 days)
    const refresh_token = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Save refresh token to database
    await this.refreshTokenModel.create({
      token: refresh_token,
      userId: (user._id as Types.ObjectId).toString(),
      expiresAt,
    });
    
    return {
      access_token,
      refresh_token,
    };
  }

  async refresh(refreshToken: string): Promise<{ access_token: string }> {
    const tokenDoc = await this.refreshTokenModel.findOne({ token: refreshToken }).exec();
    
    if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token is invalid or has expired');
    }

    const user = await this.userModel.findById(tokenDoc.userId).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    const payload = { username: user.username, sub: user._id };
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    
    return { access_token };
  }

  async logout(refreshToken: string): Promise<{ message: string }> {
    const result = await this.refreshTokenModel.deleteOne({ token: refreshToken }).exec();
    
    if (result.deletedCount === 0) {
      throw new UnauthorizedException('Refresh token not found');
    }

    return { message: 'Logout successful' };
  }

  async verifyOtpAndCreateUser(email: string, otp: string): Promise<{ access_token: string; refresh_token: string }> {
    const otpRecord = await this.otpModel.findOne({ email }).exec();

    if (!otpRecord) {
      throw new UnauthorizedException('Verification code not found or has expired.');
    }

    // Check if OTP has expired (redundant with TTL index but good for immediate check)
    if (otpRecord.expiresAt < new Date()) {
      await this.otpModel.deleteOne({ email }).exec(); // Clean up expired OTP
      throw new UnauthorizedException('Verification code has expired.');
    }

    const hashedInputOtp = crypto.createHash('sha256').update(otp).digest('hex');

    if (hashedInputOtp !== otpRecord.otp) {
      throw new UnauthorizedException('Invalid verification code.');
    }

    // OTP is valid, create the user
    const { username, password } = otpRecord.userData;
    const createdUser = new this.userModel({ username, email, password });
    await createdUser.save();

    // Delete the OTP record after successful user creation
    await this.otpModel.deleteOne({ email }).exec();

    // Generate tokens for the newly created user
    const payload = { username: createdUser.username, sub: createdUser._id };
    const access_token = this.jwtService.sign(payload, { expiresIn: '30m' });

    const refresh_token = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenModel.create({
      token: refresh_token,
      userId: (createdUser._id as Types.ObjectId).toString(),
      expiresAt,
    });

    return {
      access_token,
      refresh_token,
    };
  }
}
