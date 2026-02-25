import { Repository } from 'typeorm';
import { UserActivityLog } from './entities/user-activity-log.entity';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
export declare class UserActivityLogsService {
    private readonly activityRepo;
    constructor(activityRepo: Repository<UserActivityLog>);
    log(dto: CreateActivityLogDto): Promise<UserActivityLog>;
    findAll(): Promise<UserActivityLog[]>;
    findByTarget(table: string, id: string): Promise<UserActivityLog[]>;
}
