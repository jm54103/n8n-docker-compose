import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

export const winstonConfig = {
  transports: [
    // 1. แสดงผลบน Console (มีสีสัน อ่านง่ายสำหรับ Dev)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike('ApplicationName', {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),
    // 2. บันทึกลงไฟล์ (รูปแบบ JSON สำหรับ Production/Audit)
    new winston.transports.DailyRotateFile({
      dirname: 'logs',
      filename: 'http-access-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d', // เก็บย้อนหลัง 14 วัน
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
};