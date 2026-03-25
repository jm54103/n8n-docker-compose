import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UserGroup } from './entities/user-group.entity';
import { CreateUserGroupDto, UpdateUserGroupDto } from './dto';
import { UserGroupPermission } from './entities/user-group-permission.entity';
import { ResponseUserGroupDto } from './dto/response-user-group.dto';

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

  async findAll_dto() {
    const groups = await this.findAll();
    return groups.map(group => this.toResponseDto(group));
  }

  async findAll() {
    return await this.groupRepo.find({ relations: ['permissions'] });
  }

  async findOne_dto(id: number){    
      const userGroup = await this.findOne(id);
      return this.toResponseDto(userGroup);
  }
  
  async findOne(id: number) {
    try {
      const userGroup = await this.groupRepo.findOne({
        where: { groupId: id },
        relations: [
          'userGroupPermissions',
          'userGroupPermissions.systemPermission',
        ],
      });      
      return userGroup;
    } catch (dbErr) {
      console.error('DB Error in Service:', dbErr);
      throw dbErr;
    }
  }

  private toResponseDto(entity: UserGroup): ResponseUserGroupDto {
    return {
      groupId: entity.groupId,
      groupName: entity.groupName,
      description: entity.description,
      createdAt: entity.createdAt,
      // map permissions
      permissions: entity.userGroupPermissions?.map(p => ({
        permissionKey: p.systemPermission?.permissionKey,
        permissionName: p.systemPermission?.permissionName,
      })) || [],
    };
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