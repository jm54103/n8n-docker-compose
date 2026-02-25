import { User } from '../../users/entities/user.entity';
export declare class UserActivityLog {
    activityId: string;
    actorId: string;
    actor: User;
    actionType: string;
    targetTable: string;
    targetId: string;
    oldValue: any;
    newValue: any;
    createdAt: Date;
}
