import { UserGroup } from '../../user-groups/entities/user-group.entity';
export declare class User {
    userId: string;
    username: string;
    email: string;
    passwordHash: string;
    group: UserGroup;
    groupId: number;
    isActive: boolean;
    status: string;
    isLoggedIn: boolean;
    sessionKey: string;
    loginAttempts: number;
    lockUntil: Date;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
}
