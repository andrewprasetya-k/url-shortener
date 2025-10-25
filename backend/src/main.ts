import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Pindahkan enableCors SEBELUM listen()
  app.enableCors({
    origin: 'http://localhost:3001', // Frontend running on port 3000
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000);
  console.log(`🚀 Server running at http://localhost:3000`);
}
bootstrap();
