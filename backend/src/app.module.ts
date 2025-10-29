import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UrlController } from './Controller/UrlController';
import { AuthController } from './Controller/AuthController';
import { UrlService } from './Service/UrlService';
import { AuthService } from './Service/AuthService';
import { Url, UrlSchema } from './Model/UrlModel';
import { User, UserSchema } from './Model/UserModel';
import { RefreshToken, RefreshTokenSchema } from './Model/RefreshTokenModel';
import { JwtStrategy } from './Auth/JwtStrategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    MongooseModule.forRoot(process.env.MONGO_URI!),
    MongooseModule.forFeature([
      { name: Url.name, schema: UrlSchema },
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema }
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UrlController, AuthController],
  providers: [UrlService, AuthService, JwtStrategy],
})
export class AppModule {}
