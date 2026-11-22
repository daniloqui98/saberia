import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvidenciaService } from './evidencia.service.js';
import { EvidenciaController } from './evidencia.controller.js';
import { Evidencia } from './entities/evidencia.entity.js';
import { AfirmacionModule } from '../afirmacion/afirmacion.module.js';

@Module({
  // Importar el repositorio de Evidencia y el módulo de Afirmación (para validar la FK)
  imports: [TypeOrmModule.forFeature([Evidencia]), AfirmacionModule],
  controllers: [EvidenciaController],
  providers: [EvidenciaService],
  // Exportar el servicio para usarlo después en Pregunta (FK a Evidencia)
  exports: [EvidenciaService],
})
export class EvidenciaModule {}
