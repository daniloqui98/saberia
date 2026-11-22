import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecursoApoyoService } from './recurso-apoyo.service.js';
import { RecursoApoyoController } from './recurso-apoyo.controller.js';
import { RecursoApoyo } from './entities/recurso-apoyo.entity.js';
import { CompetenciaModule } from '../competencia/competencia.module.js';

@Module({
  // Importar el repositorio de RecursoApoyo y el módulo de Competencia (para validar la FK)
  imports: [TypeOrmModule.forFeature([RecursoApoyo]), CompetenciaModule],
  controllers: [RecursoApoyoController],
  providers: [RecursoApoyoService],
  // Exportar el servicio para usarlo después en Retroalimentación
  exports: [RecursoApoyoService],
})
export class RecursoApoyoModule {}
