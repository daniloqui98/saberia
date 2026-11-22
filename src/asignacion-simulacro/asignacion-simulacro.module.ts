import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignacionSimulacroService } from './asignacion-simulacro.service.js';
import { AsignacionSimulacroController } from './asignacion-simulacro.controller.js';
import { AsignacionSimulacro } from './entities/asignacion-simulacro.entity.js';
import { GrupoModule } from '../grupo/grupo.module.js';
import { SimulacroModule } from '../simulacro/simulacro.module.js';

@Module({
  // Importar el repositorio y los módulos de Grupo y Simulacro (para validar las FK)
  imports: [
    TypeOrmModule.forFeature([AsignacionSimulacro]),
    GrupoModule,
    SimulacroModule,
  ],
  controllers: [AsignacionSimulacroController],
  providers: [AsignacionSimulacroService],
  // Exportar el servicio para Sesión de simulacro y Reporte de grupo
  exports: [AsignacionSimulacroService],
})
export class AsignacionSimulacroModule {}
