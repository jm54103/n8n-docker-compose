import { User } from '../../users/entities/user.entity';
import { SystemPermission } from '../../system-permissions/entities/system-permission.entity';
export declare class UserGroup {
    groupId: number;
    groupName: string;
    description: string;
    createdAt: Date;
    users: User[];
    permissions: SystemPermission[];
}
