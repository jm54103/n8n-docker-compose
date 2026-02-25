import { UserActivityLogsService } from './user-activity-logs.service';
export declare class UserActivityLogsController {
    private readonly activityService;
    constructor(activityService: UserActivityLogsService);
    findAll(): Promise<import("./entities/user-activity-log.entity").UserActivityLog[]>;
    findDetails(table: string, id: string): Promise<import("./entities/user-activity-log.entity").UserActivityLog[]>;
}
