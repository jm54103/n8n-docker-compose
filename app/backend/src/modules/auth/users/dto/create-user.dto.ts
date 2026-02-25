import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum, IsInt, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  passwordHash: string;

  @IsInt()
  @IsNotEmpty()
  groupId: number;

  @IsOptional()
  @IsEnum(['ACTIVE', 'DISABLED'])
  status?: string;
}