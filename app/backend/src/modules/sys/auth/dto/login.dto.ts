import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The username of the user',
    example: 'us00001',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The password of the user',
    example: 'SecretPassword123',
  })
  password: string;
}