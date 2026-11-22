import { NestFactory } from '@nestjs/core';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { QueryFailedFilter } from './common/filters/query-failed.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar ValidationPipe globalmente
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Aplicar @Exclude() en las respuestas HTTP
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  // Convertir choques de concurrencia en la base de datos (duplicados) en 409
  app.useGlobalFilters(new QueryFailedFilter());

  // Habilitar CORS
  app.enableCors();

  await app.listen(3000);
  console.log('🚀 Servidor corriendo en http://localhost:3000');
}

bootstrap();