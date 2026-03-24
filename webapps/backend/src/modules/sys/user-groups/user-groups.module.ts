import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGroupsService } from './user-groups.service';
import { UserGroupsController } from './user-groups.controller';
import { UserGroup } from './entities/user-group.entity';
import { UserGroupPermission } from './entities/user-group-permission.entity';
import { SystemPermission } from '../system-permissions/entities/system-permission.entity';

@Module({
  imports: [UserGroupsModule,TypeOrmModule.forFeature([UserGroup, UserGroupPermission, SystemPermission])],
  controllers: [UserGroupsController],
  providers: [UserGroupsService],
  exports: [UserGroupsService], 
})
export class UserGroupsModule {}