import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './Controller/Controller';
import { UrlService } from './Service/Service';
import { Url, UrlSchema } from './Model/Url';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }])
  ],
  controllers: [AppController],
  providers: [UrlService],
})
export class AppModule {}
