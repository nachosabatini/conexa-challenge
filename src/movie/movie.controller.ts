import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieDto } from '../model/dto/movie.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/config/role.enum';
import { Roles } from 'src/utils/decorator/roles.decorator';
import { RolesGuard } from 'src/utils/Guards/roles.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Movie } from 'src/model/entities/movie';

@ApiTags('movie')
@Controller('movie')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  /**
   * Retrieve all movies.
   * @returns A list of movies.
   */
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retrieve all movies',
    type: [Movie],
  })
  async findAll() {
    return this.movieService.findAll();
  }

  /**
   * Create a new movie.
   * @param movie - The details of the movie to create.
   * @returns The created movie.
   */
  @Post()
  @Roles(Role.Admin)
  @ApiResponse({ status: 201, description: 'Create a new movie', type: Movie })
  async create(@Body() movie: MovieDto) {
    return this.movieService.create(movie);
  }

  /**
   * Retrieve a movie by ID.
   * @param id - The ID of the movie to retrieve.
   * @returns The movie with the specified ID.
   */
  @Get('/:id')
  @Roles(Role.User)
  @ApiResponse({
    status: 200,
    description: 'Retrieve a movie by ID',
    type: Movie,
  })
  async findOne(@Param('id') id: number) {
    return this.movieService.findOne(id);
  }

  /**
   * Update a movie.
   * @param id - The ID of the movie to update.
   * @param movie - The updated movie details.
   * @returns The updated movie.
   */
  @Put('/:id')
  @Roles(Role.Admin)
  @ApiResponse({ status: 200, description: 'Update a movie', type: Movie })
  async update(@Param('id') id: number, @Body() movie: MovieDto) {
    return this.movieService.update(movie, id);
  }

  /**
   * Delete a movie by ID.
   * @param id - The ID of the movie to delete.
   * @returns A message indicating the result of the deletion.
   */
  @Delete('/:id')
  @Roles(Role.Admin)
  @ApiResponse({ status: 200, description: 'Delete a movie by ID' })
  async remove(@Param('id') id: number) {
    return this.movieService.remove(id);
  }
}
