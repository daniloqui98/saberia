import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreguntaService } from './pregunta.service.js';
import { PreguntaController } from './pregunta.controller.js';
import { Pregunta } from './entities/pregunta.entity.js';
import { EvidenciaModule } from '../evidencia/evidencia.module.js';
import { UserModule } from '../user/user.module.js';

@Module({
  // Importar el repositorio de Pregunta y los módulos de Evidencia y Usuario (para validar las FK)
  imports: [TypeOrmModule.forFeature([Pregunta]), EvidenciaModule, UserModule],
  controllers: [PreguntaController],
  providers: [PreguntaService],
  // Exportar el servicio para Opción y Sim_Pregunta (FK a Pregunta)
  exports: [PreguntaService],
})
export class PreguntaModule {}
