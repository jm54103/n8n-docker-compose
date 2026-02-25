import { SystemPermissionsService } from './system-permissions.service';
import { CreateSystemPermissionDto, UpdateSystemPermissionDto } from './dto';
export declare class SystemPermissionsController {
    private readonly permissionService;
    constructor(permissionService: SystemPermissionsService);
    create(createDto: CreateSystemPermissionDto): Promise<import("./entities/system-permission.entity").SystemPermission>;
    findAll(): Promise<import("./entities/system-permission.entity").SystemPermission[]>;
    findOne(id: number): Promise<import("./entities/system-permission.entity").SystemPermission>;
    update(id: number, updateDto: UpdateSystemPermissionDto): Promise<import("./entities/system-permission.entity").SystemPermission>;
    remove(id: number): Promise<import("./entities/system-permission.entity").SystemPermission>;
}
