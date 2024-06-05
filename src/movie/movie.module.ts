import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { Movie } from 'src/model/entities/movie';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { JwtService } from '@nestjs/jwt';
import { SwapiModule } from 'src/third-party/swapi.module';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), UserModule, SwapiModule],
  controllers: [MovieController],
  providers: [MovieService, JwtService],
  exports: [MovieService],
})
export class MovieModule {}
