import { IsNotEmpty, IsString, IsOptional, IsArray, IsInt } from 'class-validator';

export class CreateUserGroupDto {
  @IsString()
  @IsNotEmpty()
  groupName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  permissionIds?: number[]; // รับ ID ของ permissions ที่ต้องการผูกกับกลุ่มนี้
}