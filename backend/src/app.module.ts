import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlController } from './Controller/UrlController';
import { UrlService } from './Service/UrlService';
import { Url, UrlSchema } from './Model/UrlModel';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }])
  ],
  controllers: [UrlController],
  providers: [UrlService],
})
export class AppModule {}
