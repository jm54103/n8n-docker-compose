import { PickType, PartialType } from '@nestjs/mapped-types';
import { CreateSystemParameterDto } from './create-system-parameter.dto';

export class UpdateSystemParameterDto extends PartialType(
  PickType(CreateSystemParameterDto, ['paramValue', 'valueType', 'description'] as const),
) {}