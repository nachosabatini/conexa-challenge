import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from 'src/model/entities/user';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Role } from 'src/config/role.enum';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'UserRepository',
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>('UserRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        roles: [Role.User],
      };
      const newUser = { id: 1, ...createUserDto, createdAt: new Date() };
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(userRepository, 'create').mockReturnValueOnce(newUser);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(newUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(newUser);
    });

    it('should throw BadRequestException if email already exists', async () => {
      const createUserDto = {
        email: 'existing@example.com',
        password: 'password123',
        roles: [Role.User],
      };
      const existingUser = { id: 1, ...createUserDto, createdAt: new Date() };
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(existingUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        {
          id: 1,
          email: 'user1@example.com',
          password: 'password123',
          roles: [Role.User],
          createdAt: new Date(),
        },
      ];
      jest.spyOn(userRepository, 'find').mockResolvedValueOnce(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
    });
  });

  describe('findOneByEmail', () => {
    it('should return the user with the provided email', async () => {
      const email = 'test@example.com';
      const user = {
        id: 1,
        email,
        password: 'password123',
        roles: [Role.User],
        createdAt: new Date(),
      };
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);

      const result = await service.findOneByEmail(email);

      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user with provided email does not exist', async () => {
      const email = 'nonexistent@example.com';
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOneByEmail(email)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('should return the user with the provided ID', async () => {
      const id = 1;
      const user = {
        id,
        email: 'user@example.com',
        password: 'password123',
        roles: [Role.User],
        createdAt: new Date(),
      };
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);

      const result = await service.findOne(id);

      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user with provided ID does not exist', async () => {
      const id = 999;
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update the user with the provided ID', async () => {
      const id = 1;
      const updateUserDto = {
        email: 'updated@example.com',
        password: 'newpassword',
      };
      const updatedUser = {
        id,
        ...updateUserDto,
        roles: [Role.User],
        createdAt: new Date(),
      };
      const existingUser = {
        id,
        email: 'user@example.com',
        password: 'password123',
        roles: [Role.User],
        createdAt: new Date(),
      };
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(existingUser);
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(existingUser);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(updatedUser);

      const result = await service.update(id, updateUserDto);

      expect(result).toEqual(updatedUser);
    });

    it('should throw BadRequestException if email already exists for another user', async () => {
      const id = 1;
      const updateUserDto = {
        email: 'existing@example.com',
        password: 'newpassword',
      };
      const existingUser = {
        id: 2,
        email: 'existing@example.com',
        password: 'password123',
        roles: [Role.User],
        createdAt: new Date(),
      };
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(existingUser);
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(existingUser);

      await expect(service.update(id, updateUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should remove the user with the provided ID', async () => {
      const id = 1;
      jest.spyOn(userRepository, 'delete').mockResolvedValueOnce(undefined);

      await expect(service.remove(id)).resolves.not.toThrow();
    });
  });
});
