import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto, UpdateUserDto, UserDto } from '../model/dto/user.dto';
import { UserService } from './user.service';
import { RolesGuard } from 'src/Guards/roles.guard';
import { Role } from 'src/config/role.enum';
import { Roles } from 'src/decorator/roles.decorator';
import { ApiResponse } from '@nestjs/swagger';

@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @Roles(Role.Admin, Role.User)
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [CreateUserDto] })
  @Roles(Role.Admin)
  async findAll() {
    return this.userService.findAll();
  }

  @Put('/:id')
  @ApiResponse({ status: 200, type: UserDto })
  @Roles(Role.Admin)
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  async remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
