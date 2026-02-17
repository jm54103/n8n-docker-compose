
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // 1. Import
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 2. ตั้งค่า Swagger
  const config = new DocumentBuilder()
    .setTitle('Market Signals API')
    .setDescription('API สำหรับดึงข้อมูลสัญญาณเทคนิค (RSI, EMA, Crosses)')
    .setVersion('1.0')
    .addTag('signals')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // จะเข้าใช้งานผ่าน localhost:3000/api

  await app.listen(3000);
  console.log('🚀 API is running on: http://localhost:3000');
  console.log('📖 Swagger Docs: http://localhost:3000/api');
}
bootstrap();