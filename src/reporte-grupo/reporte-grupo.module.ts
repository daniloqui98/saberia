import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReporteGrupoService } from './reporte-grupo.service.js';
import { ReporteGrupoController } from './reporte-grupo.controller.js';
import { ReporteGrupo } from './entities/reporte-grupo.entity.js';
import { AsignacionSimulacroModule } from '../asignacion-simulacro/asignacion-simulacro.module.js';
import { SesionSimModule } from '../sesion-sim/sesion-sim.module.js';
import { PerfilEstudianteModule } from '../perfil-estudiante/perfil-estudiante.module.js';

@Module({
  // Importar el repositorio y los módulos de los que se calcula el reporte
  imports: [
    TypeOrmModule.forFeature([ReporteGrupo]),
    AsignacionSimulacroModule,
    SesionSimModule,
    PerfilEstudianteModule,
  ],
  controllers: [ReporteGrupoController],
  providers: [ReporteGrupoService],
  exports: [ReporteGrupoService],
})
export class ReporteGrupoModule {}
