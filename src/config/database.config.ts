import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: configService.get<string>('DATABASE_URI'),
  synchronize: configService.get<string>('NODE_ENV') === 'development',
  ssl: configService.get<string>('NODE_ENV') !== 'development', // No uses synchronize en producción
});
