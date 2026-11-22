import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransaccionPuntosService } from './transaccion-puntos.service.js';
import { TransaccionPuntosController } from './transaccion-puntos.controller.js';
import { TransaccionPuntos } from './entities/transaccion-puntos.entity.js';
import { PerfilEstudianteModule } from '../perfil-estudiante/perfil-estudiante.module.js';
import { SesionSimModule } from '../sesion-sim/sesion-sim.module.js';

@Module({
  // Importar el repositorio y los módulos de Perfil (FK y saldo) y Sesión (origen)
  imports: [
    TypeOrmModule.forFeature([TransaccionPuntos]),
    PerfilEstudianteModule,
    SesionSimModule,
  ],
  controllers: [TransaccionPuntosController],
  providers: [TransaccionPuntosService],
  // Exportar el servicio para Insignia estudiante y Canje de recompensa
  exports: [TransaccionPuntosService],
})
export class TransaccionPuntosModule {}
