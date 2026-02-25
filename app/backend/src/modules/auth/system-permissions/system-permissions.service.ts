import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemPermission } from './entities/system-permission.entity';
import { CreateSystemPermissionDto, UpdateSystemPermissionDto } from './dto';

@Injectable()
export class SystemPermissionsService {
  constructor(
    @InjectRepository(SystemPermission)
    private readonly permissionRepo: Repository<SystemPermission>,
  ) {}

  async create(dto: CreateSystemPermissionDto) {
    const existing = await this.permissionRepo.findOne({ where: { permissionKey: dto.permissionKey } });
    if (existing) throw new ConflictException('Permission key already exists');

    const permission = this.permissionRepo.create(dto);
    return await this.permissionRepo.save(permission);
  }

  async findAll() {
    return await this.permissionRepo.find();
  }

  async findOne(id: number) {
    const permission = await this.permissionRepo.findOne({ where: { permissionId: id } });
    if (!permission) throw new NotFoundException('Permission not found');
    return permission;
  }

  async update(id: number, dto: UpdateSystemPermissionDto) {
    const permission = await this.findOne(id);
    Object.assign(permission, dto);
    return await this.permissionRepo.save(permission);
  }

  async remove(id: number) {
    const permission = await this.findOne(id);
    return await this.permissionRepo.remove(permission);
  }
  
 
}