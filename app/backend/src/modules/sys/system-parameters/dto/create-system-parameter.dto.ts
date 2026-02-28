import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateSystemParameterDto {
  @IsString()
  @IsNotEmpty()
  paramKey: string;

  @IsString()
  @IsNotEmpty()
  paramValue: string;

  @IsEnum(['INT', 'STRING', 'BOOL'])
  @IsOptional()
  valueType?: string;

  @IsString()
  @IsOptional()
  description?: string;
}