import { IsNotEmpty, IsString, IsOptional, IsUUID, IsObject } from 'class-validator';

export class CreateActivityLogDto {
  @IsUUID()
  @IsOptional()
  actorId?: string; // ID ของผู้ที่ทำการแก้ไข

  @IsString()
  @IsNotEmpty()
  actionType: string; // เช่น 'UPDATE_USER_STATUS'

  @IsString()
  @IsOptional()
  targetTable?: string; // ตารางที่ถูกแก้ไข เช่น 'users'

  @IsUUID()
  @IsOptional()
  targetId?: string; // ID ของข้อมูลในตารางนั้นที่ถูกเปลี่ยน

  @IsObject()
  @IsOptional()
  oldValue?: Record<string, any>; // ค่าก่อนเปลี่ยน

  @IsObject()
  @IsOptional()
  newValue?: Record<string, any>; // ค่าหลังเปลี่ยน
}