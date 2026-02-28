import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccessLog } from './entities/user-access-log.entity';
import { CreateAccessLogDto } from './dto/create-access-log.dto';

@Injectable()
export class UserAccessLogsService {
  constructor(
    @InjectRepository(UserAccessLog)
    private readonly logRepo: Repository<UserAccessLog>,
  ) {}

  // บันทึก Log ใหม่
  async create(dto: CreateAccessLogDto): Promise<UserAccessLog> {
    const log = this.logRepo.create(dto);
    return await this.logRepo.save(log);
  }

  // ดูประวัติการเข้าใช้งานทั้งหมด (มักใช้ในหน้า Admin)
  async findAll(limit: number = 100) {
    return await this.logRepo.find({
      relations: ['user'], // ดึงข้อมูล User ที่เกี่ยวข้องมาด้วย
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  // ดูประวัติการเข้าใช้งานเฉพาะบุคคล
  async findByUserId(userId: string) {
    return await this.logRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}