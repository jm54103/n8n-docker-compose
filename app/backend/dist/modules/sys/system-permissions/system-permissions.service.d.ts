import { Repository } from 'typeorm';
import { SystemPermission } from './entities/system-permission.entity';
import { CreateSystemPermissionDto, UpdateSystemPermissionDto } from './dto';
export declare class SystemPermissionsService {
    private readonly permissionRepo;
    constructor(permissionRepo: Repository<SystemPermission>);
    create(dto: CreateSystemPermissionDto): Promise<SystemPermission>;
    findAll(): Promise<SystemPermission[]>;
    findOne(id: number): Promise<SystemPermission>;
    update(id: number, dto: UpdateSystemPermissionDto): Promise<SystemPermission>;
    remove(id: number): Promise<SystemPermission>;
}
