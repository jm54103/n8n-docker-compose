import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserActivityLogsService } from './user-activity-logs.service';
import { UserActivityLogsController } from './user-activity-logs.controller';
import { UserActivityLog } from './entities/user-activity-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserActivityLog])],
  controllers: [UserActivityLogsController],
  providers: [UserActivityLogsService],
  exports: [UserActivityLogsService], // สำคัญ: เพื่อให้ Module อื่นเรียกใช้ฟังก์ชัน .log()
})
export class UserActivityLogsModule {}