import { PartialType } from '@nestjs/mapped-types';
import { CreateSystemPermissionDto } from './create-system-permission.dto';

export class UpdateSystemPermissionDto extends PartialType(CreateSystemPermissionDto) {}