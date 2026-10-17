import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeriodoAcademicoService } from './periodo-academico.service.js';
import { PeriodoAcademicoController } from './periodo-academico.controller.js';
import { PeriodoAcademico } from './entities/periodo-academico.entity.js';

@Module({
  // Importar el repositorio de PeriodoAcademico
  imports: [TypeOrmModule.forFeature([PeriodoAcademico])],
  controllers: [PeriodoAcademicoController],
  providers: [PeriodoAcademicoService],
  // Exportar el servicio para usarlo después en Grupo (que tiene FK a Periodo)
  exports: [PeriodoAcademicoService],
})
export class PeriodoAcademicoModule {}
