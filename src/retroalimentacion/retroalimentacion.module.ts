import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RetroalimentacionService } from './retroalimentacion.service.js';
import { RetroalimentacionController } from './retroalimentacion.controller.js';
import { Retroalimentacion } from './entities/retroalimentacion.entity.js';
import { DesempenoCompetenciaModule } from '../desempeno-competencia/desempeno-competencia.module.js';
import { RecursoApoyoModule } from '../recurso-apoyo/recurso-apoyo.module.js';

@Module({
  // Importar el repositorio y los módulos de Desempeño y Recurso (para validar las FK)
  imports: [
    TypeOrmModule.forFeature([Retroalimentacion]),
    DesempenoCompetenciaModule,
    RecursoApoyoModule,
  ],
  controllers: [RetroalimentacionController],
  providers: [RetroalimentacionService],
  exports: [RetroalimentacionService],
})
export class RetroalimentacionModule {}
