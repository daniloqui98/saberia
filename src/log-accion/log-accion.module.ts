import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogAccionService } from './log-accion.service.js';
import { LogAccionController } from './log-accion.controller.js';
import { LogAccion } from './entities/log-accion.entity.js';
import { UserModule } from '../user/user.module.js';

@Module({
  // Importar el repositorio de LogAccion y el módulo de Usuario (para validar la FK)
  imports: [TypeOrmModule.forFeature([LogAccion]), UserModule],
  controllers: [LogAccionController],
  providers: [LogAccionService],
  // Exportar el servicio para registrar acciones desde otros módulos
  exports: [LogAccionService],
})
export class LogAccionModule {}
