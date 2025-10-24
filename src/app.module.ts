import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './Controller/Controller';
import { UrlService } from './Service/Service';

@Module({
  imports: [
    ConfigModule.forRoot(), // <--- ini buat load .env
    MongooseModule.forRoot(process.env.MONGO_URI!),
  ],
  controllers: [AppController],
  providers: [UrlService],
})
export class AppModule {}
