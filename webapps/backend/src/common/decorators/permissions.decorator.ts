
import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions'; // ค่านี้ต้องตรงกับใน Guard
export const Permissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);

