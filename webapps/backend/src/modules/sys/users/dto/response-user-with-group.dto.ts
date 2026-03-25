import { ApiProperty } from '@nestjs/swagger';
import { UserGroupSummaryDto } from './response-user-group-summary.dto';

export class ResponseUserWithGroupDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ type: UserGroupSummaryDto, nullable: true })
  group?: UserGroupSummaryDto;
}