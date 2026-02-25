import { User } from '../../users/entities/user.entity';
export declare class UserAccessLog {
    accessId: string;
    userId: string;
    user: User;
    actionType: string;
    ipAddress: string;
    userAgent: string;
    sessionId: string;
    createdAt: Date;
}
