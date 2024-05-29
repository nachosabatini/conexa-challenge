import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/model/dto/user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../config/jwt.interface';
import { User } from 'src/model/entities/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user.
   * @param createUserDto - DTO containing user registration data.
   * @returns The created user.
   */
  async register(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return user;
  }

  /**
   * Validate user credentials.
   * @param email - User's email.
   * @param password - User's password.
   * @returns The user if credentials are valid, otherwise null.
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      return null;
    }

    return user;
  }

  /**
   * Sign in a user.
   * @param email - User's email.
   * @param password - User's password.
   * @returns An object containing the access token.
   */
  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
