
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../Model/UserModel';
import { CreateUserDto } from '../Dto/CreateUserDto';
import { LoginUserDto } from '../Dto/LoginUserDto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    // 1. Cek apakah username atau email sudah ada
    const existingUser = await this.userModel.findOne({
      $or: [{ username: createUserDto.username }, { email: createUserDto.email }],
    }).exec();

    if (existingUser) {
      throw new ConflictException('Username atau email sudah terdaftar');
    }

    // 2. Buat user baru (password akan di-hash oleh pre-save hook di model)
    const createdUser = new this.userModel(createUserDto);
    await createdUser.save();

    // 3. Jangan kembalikan password dalam response
    const { password, ...result } = createdUser.toObject();
    return result;
  }

  async login(loginDto: LoginUserDto): Promise<{ access_token: string }> {
    // 1. Cari pengguna berdasarkan username
    const user = await this.userModel.findOne({ username: loginDto.username }).exec();

    // 2. Gunakan method `validatePassword` yang ada di model User
    //    Pengecekan user tidak ada dan password salah digabung untuk keamanan
    if (!user || !(await user.validatePassword(loginDto.password))) {
      throw new UnauthorizedException('Kredensial yang diberikan tidak valid');
    }

    // 3. Buat payload untuk JWT
    const payload = { username: user.username, sub: user._id };
    
    // 4. Kembalikan token
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
