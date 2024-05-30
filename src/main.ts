import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TypeValidationPipe } from './utils/pipes/typePipeValidation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Conexa Coding Challenge')
    .setDescription('API for Conexa Coding Challenge')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new TypeValidationPipe());

  await app.listen(configService.get('PORT'));
}
bootstrap();
