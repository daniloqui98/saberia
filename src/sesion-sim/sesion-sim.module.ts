import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SesionSimService } from './sesion-sim.service.js';
import { SesionSimController } from './sesion-sim.controller.js';
import { SesionSim } from './entities/sesion-sim.entity.js';
import { PerfilEstudianteModule } from '../perfil-estudiante/perfil-estudiante.module.js';
import { SimulacroModule } from '../simulacro/simulacro.module.js';
import { AsignacionSimulacroModule } from '../asignacion-simulacro/asignacion-simulacro.module.js';

@Module({
  // Importar el repositorio y los módulos de sus 3 llaves foráneas
  imports: [
    TypeOrmModule.forFeature([SesionSim]),
    PerfilEstudianteModule,
    SimulacroModule,
    AsignacionSimulacroModule,
  ],
  controllers: [SesionSimController],
  providers: [SesionSimService],
  // Exportar el servicio para Respuesta de simulacro y Desempeño
  exports: [SesionSimService],
})
export class SesionSimModule {}
