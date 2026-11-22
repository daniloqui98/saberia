import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CanjeRecompensaService } from './canje-recompensa.service.js';
import { CanjeRecompensaController } from './canje-recompensa.controller.js';
import { CanjeRecompensa } from './entities/canje-recompensa.entity.js';
import { PerfilEstudianteModule } from '../perfil-estudiante/perfil-estudiante.module.js';
import { CatalogoRecompensaModule } from '../catalogo-recompensa/catalogo-recompensa.module.js';
import { TransaccionPuntosModule } from '../transaccion-puntos/transaccion-puntos.module.js';

@Module({
  // Importar el repositorio, los módulos de sus FK y el de puntos
  imports: [
    TypeOrmModule.forFeature([CanjeRecompensa]),
    PerfilEstudianteModule,
    CatalogoRecompensaModule,
    TransaccionPuntosModule,
  ],
  controllers: [CanjeRecompensaController],
  providers: [CanjeRecompensaService],
  exports: [CanjeRecompensaService],
})
export class CanjeRecompensaModule {}
