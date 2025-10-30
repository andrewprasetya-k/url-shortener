import { Body, Controller, Get, Post, Param, Delete, Res, UseGuards, Query } from '@nestjs/common';
import { UrlService } from '../Service/UrlService';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { CreateUrlDto } from '../Dto/CreateUrlDto';
import { JwtAuthGuard } from '../Auth/AuthGuard';
import { CurrentUser } from '../Decorator/UserDecorator';
import express from 'express';

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
  @UseGuards(JwtAuthGuard)
  async createShortUrl(
    @Body() createUrlDto: CreateUrlDto,
    @CurrentUser() user: { userId: string; username: string }
  ) {
    return this.urlService.create(createUrlDto, user.userId);
  }

  @Get('my-urls')
  @UseGuards(JwtAuthGuard)
  async getMyUrls(
    @CurrentUser() user: { userId: string; username: string },
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.urlService.findByUserId(user.userId, Number(page), Number(limit));
  }


  // @Get()
  // async getAllUrl(){
  //   return this.urlService.findAll();
  // }

  @Get('/:url')
  async getUrlById(@Param('url') url:string, @Res() res: express.Response){
    if (!url) {
      return res.status(400).send('Url Not Found');
    }
    return res.redirect(await this.urlService.findByShortened(url.toString()));
  }

  @Delete('/:url')
  @UseGuards(JwtAuthGuard)
  async deleteUrl(
    @Param('url') url: string,
    @CurrentUser() user: { userId: string; username: string }
  ) {
    return this.urlService.removeByShortened(url.toString(), user.userId);
  }
}