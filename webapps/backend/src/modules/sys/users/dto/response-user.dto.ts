import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string; 

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  status: string;

  @ApiProperty()
  isLoggedIn: boolean;

  @ApiProperty({ nullable: true })
  lastLogin: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ nullable: true })
  createdBy: string;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  updatedBy: string;

  @ApiProperty({ nullable: true })
  groups: string[];

}