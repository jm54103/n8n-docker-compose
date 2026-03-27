import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum, IsInt, IsUUID } from 'class-validator';

export class CreateUserDto {
 
  @IsString()
  @ApiProperty({
    description: 'The username of the user.',
    example: 'temp99',
  })
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @ApiProperty({
    description: 'email of the user.',
    example: 'temp99@example.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    description: 'password of the user.',
    example: 'SecretPassword123',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  passwordHash: string;  
  
  @ApiProperty({
    description: 'user is active.',
    example: 'ACTIVE',
  })  
  @IsOptional()
  @IsEnum(['ACTIVE', 'DISABLED'])
  status?: string;
}