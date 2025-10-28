
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../Model/UserModel';
import { RefreshToken, RefreshTokenDocument } from '../Model/RefreshTokenModel';
import { CreateUserDto } from '../Dto/CreateUserDto';
import { LoginUserDto } from '../Dto/LoginUserDto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshTokenDocument>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userModel.findOne({
      $or: [{ username: createUserDto.username }, { email: createUserDto.email }],
    }).exec();

    if (existingUser) {
      throw new ConflictException('Username atau email sudah terdaftar');
    }
    const createdUser = new this.userModel(createUserDto);
    await createdUser.save();
    const { password, ...result } = createdUser.toObject();
    return result;
  }

  async login(loginDto: LoginUserDto): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userModel.findOne({ username: loginDto.username }).exec();
    if (!user || !(await user.validatePassword(loginDto.password))) {
      throw new UnauthorizedException('Kredensial yang diberikan tidak valid');
    }
    const payload = { username: user.username, sub: user._id };
    
    // Generate access token (15 menit)
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    
    // Generate refresh token (7 hari)
    const refresh_token = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    // Simpan refresh token ke database
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
      throw new UnauthorizedException('Refresh token tidak valid atau sudah expired');
    }
    
    const user = await this.userModel.findById(tokenDoc.userId).exec();
    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan');
    }
    
    const payload = { username: user.username, sub: user._id };
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    
    return { access_token };
  }

  async logout(refreshToken: string): Promise<{ message: string }> {
    const result = await this.refreshTokenModel.deleteOne({ token: refreshToken }).exec();
    
    if (result.deletedCount === 0) {
      throw new UnauthorizedException('Refresh token tidak ditemukan');
    }
    
    return { message: 'Logout berhasil' };
  }
}
