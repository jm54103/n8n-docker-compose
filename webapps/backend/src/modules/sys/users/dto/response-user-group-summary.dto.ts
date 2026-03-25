import { ApiProperty } from '@nestjs/swagger';

export class UserGroupSummaryDto {
  @ApiProperty()
  groupId: number;

  @ApiProperty()
  groupName: string;
}