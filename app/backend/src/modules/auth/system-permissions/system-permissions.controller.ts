import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { SystemPermissionsService } from './system-permissions.service';
import { CreateSystemPermissionDto, UpdateSystemPermissionDto } from './dto';

@Controller('system-permissions') // เปลี่ยน Route
export class SystemPermissionsController {
  constructor(private readonly permissionService: SystemPermissionsService) {}

 

  @Post()
  create(@Body() createDto: CreateSystemPermissionDto) {
    return this.permissionService.create(createDto);
  }

  @Get()
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateSystemPermissionDto) {
    return this.permissionService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.remove(id);
  }
}