import { UserGroup } from '../auth/user-group.entity';
export declare class UserPermission {
    permissionId: number;
    permissionKey: string;
    permissionName: string;
    description: string;
    groups: UserGroup[];
}
