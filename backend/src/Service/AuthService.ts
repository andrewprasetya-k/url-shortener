
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

  async login(loginDto: LoginUserDto): Promise<{ access_token: string }> {
    const user = await this.userModel.findOne({ username: loginDto.username }).exec();
    if (!user || !(await user.validatePassword(loginDto.password))) {
      throw new UnauthorizedException('Kredensial yang diberikan tidak valid');
    }
    const payload = { username: user.username, sub: user._id };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
