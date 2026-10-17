import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuloService } from './modulo.service.js';
import { ModuloController } from './modulo.controller.js';
import { Modulo } from './entities/modulo.entity.js';

@Module({
  // Importar el repositorio de Modulo
  imports: [TypeOrmModule.forFeature([Modulo])],
  controllers: [ModuloController],
  providers: [ModuloService],
  // Exportar el servicio para usarlo después en Competencia y Simulacro (FK a Modulo)
  exports: [ModuloService],
})
export class ModuloModule {}
