// auth-logger.service.ts
import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class AuthLogger extends ConsoleLogger {
  log(message: any, context?: string) {
    const logEntry = `[${new Date().toISOString()}] ${context}: ${message}\n`;
    // เขียนลงไฟล์แยกสำหรับ User Access
   
    fs.appendFileSync(this.getFileName(), logEntry);
    super.log(message, context); // ยังคงแสดงใน Console ปกติด้วย
  }

   getFileName()
   {
      const today = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Bangkok' // กำหนดให้เป็นเวลาไทย
      }).format(new Date());
      return `logs/user-access-${today}.log`;
   }
  
}