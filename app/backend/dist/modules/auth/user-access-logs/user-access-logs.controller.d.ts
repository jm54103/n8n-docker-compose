import { UserAccessLogsService } from './user-access-logs.service';
export declare class UserAccessLogsController {
    private readonly logService;
    constructor(logService: UserAccessLogsService);
    findAll(limit?: number): Promise<import("./entities/user-access-log.entity").UserAccessLog[]>;
    findByUser(userId: string): Promise<import("./entities/user-access-log.entity").UserAccessLog[]>;
}
