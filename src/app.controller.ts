import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

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
    return { status: 'error', message: error.message };
  }
}

}
