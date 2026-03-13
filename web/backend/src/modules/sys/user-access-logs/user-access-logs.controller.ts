import { Controller, Get, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { UserAccessLogsService } from './user-access-logs.service';

@Controller('user-access-logs')
export class UserAccessLogsController {
  constructor(private readonly logService: UserAccessLogsService) {}

  @Get()
  findAll(@Query('limit') limit?: number) {
    return this.logService.findAll(limit);
  }

  @Get('user/:userId')
  findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.logService.findByUserId(userId);
  }
}