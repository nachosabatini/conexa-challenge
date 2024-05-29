import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from 'src/model/entities/movie';
import { MovieDto } from '../model/dto/movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async create(movie: MovieDto): Promise<Movie> {
    const newMovie = this.movieRepository.create(movie);
    return this.movieRepository.save(newMovie);
  }

  async findAll(): Promise<Movie[]> {
    return this.movieRepository.find();
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({ where: { id } });
    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }
    return movie;
  }

  async update(movie: MovieDto, id: number): Promise<Movie> {
    const existingMovie = await this.findOne(id);
    const updatedMovie = { ...existingMovie, ...movie };
    return this.movieRepository.save(updatedMovie);
  }

  async remove(id: number): Promise<void> {
    const result = await this.movieRepository.delete(id);
    if (result?.affected === 0) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }
  }
}
