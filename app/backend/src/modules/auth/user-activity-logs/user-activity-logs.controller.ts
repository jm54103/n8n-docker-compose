import { Controller, Get, Query, Param } from '@nestjs/common';
import { UserActivityLogsService } from './user-activity-logs.service';

@Controller('user-activity-logs')
export class UserActivityLogsController {
  constructor(private readonly activityService: UserActivityLogsService) {}

  @Get()
  findAll() {
    return this.activityService.findAll();
  }

  @Get('target/:table/:id')
  findDetails(
    @Param('table') table: string,
    @Param('id') id: string
  ) {
    return this.activityService.findByTarget(table, id);
  }
}