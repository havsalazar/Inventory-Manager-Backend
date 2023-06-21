import { JwtService } from '@nestjs/jwt';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('Users')

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @ApiBearerAuth('jwt-auth')
  @Get('all')
  findAll() {
    return this.usersService.findAll();
  }
  @ApiBearerAuth('jwt-auth')
  @Get('byId:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  @ApiBearerAuth('jwt-auth')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  @ApiBearerAuth('jwt-auth')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
  @Get('init')
  init() {    
    return this.usersService.init();
  }
}

