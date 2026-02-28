import { UserGroupsService } from './user-groups.service';
import { CreateUserGroupDto, UpdateUserGroupDto } from './dto';
export declare class UserGroupsController {
    private readonly groupService;
    constructor(groupService: UserGroupsService);
    create(createDto: CreateUserGroupDto): Promise<import("./entities/user-group.entity").UserGroup>;
    findAll(): Promise<import("./entities/user-group.entity").UserGroup[]>;
    findOne(id: number): Promise<import("./entities/user-group.entity").UserGroup>;
    update(id: number, updateDto: UpdateUserGroupDto): Promise<import("./entities/user-group.entity").UserGroup>;
    remove(id: number): Promise<import("./entities/user-group.entity").UserGroup>;
}
