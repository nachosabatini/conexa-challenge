import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/movie.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/config/role.enum';
import { Roles } from 'src/decorator/roles.decorator';
import { RolesGuard } from 'src/Guards/roles.guard';

@Controller('movie')
@UseGuards(AuthGuard)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  // @Roles(Role.ADMIN)
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Post('create')
  // async create(@Body() createMovieDto: CreateMovieDto) {
  //     return this.movieService.create(createMovieDto);
  // }

  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Get()
  async findAll() {
    return this.movieService.findAll();
  }

  @Post()
  async create(@Body() movie: CreateMovieDto) {
    return this.movieService.create(movie);
  }
}
