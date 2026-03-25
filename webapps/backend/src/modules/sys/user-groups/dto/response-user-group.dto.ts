import { ApiProperty } from '@nestjs/swagger';

class PermissionDto {
  @ApiProperty()
  permissionKey: string;

  @ApiProperty()
  permissionName: string;
}

export class ResponseUserGroupDto {
  @ApiProperty()
  groupId: number;

  @ApiProperty()
  groupName: string;

  @ApiProperty({ nullable: true })
  description: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: [PermissionDto] })
  permissions: PermissionDto[];
}