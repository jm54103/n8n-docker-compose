import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { SystemParametersService } from './system-parameters.service';
import { CreateSystemParameterDto, UpdateSystemParameterDto } from './dto';
/*--Guard--*/
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/infrastructure/guard/jwt-auth.guard';
import { Permissions } from '../auth/infrastructure/guard/permissions.decorator'; 
import { PermissionsGuard } from '../auth/infrastructure/guard/permissions.guard';
import { Public } from '../auth/infrastructure/guard/public.decorator';

@Controller('system-parameters')
export class SystemParametersController {
  constructor(private readonly paramService: SystemParametersService) {}

  @Post()
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('SETTINGS')      
  create(@Body() createDto: CreateSystemParameterDto) {
    return this.paramService.create(createDto);
  }

  @Get()
  @Public() 
  findAll() {
    return this.paramService.findAll();
  }

  @Get(':key/value')
  @Public() 
  async getValue(@Param('key') key: string) {
    const value = await this.paramService.getValue(key);
    return { key, value };
  }

  @Patch(':id')
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard, PermissionsGuard)     
  @Permissions('SETTINGS')      
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSystemParameterDto,
  ) {
    return this.paramService.update(id, updateDto);
  }
}