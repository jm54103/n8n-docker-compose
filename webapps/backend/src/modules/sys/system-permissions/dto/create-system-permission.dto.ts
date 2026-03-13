import { IsNotEmpty, IsString, IsOptional, Matches } from 'class-validator';

export class CreateSystemPermissionDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9.]*$/, { message: 'permissionKey must be snake_case or dot notation (e.g., sys.user.edit)' })
  permissionKey: string;

  @IsString()
  @IsNotEmpty()
  permissionName: string;

  @IsString()
  @IsOptional()
  description?: string;
}