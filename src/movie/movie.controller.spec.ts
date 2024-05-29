import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MovieDto } from '../model/dto/movie.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('MovieController', () => {
  let controller: MovieController;
  let service: MovieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MovieService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        JwtService,
        ConfigService,
      ],
    }).compile();

    controller = module.get<MovieController>(MovieController);
    service = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all movies', async () => {
    const movies = [
      {
        id: 1,
        title: 'Test Movie',
        director: 'Test Director',
        description: 'Test Description',
        releaseDate: 2022,
        createdAt: new Date(),
      },
    ];
    jest.spyOn(service, 'findAll').mockResolvedValueOnce(movies);

    const result = await controller.findAll();

    expect(result).toBe(movies);
  });

  it('should create a movie', async () => {
    const movieDto: MovieDto = {
      title: 'Test Movie',
      director: 'Test Director',
      description: 'Test Description',
      releaseDate: 2022,
    };
    const createdMovie = { id: 1, ...movieDto, createdAt: new Date() };
    jest.spyOn(service, 'create').mockResolvedValueOnce(createdMovie);

    const result = await controller.create(movieDto);

    expect(result).toBe(createdMovie);
  });

  it('should return a movie by id', async () => {
    const movieId = 1;
    const movie = {
      id: movieId,
      title: 'Test Movie',
      director: 'Test Director',
      description: 'Test Description',
      releaseDate: 2022,
      createdAt: new Date(),
    };
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(movie);

    const result = await controller.findOne(movieId);

    expect(result).toBe(movie);
  });

  it('should update a movie', async () => {
    const movieId = 1;
    const movieDto: MovieDto = {
      title: 'Updated Movie',
      director: 'Updated Director',
      description: 'Updated Description',
      releaseDate: 2023,
    };
    const updatedMovie = { id: movieId, ...movieDto, createdAt: new Date() };
    jest.spyOn(service, 'update').mockResolvedValueOnce(updatedMovie);

    const result = await controller.update(movieId, movieDto);

    expect(result).toBe(updatedMovie);
  });

  it('should remove a movie', async () => {
    const movieId = 1;
    jest.spyOn(service, 'remove').mockResolvedValueOnce();

    const result = await controller.remove(movieId);

    expect(result).toBeUndefined();
  });
});
