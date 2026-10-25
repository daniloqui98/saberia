import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrupoService } from './grupo.service.js';
import { GrupoController } from './grupo.controller.js';
import { Grupo } from './entities/grupo.entity.js';
import { PerfilDocenteModule } from '../perfil-docente/perfil-docente.module.js';
import { ProgramaModule } from '../programa/programa.module.js';
import { PeriodoAcademicoModule } from '../periodo-academico/periodo-academico.module.js';

@Module({
  // Importar el repositorio de Grupo y los módulos de sus 3 llaves foráneas
  imports: [
    TypeOrmModule.forFeature([Grupo]),
    PerfilDocenteModule,
    ProgramaModule,
    PeriodoAcademicoModule,
  ],
  controllers: [GrupoController],
  providers: [GrupoService],
  // Exportar el servicio para Perfil estudiante, Asignación y Reporte de grupo
  exports: [GrupoService],
})
export class GrupoModule {}
