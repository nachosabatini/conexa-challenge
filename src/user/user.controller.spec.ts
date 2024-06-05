import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from '../model/dto/user.dto';
import { User } from '../model/entities/user';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Role } from 'src/config/role.enum';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        AuthService,
        JwtService,
        ConfigService,
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        roles: [Role.User],
        password: 'password123',
      };
      const newUser: User = {
        id: 1,
        email: 'test@example.com',
        password: 'password123',
        roles: [Role.User],
        createdAt: new Date(),
      };

      jest.spyOn(userService, 'create').mockResolvedValue(newUser);

      const result = await userController.register(createUserDto);
      expect(result).toBe(newUser);
    });

    it('should throw BadRequestException if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'existing@example.com',
        roles: [Role.User],
        password: 'password123',
      };

      jest
        .spyOn(userService, 'create')
        .mockRejectedValue(new BadRequestException());

      await expect(userController.register(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = [
        {
          id: 1,
          email: 'user1@example.com',
          password: 'password123',
          roles: [Role.User],
          createdAt: new Date(),
        },
        {
          id: 2,
          email: 'user2@example.com',
          password: 'password456',
          roles: [Role.User],
          createdAt: new Date(),
        },
      ];

      jest.spyOn(userService, 'findAll').mockResolvedValue(users);

      expect(await userController.findAll()).toEqual(users);
    });
  });

  describe('update', () => {
    it('should update the user with the given ID', async () => {
      const id = 1;
      const updateUserDto: UpdateUserDto = {
        email: 'updated@example.com',
        password: 'newpassword',
      };
      const updatedUser: User = {
        id: 1,
        email: 'updated@example.com',
        password: 'newpassword',
        roles: [Role.User],
        createdAt: new Date(),
      };

      jest.spyOn(userService, 'update').mockResolvedValue(updatedUser);

      expect(await userController.update(id, updateUserDto)).toBe(updatedUser);
    });
  });

  describe('remove', () => {
    it('should remove the user with the given ID', async () => {
      const id = 1;

      jest.spyOn(userService, 'remove').mockResolvedValue();

      await expect(userController.remove(id)).resolves.not.toThrow();
    });

    it('should throw NotFoundException if user with given ID does not exist', async () => {
      const id = 999;

      jest
        .spyOn(userService, 'remove')
        .mockRejectedValue(new NotFoundException());

      await expect(userController.remove(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
