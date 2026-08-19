// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ensureUploadDirs, UPLOADS_ROOT } from './uploads/uploads.paths';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  ensureUploadDirs();
  // Browser → Next /api/uploads/* → backend /api/uploads/*
  app.useStaticAssets(UPLOADS_ROOT, { prefix: '/api/uploads/' });

  app.use(cookieParser());

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 8080;
  await app.listen(port);
  console.log(`🚀 ColorEnglish API ажиллаж байна: http://localhost:${port}/api`);
  console.log(`📁 Uploads: ${UPLOADS_ROOT} → /api/uploads/`);
}
bootstrap();
