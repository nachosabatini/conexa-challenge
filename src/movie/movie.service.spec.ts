import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from '../model/entities/movie';
import { Repository } from 'typeorm';
import { MovieDto } from '../model/dto/movie.dto';
import { NotFoundException } from '@nestjs/common';
import { SwapiModule } from 'src/third-party/swapi.module';
import { MovieController } from './movie.controller';
import { SwapiService } from 'src/third-party/swapi.service';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from 'src/utils/Guards/roles.guard';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { ConfigService } from '@nestjs/config';

describe('MovieService', () => {
  let service: MovieService;
  let repository: Repository<Movie>;
  let controller: MovieController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SwapiModule],
      controllers: [MovieController],
      providers: [
        MovieService,
        {
          provide: getRepositoryToken(Movie),
          useClass: Repository,
        },
        JwtService,
        SwapiService,
        ConfigService,
        AuthGuard,
        RolesGuard,
        Reflector,
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
    controller = module.get<MovieController>(MovieController);
    repository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a movie', async () => {
      const movieDto: MovieDto = {
        title: 'Test Movie',
        director: 'Test Director',
        description: 'Test Description',
        releaseDate: 2022,
      };
      const createdMovie: Movie = {
        id: 1,
        ...movieDto,
        createdAt: new Date(),
      };
      jest.spyOn(repository, 'create').mockReturnValue(createdMovie);
      jest.spyOn(repository, 'save').mockResolvedValue(createdMovie);

      const result = await service.create(movieDto);
      expect(result).toEqual(createdMovie);
    });
  });

  describe('findAll', () => {
    it('should return all movies', async () => {
      const movies: Movie[] = [
        {
          id: 1,
          title: 'Movie 1',
          director: 'Director 1',
          description: 'Description 1',
          releaseDate: 2021,
          createdAt: new Date(),
        },
        {
          id: 2,
          title: 'Movie 2',
          director: 'Director 2',
          description: 'Description 2',
          releaseDate: 2022,
          createdAt: new Date(),
        },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(movies);

      const result = await service.findAll();
      expect(result).toEqual(movies);
    });
  });

  describe('findOne', () => {
    it('should return a movie by id', async () => {
      const movieId = 1;
      const movie: Movie = {
        id: movieId,
        title: 'Test Movie',
        director: 'Test Director',
        description: 'Test Description',
        releaseDate: 2022,
        createdAt: new Date(),
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(movie);

      const result = await service.findOne(movieId);
      expect(result).toEqual(movie);
    });

    it('should throw NotFoundException if movie with provided id does not exist', async () => {
      const movieId = 999;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(movieId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      const movieId = 1;
      const movieDto: MovieDto = {
        title: 'Updated Movie',
        director: 'Updated Director',
        description: 'Updated Description',
        releaseDate: 2023,
      };
      const existingMovie: Movie = {
        id: movieId,
        title: 'Test Movie',
        director: 'Test Director',
        description: 'Test Description',
        releaseDate: 2022,
        createdAt: new Date(),
      };
      const updatedMovie: Movie = {
        id: movieId,
        ...movieDto,
        createdAt: new Date(),
      };
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(existingMovie);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedMovie);

      const result = await service.update(movieDto, movieId);
      expect(result).toEqual(updatedMovie);
    });
  });

  describe('remove', () => {
    it('should remove a movie', async () => {
      const movieId = 1;
      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

      await expect(service.remove(movieId)).resolves.not.toThrow();
    });
  });
});
