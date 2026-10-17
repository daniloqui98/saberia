import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacultadService } from './facultad.service.js';
import { FacultadController } from './facultad.controller.js';
import { Facultad } from './entities/facultad.entity.js';

@Module({
  // Importar el repositorio de Facultad
  imports: [TypeOrmModule.forFeature([Facultad])],
  controllers: [FacultadController],
  providers: [FacultadService],
  // Exportar el servicio para usarlo después en Programa (que tiene FK a Facultad)
  exports: [FacultadService],
})
export class FacultadModule {}
