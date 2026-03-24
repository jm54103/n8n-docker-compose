import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from '../auth/infrastructure/guard/permissions.guard';


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export เพื่อให้ Module อื่นเรียกใช้ได้
})
export class UsersModule {}