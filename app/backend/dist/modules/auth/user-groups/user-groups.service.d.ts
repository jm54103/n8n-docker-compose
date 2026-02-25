import { Repository } from 'typeorm';
import { UserGroup } from './entities/user-group.entity';
import { SystemPermission } from './../system-permissions/entities/system-permission.entity';
import { CreateUserGroupDto, UpdateUserGroupDto } from './dto';
export declare class UserGroupsService {
    private readonly groupRepo;
    private readonly permissionRepo;
    constructor(groupRepo: Repository<UserGroup>, permissionRepo: Repository<SystemPermission>);
    create(dto: CreateUserGroupDto): Promise<UserGroup>;
    findAll(): Promise<UserGroup[]>;
    findOne(id: number): Promise<UserGroup>;
    update(id: number, dto: UpdateUserGroupDto): Promise<UserGroup>;
    remove(id: number): Promise<UserGroup>;
}
