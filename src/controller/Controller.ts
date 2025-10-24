import { Body, Controller, Get, Post } from '@nestjs/common';
import { UrlService } from '../Service/Service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { CreateUrlDto } from '../Dto/Dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: UrlService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Get()
  async testDb() {
    try {
      const db = this.connection.db;
      if (!db) {
        throw new Error('Database connection not initialized yet');
      }

      await db.admin().ping();

      return { status: 'success', message: 'MongoDB connected!' };
    } catch (error) {
      return { status: 'error', message: (error as Error).message };
    }
  }

  @Post()
  async createShortUrl(@Body() createUrlDto: CreateUrlDto) {
    return this.appService.create(createUrlDto);
  }
}

