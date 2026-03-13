import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserActivityLog } from './entities/user-activity-log.entity';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';

@Injectable()
export class UserActivityLogsService {
  constructor(
    @InjectRepository(UserActivityLog)
    private readonly activityRepo: Repository<UserActivityLog>,
  ) {}

  // สร้าง Log การแก้ไข
  async log(dto: CreateActivityLogDto): Promise<UserActivityLog> {
    const newLog = this.activityRepo.create(dto);
    return await this.activityRepo.save(newLog);
  }

  // ดึงประวัติการแก้ไขทั้งหมด (เรียงตามล่าสุด)
  async findAll() {
    return await this.activityRepo.find({
      relations: ['actor'],
      order: { createdAt: 'DESC' },
    });
  }

  // ดึงประวัติการแก้ไขที่เกิดขึ้นกับตารางและ Record นั้นๆ
  async findByTarget(table: string, id: string) {
    return await this.activityRepo.find({
      where: { targetTable: table, targetId: id },
      order: { createdAt: 'DESC' },
    });
  }
}