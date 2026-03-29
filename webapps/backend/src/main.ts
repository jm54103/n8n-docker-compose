import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/configs/logger.config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; 

import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import * as fs from 'fs';
import { AdvancedLoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {

    
  const isDev = process.env.NODE_ENV !== 'production';
  const PORT = process.env.PORT;

  console.log(`NODE_ENV ${process.env.NODE_ENV}`);

  const app = await NestFactory.create(AppModule, {
    // ใช้ Winston เป็น Logger หลัก
    logger: WinstonModule.createLogger(winstonConfig),
  });
  
  // 1.ใช้ Winston เป็น Logger หลักของระบบ
  app.useGlobalInterceptors(new AdvancedLoggingInterceptor());
  //app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // --- ตั้งค่า prefix ให้กับ API ทั้งหมด ---
  app.setGlobalPrefix('api'); 
  // --------------------
   

  // 2. ตั้งค่า Swagger  
  const config = new DocumentBuilder()
    .setTitle('Market Signal API')
    .setDescription('API สำหรับดึงข้อมูลสัญญาณเทคนิค (RSI, EMA, Crosses)')
    .setVersion('1.0')
    .addTag('NestJs')
    .addBearerAuth( // <--- เพิ่มบรรทัดนี้
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'ใส่เฉพาะ JWT Token (ไม่ต้องพิมพ์ Bearer นำหน้า)',
      in: 'header',
    },
    'accessToken', // ชื่ออ้างอิงที่จะใช้ใน Decorator
  )
  .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);  
  
  // เขียนไฟล์ swagger.json ลงเครื่องเพื่อใช้กับ Generator
  fs.writeFileSync('./swagger.json', JSON.stringify(document));


  const frontendPath = join(__dirname, '..', 'public'); 
  // Serve static assets
  app.use(express.static(frontendPath,
    { extensions: ['html', 'htm'],
      index: 'index.html',     // บังคับหา index.html
      redirect: true           // ให้มัน Redirect ถ้าลืมใส่ / ท้าย URL
    }));  
  //console.log(`frontendPath => ${frontendPath}, {extensions: ['html', 'htm']} }`);

  // ตั้งค่า CORS ให้อนุญาตเฉพาะจากแหล่งที่มาที่กำหนด (เช่น Frontend ของคุณ)
  app.enableCors({
    origin: 'http://localhost:3000', // อนุญาต (Frontend ของคุณ)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // สำหรับ class-validator;
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // SPA fallback (Express 5 safe)
  app.getHttpAdapter().get('/', (req, res) => {
    res.sendFile(join(frontendPath, 'index.html'));
  });

  await app.listen(PORT);
  console.debug(`🚀 API is running on: http://localhost:${PORT}/api`);
  console.debug(`🔗📝 Swagger Docs: http://localhost:${PORT}/swagger`);
  console.debug(`🔒 Login: http://localhost:${PORT}/admin/login`);


}


bootstrap();