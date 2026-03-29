import { 
  Injectable, 
  CanActivate, 
  ExecutionContext, 
  ForbiddenException, 
  UnauthorizedException 
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. ดึง Required Permissions จาก Metadata
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // 2. ดึง User/Session Info จาก Request
    const request = context.switchToHttp().getRequest();
    const user = request.user; 

    const userData = JSON.stringify(user, null, 2);
    //console.debug(`👤 User Data: ${userData}`);

    // ตรวจสอบว่าใน Payload มี sessionId หรือไม่
    if (!user || !user.sessionId) {
      throw new UnauthorizedException('🚫 ไม่พบ Session ID ในการยืนยันตัวตน');
    }

    // 3. ดึงข้อมูลจาก Redis โดยใช้ sessionId
    const sessionKey = `session:${user.sessionId}`;
    const cachedData = await this.redis.get(sessionKey);

    if (!cachedData) {
      throw new UnauthorizedException('🚫 เซสชันหมดอายุ หรือถูกยกเลิกแล้ว');
    }

    // Parse ข้อมูลจาก Redis
    const sessionStore = JSON.parse(cachedData);
    //console.debug(`🔑 Session Store Data: ${JSON.stringify(sessionStore, null, 2)}`) ;
    const userPermissions: string[] = sessionStore.group?.permissions;

    // กรณีข้อมูลใน Redis โครงสร้างไม่ถูกต้อง หรือไม่มี permissions
    if (!Array.isArray(userPermissions)) {
      console.error(`❌ Permissions data missing in Redis for session: ${user.sessionId}`, 'PermissionsGuard');
      throw new ForbiddenException('🚫 ข้อมูลสิทธิ์ในระบบไม่สมบูรณ์ กรุณาติดต่อผู้ดูแลระบบ');
    }

    // 4. ตรวจสอบสิทธิ์ (Logic: .every คือต้องมีครบทุกตัว)
    const missingPermissions = requiredPermissions.filter(
      (per) => !userPermissions.includes(per),
    );

    if (missingPermissions.length > 0) {
      console.warn(`🚫 User ${user.sub} denied. Missing: ${missingPermissions.join(', ')}`,'PermissionsGuard');
      throw new ForbiddenException(`🚫 คุณไม่มีสิทธิ์เข้าถึง (ขาดสิทธิ์: ${missingPermissions.join(', ')})`,);
    }        
    return true;
  }
}