import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGroupsService } from './user-groups.service';
import { UserGroupsController } from './user-groups.controller';
import { UserGroup } from './entities/user-group.entity';
import { SystemPermission } from './../system-permissions/entities/system-permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserGroup, SystemPermission])],
  controllers: [UserGroupsController],
  providers: [UserGroupsService],
})
export class UserGroupsModule {}