import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto'; // ไม่ต้องระบุชื่อไฟล์ยาวๆ
import { JwtAuthGuard } from '../auth/infrastructure/guard/jwt-auth.guard';
import { PermissionsGuard } from '../auth/infrastructure/guard/permissions.guard';
import { Permissions } from '../auth/infrastructure/guard/permissions.decorator'; // *** เพิ่มบรรทัดนี้ ***
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()  
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('USER_MANAGEMENT')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('USER_MANAGEMENT')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}