import { IsNotEmpty, IsString, IsOptional, IsUUID, IsIP } from 'class-validator';

export class CreateAccessLogDto {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsNotEmpty()
  actionType: string; // 'LOGIN_SUCCESS', 'LOGIN_FAILED', 'LOGOUT', 'LOCKOUT'

  @IsIP()
  @IsOptional()
  ipAddress?: string;

  @IsString()
  @IsOptional()
  userAgent?: string;

  @IsString()
  @IsOptional()
  sessionId?: string;
}