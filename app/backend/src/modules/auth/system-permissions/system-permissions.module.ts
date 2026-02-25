import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemPermissionsService } from './system-permissions.service';
import { SystemPermissionsController } from './system-permissions.controller';
import { SystemPermission } from './entities/system-permission.entity';

@Module({
  imports: [
    // ลงทะเบียน SystemPermission Entity
    TypeOrmModule.forFeature([SystemPermission]),
  ],
  controllers: [SystemPermissionsController],
  providers: [SystemPermissionsService],
  // Export Service เพื่อให้ UserGroupsModule นำไปใช้เช็คหรือผูกสิทธิ์ได้
  exports: [SystemPermissionsService],
})
export class SystemPermissionsModule {}