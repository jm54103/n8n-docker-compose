import { Repository } from 'typeorm';
import { UserAccessLog } from './entities/user-access-log.entity';
import { CreateAccessLogDto } from './dto/create-access-log.dto';
export declare class UserAccessLogsService {
    private readonly logRepo;
    constructor(logRepo: Repository<UserAccessLog>);
    create(dto: CreateAccessLogDto): Promise<UserAccessLog>;
    findAll(limit?: number): Promise<UserAccessLog[]>;
    findByUserId(userId: string): Promise<UserAccessLog[]>;
}
