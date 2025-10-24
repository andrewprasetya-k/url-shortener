import { Body, Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { UrlService } from '../Service/Service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { CreateUrlDto } from '../Dto/Dto';

@Controller()
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Get('test-db')
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
    return this.urlService.create(createUrlDto);
  }

  @Get()
  async getAllUrl(){
    return this.urlService.findAll();
  }

  @Get('/:url')
  async getUrlById(@Param('url') url:string){
    return this.urlService.findByShortened(url.toString());
  }

  @Delete('/:url')
  async deleteUrl(@Param('url') url:string){
    return this.urlService.removeByShortened(url.toString());
  }
}