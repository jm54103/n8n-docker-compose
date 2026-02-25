import { User } from '../../modules/auth/users/entities/user.entity';
export declare class UserGroup {
    groupId: number;
    groupName: string;
    description: string;
    createdAt: Date;
    users: User[];
    permissions: User;
}
