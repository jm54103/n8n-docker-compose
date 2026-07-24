import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UserGroupsService } from './user-groups.service';
import { CreateUserGroupDto, UpdateUserGroupDto } from './dto';
import { Public } from '../../../common/decorators/public.decorator';

@Public()
@Controller('user-groups')
export class UserGroupsController {
  constructor(private readonly groupService: UserGroupsService) {}

  @Post()
  create(@Body() createDto: CreateUserGroupDto) {
    return this.groupService.create(createDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.groupService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateUserGroupDto) {
    return this.groupService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.remove(id);
  }
}