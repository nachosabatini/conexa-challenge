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
import { RolesGuard } from 'src/utils/Guards/roles.guard';
import { Role } from 'src/config/role.enum';
import { Roles } from 'src/utils/decorator/roles.decorator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  /**
   * Register a new user.
   * @param createUserDto - The details of the user to register.
   * @returns The registered user.
   */
  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'Register a new user',
    type: UserDto,
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  /**
   * Retrieve all users.
   * @returns A list of users.
   */
  @Get()
  @ApiResponse({ status: 200, type: [UserDto] })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async findAll() {
    return this.userService.findAll();
  }

  /**
   * Update a user.
   * @param id - The ID of the user to update.
   * @param updateUserDto - The updated user details.
   * @returns The updated user.
   */
  @Put('/:id')
  @ApiResponse({ status: 200, type: UserDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * Delete a user by ID.
   * @param id - The ID of the user to delete.
   * @returns A message indicating the result of the deletion.
   */
  @Delete('/:id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Delete a user by ID' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
