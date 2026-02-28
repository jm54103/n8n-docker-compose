import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UserGroup } from './entities/user-group.entity';
import { SystemPermission } from './../system-permissions/entities/system-permission.entity';
import { CreateUserGroupDto, UpdateUserGroupDto } from './dto';

@Injectable()
export class UserGroupsService {
  constructor(
    @InjectRepository(UserGroup)
    private readonly groupRepo: Repository<UserGroup>,
    
    @InjectRepository(SystemPermission)
    private readonly permissionRepo: Repository<SystemPermission>,
  ) {}

  async create(dto: CreateUserGroupDto) {
    const group = this.groupRepo.create(dto);
    
    if (dto.permissionIds) {
      group.permissions = await this.permissionRepo.findBy({
        permissionId: In(dto.permissionIds),
      });
    }
    
    return await this.groupRepo.save(group);
  }

  async findAll() {
    return await this.groupRepo.find({ relations: ['permissions'] });
  }

  async findOne(id: number) {
    const group = await this.groupRepo.findOne({
      where: { groupId: id },
      relations: ['permissions'],
    });
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  async update(id: number, dto: UpdateUserGroupDto) {
    const group = await this.findOne(id);
    
    if (dto.permissionIds) {
      group.permissions = await this.permissionRepo.findBy({
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