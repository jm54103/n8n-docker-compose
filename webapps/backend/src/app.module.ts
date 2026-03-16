import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

/*-- Redis  --*/
import { RedisModule } from '@nestjs-modules/ioredis';

/* ===== Stocks ===== */
import { MarketSignalsModule } from './modules/app/stocks/market-signals/market-signals.module';
import { MarketSignal } from './modules/app/stocks/market-signals/entities/market-signal.entity';
import { CandleSticksModule } from './modules/app/stocks/candle-sticks/candle-sticks.module';
import { CandleStick } from './modules/app/stocks/candle-sticks/entities/candle-stick.entity';

/* ===== System ===== */
import { SystemParametersModule } from './modules/sys/system-parameters/system-parameters.module';
import { SystemParameter } from './modules/sys/system-parameters/entities/system-parameter.entity';
import { SystemPermissionsModule } from './modules/sys/system-permissions/system-permissions.module';
import { SystemPermission } from './modules/sys/system-permissions/entities/system-permission.entity';

/* ===== Users ===== */
import { UsersModule } from './modules/sys/users/users.module';
import { User } from './modules/sys/users/entities/user.entity';
import { UserGroupsModule } from './modules/sys/user-groups/user-groups.module';
import { UserGroup } from './modules/sys/user-groups/entities/user-group.entity';

/* ===== Auth ===== */
import { AuthModule } from './modules/sys/auth/auth.module';
import { UserSession } from './modules/sys/auth/entities/user-session.entity';

/*--Logger--*/
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file'; // ต้อง import ตัวนี้ด้วย
/*--Logger--*/

@Module({
  imports: [
      WinstonModule.forRoot({
      transports: [
        // 1. แสดงผลบน Console
        new winston.transports.Console({
            format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, context }) => {
              return `[${timestamp}] ${level}: [${context || 'App'}] ${message}`;
            }),
          ),
        }),
        /*--DailyRotateFile log--*/
        /*
        // 2.1 เก็บลงไฟล์ (Error เท่านั้น)     
        new winston.transports.DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          level: 'error',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '50m',
          maxFiles: '30d', // เก็บย้อนหลัง 30 วัน
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, context }) => {
              return `[${timestamp}] ${level}: [${context || 'App'}] ${message}`;
            }),
            //winston.format.json(),
          ),
        }),         
        // 2.2 เก็บลงไฟล์ (Warning เท่านั้น)
        new winston.transports.DailyRotateFile({
          filename: 'logs/warning-%DATE%.log',
          level: 'warn',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '50m',
          maxFiles: '30d', // เก็บย้อนหลัง 30 วัน
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, context }) => {
              return `[${timestamp}] ${level}: [${context || 'App'}] ${message}`;
            }),
            //winston.format.json(),
          ),
        }),
        // 2.3 เก็บลงไฟล์ (Info เท่านั้น)
        new winston.transports.DailyRotateFile({
          filename: 'logs/info-%DATE%.log',
          level: 'info',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '50m',
          maxFiles: '30d', // เก็บย้อนหลัง 30 วัน
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, context }) => {
              return `[${timestamp}] ${level}: [${context || 'App'}] ${message}`;
            }),
            //winston.format.json(),
          ),
        }),
        // 2.4 เก็บลงไฟล์ (Debug เท่านั้น)       
        new winston.transports.DailyRotateFile({
          filename: 'logs/debug-%DATE%.log',
          level: 'debug',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '50m',
          maxFiles: '30d', // เก็บย้อนหลัง 30 วัน
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, context }) => {
              return `[${timestamp}] ${level}: [${context || 'App'}] ${message}`;
            }),
            //winston.format.json(),
          ),
        }),       
        // 2.5 เก็บลงไฟล์ (verbose เท่านั้น)                  
        new winston.transports.DailyRotateFile({
          filename: 'logs/verbose-%DATE%.log',
          level: 'verbose',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '50m',
          maxFiles: '30d', // เก็บย้อนหลัง 30 วัน
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, context }) => {
              return `[${timestamp}] ${level}: [${context || 'App'}] ${message}`;
            }),
            //winston.format.json(),
          ),
        }),        
        // --- 3. ไฟล์รวม Log ทุกประเภท (Combined) ---
        new winston.transports.DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '50m',
          maxFiles: '30d', // เก็บย้อนหลัง 30 วัน
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, context }) => {
              return `[${timestamp}] ${level}: [${context || 'App'}] ${message}`;
            }),
            //winston.format.json(),
          ),
        }),
        */
      ],
    }),
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
      isGlobal: true,
    }),
    RedisModule.forRoot({
    type: 'single',
      options: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      entities: [
        MarketSignal,
        CandleStick,
        SystemParameter,
        SystemPermission,
        User,
        UserGroup,
        UserSession,
      ],
      synchronize: false, // production = false
    }),


    /* Modules */
    //MarketSignalsModule,
    //CandleSticksModule,
    //SystemParametersModule,
    //SystemPermissionsModule,
    //UsersModule,
    //UserGroupsModule,
    RedisModule,
    AuthModule,
  ],
})
export class AppModule {}