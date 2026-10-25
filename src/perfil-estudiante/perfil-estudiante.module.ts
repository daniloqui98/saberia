import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfilEstudianteService } from './perfil-estudiante.service.js';
import { PerfilEstudianteController } from './perfil-estudiante.controller.js';
import { PerfilEstudiante } from './entities/perfil-estudiante.entity.js';
import { UserModule } from '../user/user.module.js';
import { GrupoModule } from '../grupo/grupo.module.js';

@Module({
  // Importar el repositorio de PerfilEstudiante y los módulos de Usuario y Grupo (para validar las FK)
  imports: [TypeOrmModule.forFeature([PerfilEstudiante]), UserModule, GrupoModule],
  controllers: [PerfilEstudianteController],
  providers: [PerfilEstudianteService],
  // Exportar el servicio para Sesión, Insignias, Puntos y Canjes
  exports: [PerfilEstudianteService],
})
export class PerfilEstudianteModule {}
