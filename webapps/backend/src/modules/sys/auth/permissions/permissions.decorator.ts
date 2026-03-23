import { SetMetadata } from '@nestjs/common';

// กำหนด Metadata Key สำหรับเก็บสิทธิ์ที่ต้องการ
export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);