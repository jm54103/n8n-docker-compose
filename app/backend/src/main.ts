
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // 1. Import
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  
  const isDev = process.env.NODE_ENV !== 'production';
  const PORT = process.env.PORT;

  console.log(`NODE_ENV ${process.env.NODE_ENV}`);
 

  // 2. ตั้งค่า Swagger
  const config = new DocumentBuilder()
    .setTitle('Market Signal API')
    .setDescription('API สำหรับดึงข้อมูลสัญญาณเทคนิค (RSI, EMA, Crosses)')
    .setVersion('1.0')
    .addTag('NestJs')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 

  const frontendPath = join(__dirname, '..', 'public');

  console.log(`frontendPath => ${frontendPath}`);

  // Serve static assets
  app.use(express.static(frontendPath));

  // SPA fallback (Express 5 safe)
  app.getHttpAdapter().get('/', (req, res) => {
    res.sendFile(join(frontendPath, 'index.html'));
  });

  await app.listen(PORT);
  console.log(`🚀 API is running on: http://localhost:${PORT}`);
  console.log(`📖 Swagger Docs: http://localhost:${PORT}/api`);

}


bootstrap();