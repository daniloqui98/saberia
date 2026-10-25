import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramaService } from './programa.service.js';
import { ProgramaController } from './programa.controller.js';
import { Programa } from './entities/programa.entity.js';
import { FacultadModule } from '../facultad/facultad.module.js';

@Module({
  // Importar el repositorio de Programa y el módulo de Facultad (para validar la FK)
  imports: [TypeOrmModule.forFeature([Programa]), FacultadModule],
  controllers: [ProgramaController],
  providers: [ProgramaService],
  // Exportar el servicio para usarlo después en Usuario y Grupo (FK a Programa)
  exports: [ProgramaService],
})
export class ProgramaModule {}
