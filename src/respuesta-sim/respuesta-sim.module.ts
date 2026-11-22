import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RespuestaSimService } from './respuesta-sim.service.js';
import { RespuestaSimController } from './respuesta-sim.controller.js';
import { RespuestaSim } from './entities/respuesta-sim.entity.js';
import { SesionSimModule } from '../sesion-sim/sesion-sim.module.js';
import { SimPreguntaModule } from '../sim-pregunta/sim-pregunta.module.js';
import { OpcionModule } from '../opcion/opcion.module.js';

@Module({
  // Importar el repositorio y los módulos de sus 3 llaves foráneas
  imports: [
    TypeOrmModule.forFeature([RespuestaSim]),
    SesionSimModule,
    SimPreguntaModule,
    OpcionModule,
  ],
  controllers: [RespuestaSimController],
  providers: [RespuestaSimService],
  // Exportar el servicio para Desempeño por competencia
  exports: [RespuestaSimService],
})
export class RespuestaSimModule {}
