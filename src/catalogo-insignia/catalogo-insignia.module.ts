import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogoInsigniaService } from './catalogo-insignia.service.js';
import { CatalogoInsigniaController } from './catalogo-insignia.controller.js';
import { CatalogoInsignia } from './entities/catalogo-insignia.entity.js';

@Module({
  // Importar el repositorio de CatalogoInsignia
  imports: [TypeOrmModule.forFeature([CatalogoInsignia])],
  controllers: [CatalogoInsigniaController],
  providers: [CatalogoInsigniaService],
  // Exportar el servicio para usarlo después en Insignia_Estudiante (FK a Insignia)
  exports: [CatalogoInsigniaService],
})
export class CatalogoInsigniaModule {}
