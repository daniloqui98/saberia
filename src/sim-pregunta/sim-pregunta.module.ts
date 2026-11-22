import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimPreguntaService } from './sim-pregunta.service.js';
import { SimPreguntaController } from './sim-pregunta.controller.js';
import { SimPregunta } from './entities/sim-pregunta.entity.js';
import { SimulacroModule } from '../simulacro/simulacro.module.js';
import { PreguntaModule } from '../pregunta/pregunta.module.js';

@Module({
  // Importar el repositorio de SimPregunta y los módulos de Simulacro y Pregunta (para validar las FK)
  imports: [TypeOrmModule.forFeature([SimPregunta]), SimulacroModule, PreguntaModule],
  controllers: [SimPreguntaController],
  providers: [SimPreguntaService],
  // Exportar el servicio para usarlo después en Respuesta de simulacro
  exports: [SimPreguntaService],
})
export class SimPreguntaModule {}
