import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UserDto } from '../model/dto/user.dto';
import { LoginDto } from '../model/dto/login.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Login a user and return an access token.
   * @param loginDto - DTO containing user login data.
   * @returns An object containing the access token.
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto.email, loginDto.password);
  }

  /**
   * Get the profile of the authenticated user.
   * @param req - The request object containing user data.
   * @returns The authenticated user's profile.
   */
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: UserDto })
  @Get('profile')
  getProfile(@Req() req: any): UserDto {
    const user = req.user;
    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };
  }
}
