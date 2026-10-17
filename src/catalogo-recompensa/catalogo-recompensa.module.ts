import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogoRecompensaService } from './catalogo-recompensa.service.js';
import { CatalogoRecompensaController } from './catalogo-recompensa.controller.js';
import { CatalogoRecompensa } from './entities/catalogo-recompensa.entity.js';

@Module({
  // Importar el repositorio de CatalogoRecompensa
  imports: [TypeOrmModule.forFeature([CatalogoRecompensa])],
  controllers: [CatalogoRecompensaController],
  providers: [CatalogoRecompensaService],
  // Exportar el servicio para usarlo después en Canje_Recompensa (FK a Recompensa)
  exports: [CatalogoRecompensaService],
})
export class CatalogoRecompensaModule {}
