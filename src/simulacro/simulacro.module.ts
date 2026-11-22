import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimulacroService } from './simulacro.service.js';
import { SimulacroController } from './simulacro.controller.js';
import { Simulacro } from './entities/simulacro.entity.js';
import { UserModule } from '../user/user.module.js';
import { ModuloModule } from '../modulo/modulo.module.js';

@Module({
  // Importar el repositorio de Simulacro y los módulos de Usuario y Módulo (para validar las FK)
  imports: [TypeOrmModule.forFeature([Simulacro]), UserModule, ModuloModule],
  controllers: [SimulacroController],
  providers: [SimulacroService],
  // Exportar el servicio para Sim_Pregunta, Asignación y Sesión
  exports: [SimulacroService],
})
export class SimulacroModule {}
