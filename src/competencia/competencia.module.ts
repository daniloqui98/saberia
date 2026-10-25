import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetenciaService } from './competencia.service.js';
import { CompetenciaController } from './competencia.controller.js';
import { Competencia } from './entities/competencia.entity.js';
import { ModuloModule } from '../modulo/modulo.module.js';

@Module({
  // Importar el repositorio de Competencia y el módulo de Modulo (para validar la FK)
  imports: [TypeOrmModule.forFeature([Competencia]), ModuloModule],
  controllers: [CompetenciaController],
  providers: [CompetenciaService],
  // Exportar el servicio para usarlo después en Afirmacion, Recurso_Apoyo y Desempeno
  exports: [CompetenciaService],
})
export class CompetenciaModule {}
