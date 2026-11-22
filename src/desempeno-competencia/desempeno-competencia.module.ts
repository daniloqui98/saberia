import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DesempenoCompetenciaService } from './desempeno-competencia.service.js';
import { DesempenoCompetenciaController } from './desempeno-competencia.controller.js';
import { DesempenoCompetencia } from './entities/desempeno-competencia.entity.js';
import { SesionSimModule } from '../sesion-sim/sesion-sim.module.js';
import { SimPreguntaModule } from '../sim-pregunta/sim-pregunta.module.js';
import { RespuestaSimModule } from '../respuesta-sim/respuesta-sim.module.js';

@Module({
  // Importar el repositorio y los módulos de los que se calcula el desempeño
  imports: [
    TypeOrmModule.forFeature([DesempenoCompetencia]),
    SesionSimModule,
    SimPreguntaModule,
    RespuestaSimModule,
  ],
  controllers: [DesempenoCompetenciaController],
  providers: [DesempenoCompetenciaService],
  // Exportar el servicio para Retroalimentación
  exports: [DesempenoCompetenciaService],
})
export class DesempenoCompetenciaModule {}
