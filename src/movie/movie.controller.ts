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
import { Roles } from 'src/decorator/roles.decorator';
import { RolesGuard } from 'src/Guards/roles.guard';

@Controller('movie')
@UseGuards(AuthGuard, RolesGuard)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  async findAll() {
    return this.movieService.findAll();
  }

  @Post()
  @Roles(Role.Admin)
  async create(@Body() movie: MovieDto) {
    return this.movieService.create(movie);
  }

  @Get('/:id')
  @Roles(Role.User)
  async findOne(@Param('id') id: number) {
    return this.movieService.findOne(id);
  }

  @Put('/:id')
  @Roles(Role.Admin)
  async update(@Param('id') id: number, @Body() movie: MovieDto) {
    return this.movieService.update(movie, id);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  async remove(@Param('id') id: number) {
    return this.movieService.remove(id);
  }
}
