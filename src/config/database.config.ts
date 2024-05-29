import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Movie } from 'src/model/entities/movie';
import { User } from 'src/model/entities/user';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: configService.get<string>('DATABASE_URI'),
  synchronize: configService.get<string>('NODE_ENV') === 'development',
  ssl: configService.get<string>('NODE_ENV') !== 'development',
  entities: [Movie, User],
});
