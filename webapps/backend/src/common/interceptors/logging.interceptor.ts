// src/common/interceptors/logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; // ต้องมี JwtModule ในโปรเจกต์
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class AdvancedLoggingInterceptor implements NestInterceptor {
  
  private readonly logger = new Logger('HTTP_ACCESS');    

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const authHeader = request.headers.authorization;
    const { method, url, ip, body, headers } = request;
    const startTime = Date.now();

    let userId = 'Guest';    

    return next.handle().pipe(
      tap((data) => {
        const response = ctx.getResponse();
        const duration = Date.now() - startTime;
        const user = request.user; 

        // บันทึก Log ขา Success
        this.logger.log({
          message: `ACCESS_LOG_SUCCESS`,                   
          method,
          url,
          statusCode: response.statusCode,
          duration: `${duration}ms`,
          ip,
          userAgent: headers['user-agent'],
          payload: this.maskSensitiveData(body), // เรียกใช้ function ปกปิดข้อมูล
        });
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        const statusCode = error.status || 500;

        // บันทึก Log ขา Error
        this.logger.error({
          message: `ACCESS_LOG_ERROR`,
          method,
          url,
          statusCode,
          duration: `${duration}ms`,
          ip,
          error: error.message,
          payload: this.maskSensitiveData(body),
        });
        return throwError(() => error);
      }),
    );
  }

  // แยก Logic การ Mask ข้อมูลออกมาเพื่อให้ Clean
  private maskSensitiveData(body: any) {
    if (!body) return body;
    const safeBody = { ...body };
    const sensitiveFields = ['password', 'token', 'secret'];
    sensitiveFields.forEach((field) => {
      if (safeBody[field]) safeBody[field] = '********';
    });
    return safeBody;
  }
}