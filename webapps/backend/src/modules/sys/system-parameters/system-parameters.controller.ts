import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { SystemParametersService } from './system-parameters.service';
import { CreateSystemParameterDto, UpdateSystemParameterDto } from './dto';

@Controller('system-parameters')
export class SystemParametersController {
  constructor(private readonly paramService: SystemParametersService) {}

  @Post()
  create(@Body() createDto: CreateSystemParameterDto) {
    return this.paramService.create(createDto);
  }

  @Get()
  findAll() {
    return this.paramService.findAll();
  }

  @Get(':key/value')
  async getValue(@Param('key') key: string) {
    const value = await this.paramService.getValue(key);
    return { key, value };
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSystemParameterDto,
  ) {
    return this.paramService.update(id, updateDto);
  }
}