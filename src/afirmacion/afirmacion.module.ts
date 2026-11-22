import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AfirmacionService } from './afirmacion.service.js';
import { AfirmacionController } from './afirmacion.controller.js';
import { Afirmacion } from './entities/afirmacion.entity.js';
import { CompetenciaModule } from '../competencia/competencia.module.js';

@Module({
  // Importar el repositorio de Afirmacion y el módulo de Competencia (para validar la FK)
  imports: [TypeOrmModule.forFeature([Afirmacion]), CompetenciaModule],
  controllers: [AfirmacionController],
  providers: [AfirmacionService],
  // Exportar el servicio para usarlo después en Evidencia (FK a Afirmación)
  exports: [AfirmacionService],
})
export class AfirmacionModule {}
