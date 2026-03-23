import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. ดึงสิทธิ์ที่ต้องการจาก Decorator (@Permissions)
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // ถ้าไม่ได้ระบุสิทธิ์ไว้ (Public หรือไม่ได้ใส่ Guard) ให้ผ่านได้เลย
    if (!requiredPermissions) {
      return true;
    }

    // 2. ดึงข้อมูล User จาก Request (ซึ่งปกติจะได้มาจาก JwtStrategy)
    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.group) {
      throw new ForbiddenException('User session not found or invalid group');
    }

    // 3. ตรวจสอบว่า User มี Permission ที่ตรงกับที่ต้องการหรือไม่
    // อ้างอิงตาม Schema: user.group.permissions[] -> permissionKey
    const hasPermission = requiredPermissions.every((permission) =>
      user.group.permissions?.some(
        (p: any) => p.permissionKey === permission,
      ),
    );

    if (!hasPermission) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์เข้าถึงส่วนนี้ (Insufficient Permissions)');
    }

    return true;
  }
}