import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfilDocenteService } from './perfil-docente.service.js';
import { PerfilDocenteController } from './perfil-docente.controller.js';
import { PerfilDocente } from './entities/perfil-docente.entity.js';
import { UserModule } from '../user/user.module.js';

@Module({
  // Importar el repositorio de PerfilDocente y el módulo de Usuario (para validar la FK)
  imports: [TypeOrmModule.forFeature([PerfilDocente]), UserModule],
  controllers: [PerfilDocenteController],
  providers: [PerfilDocenteService],
  // Exportar el servicio para usarlo después en Grupo (FK a Perfil docente)
  exports: [PerfilDocenteService],
})
export class PerfilDocenteModule {}
