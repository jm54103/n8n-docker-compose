import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UserGroup } from './entities/user-group.entity';
import { CreateUserGroupDto, UpdateUserGroupDto } from './dto';
import { UserGroupPermission } from './entities/user-group-permission.entity';

@Injectable()
export class UserGroupsService {
  constructor(
    @InjectRepository(UserGroup)
    private readonly groupRepo: Repository<UserGroup>,
    
    @InjectRepository(UserGroupPermission)
    private readonly permissionRepo: Repository<UserGroupPermission>,
  ) {}

  async create(dto: CreateUserGroupDto) {
    const group = this.groupRepo.create(dto);
    
    if (dto.permissionIds) {
      group.userGroupPermissions = await this.permissionRepo.findBy({
        permissionId: In(dto.permissionIds),
      });
    }
    
    return await this.groupRepo.save(group);
  }

  async findAll() {
    return await this.groupRepo.find({ relations: ['permissions'] });
  }

  async findOne(id: number) {
  try {
    return await this.groupRepo.findOne({
      where: { groupId : id },
      relations: [
        'userGroupPermissions', 
        'userGroupPermissions.systemPermission' // 👈 ต้องโหลดตัวนี้ด้วยเพื่อให้ได้ permissionKey
      ],
    });
  } catch (dbErr) {
    console.error('DB Error in Service:', dbErr);
    throw dbErr;
  }
}

  async update(id: number, dto: UpdateUserGroupDto) {
    const group = await this.findOne(id);
    
    if (dto.permissionIds) {
      group.userGroupPermissions = await this.permissionRepo.findBy({
        permissionId: In(dto.permissionIds),
      });
    }

    Object.assign(group, dto);
    return await this.groupRepo.save(group);
  }

  async remove(id: number) {
    const group = await this.findOne(id);
    return await this.groupRepo.remove(group);
  }
}