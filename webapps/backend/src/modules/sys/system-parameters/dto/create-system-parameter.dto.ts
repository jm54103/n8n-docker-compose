import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateSystemParameterDto {
  @ApiProperty({
    description: 'Param Key',
    example: 'TEST_PARAM_KEY1',
  })
  @IsString()
  @IsNotEmpty()
  paramKey: string;

  @ApiProperty({
    description: 'Param Value',
    example: 'VALUE1',
  })
  @IsString()
  @IsNotEmpty()
  paramValue: string;

  @ApiProperty({
    description: 'Type',
    example: 'STRING',
  })
  @IsEnum(['INT', 'STRING', 'BOOL'])
  @IsOptional()
  valueType?: string;

  @ApiProperty({
    description: 'รายละเอียดของการตั้งค่าใช้งาน',
    example: 'detail of value',
  })
  @IsString()
  @IsOptional()
  description?: string;
}