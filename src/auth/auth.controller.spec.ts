import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/model/dto/user.dto';
import { Role } from 'src/config/role.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { User } from 'src/model/entities/user';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let userController: UserController;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController, UserController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            signIn: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            register: jest.fn(),
          },
        },
        JwtService,
        UserService,
        ConfigService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    userController = module.get<UserController>(UserController);
    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        roles: [Role.User],
        password: 'password123',
      };
      const result = {
        id: 1,
        ...createUserDto,
        createdAt: new Date(),
        roles: [Role.User],
      };
      jest.spyOn(authService, 'register').mockResolvedValue(result);

      expect(await userController.register(createUserDto)).toEqual(result);
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const result = { access_token: 'token' };
      jest.spyOn(authService, 'signIn').mockResolvedValue(result);

      expect(await controller.login(loginDto)).toEqual(result);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const user = { id: 1, email: 'test@example.com', roles: ['user'] };
      const req = { user };

      const result = controller.getProfile(req);

      expect(result).toEqual({
        id: user.id,
        email: user.email,
        roles: user.roles,
      });
    });
  });
});
