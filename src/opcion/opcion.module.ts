import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpcionService } from './opcion.service.js';
import { OpcionController } from './opcion.controller.js';
import { Opcion } from './entities/opcion.entity.js';
import { PreguntaModule } from '../pregunta/pregunta.module.js';

@Module({
  // Importar el repositorio de Opcion y el módulo de Pregunta (para validar la FK)
  imports: [TypeOrmModule.forFeature([Opcion]), PreguntaModule],
  controllers: [OpcionController],
  providers: [OpcionService],
  // Exportar el servicio para usarlo después en Respuesta de simulacro
  exports: [OpcionService],
})
export class OpcionModule {}
