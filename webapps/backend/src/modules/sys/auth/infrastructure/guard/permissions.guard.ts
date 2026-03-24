import { 
  Injectable, 
  CanActivate, 
  ExecutionContext, 
  ForbiddenException, 
  UnauthorizedException 
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    // 1. ดึง Required Permissions
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // ถ้าไม่ได้ระบุสิทธิ์ (Public) ให้ผ่านได้เลย
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // 2. ดึง User จาก Request
    const request = context.switchToHttp().getRequest();
    const user = request.user; // ปกติ Passport จะยัดไว้ที่ request.user

    //console.log('Full Request User:', request.user); // ดูว่ามีค่าไหม
    //console.log('Auth Header:', request.headers.authorization); // ดูว่า Token ส่งมาจริงไหม

    const pretty = JSON.stringify(user, null, 2);
    console.debug(`PermissionsGuard : ${pretty}`);   

    if (!user) {
      throw new UnauthorizedException('🚫 PermissionsGuard กรุณาเข้าสู่ระบบก่อนทำรายการ');
    }

    // เช็กว่ามีก้อน group และ permissions หรือไม่
    if (!user.group || !Array.isArray(user.group.permissions)) {
      throw new ForbiddenException('🚫 PermissionsGuard บัญชีของคุณยังไม่มีการกำหนดกลุ่มสิทธิ์');
    }

    // 3. ตรวจสอบสิทธิ์ (เช็กตรงๆ เพราะใน Payload เป็น Array ของ String อยู่แล้ว)
    const hasPermission = requiredPermissions.every((permission) =>
      user.group.permissions.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException(`🚫 คุณไม่มีสิทธิ์เข้าถึงฟังก์ชันนี้ (ต้องการ: ${requiredPermissions.join(', ')})`);
    }

    return true;
        
  }
}