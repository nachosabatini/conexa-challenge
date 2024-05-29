import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../model/dto/user.dto';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/config/role.enum';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findOneByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should hash password and create user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = {
        id: 1,
        email: createUserDto.email,
        password: hashedPassword,
        roles: [Role.User],
        createdAt: new Date(),
      };
      jest.spyOn(userService, 'create').mockResolvedValue(user);

      const result = await service.register(createUserDto);

      expect(userService.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: expect.any(String),
      });
      expect(result).toEqual(user);
    });
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        id: 1,
        email,
        password: hashedPassword,
        roles: [Role.User],
        createdAt: new Date(),
      };
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.validateUser(email, password);

      expect(result).toEqual(user);
    });

    it('should return null if user does not exist', async () => {
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(null);

      const result = await service.validateUser(
        'test@example.com',
        'password123',
      );

      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        id: 1,
        email,
        password: hashedPassword,
        roles: [Role.User],
        createdAt: new Date(),
      };
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
    });
  });

  describe('signIn', () => {
    it('should return an access token if credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        id: 1,
        email,
        password: hashedPassword,
        roles: [Role.User],
        createdAt: new Date(),
      };
      jest.spyOn(service, 'validateUser').mockResolvedValue(user);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

      const result = await service.signIn(email, password);

      expect(result).toEqual({ access_token: 'token' });
    });

    it('should throw an UnauthorizedException if credentials are invalid', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(
        service.signIn('test@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
