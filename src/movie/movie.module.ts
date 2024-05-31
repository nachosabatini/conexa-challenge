import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { Movie } from 'src/model/entities/movie';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { JwtService } from '@nestjs/jwt';
import { SwapiService } from 'src/third-party/swapi.service';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), UserModule],
  controllers: [MovieController],
  providers: [MovieService, JwtService, SwapiService],
  exports: [MovieService],
})
export class MovieModule {}
