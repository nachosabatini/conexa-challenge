import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { CreateUserDto } from '../model/dto/user.dto';
import { LoginDto } from '../model/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Register a new user.
   * @param createUserDto - DTO containing user registration data.
   * @returns The created user.
   */
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

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
  @Get('profile')
  getProfile(@Req() req: any) {
    const user = req.user;
    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };
  }
}
