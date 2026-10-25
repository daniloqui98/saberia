import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { User } from './entities/user.entity.js';
import { ProgramaModule } from '../programa/programa.module.js';
import { RolModule } from '../rol/rol.module.js';

@Module({
  // Importar el repositorio de User y los módulos de Programa y Rol (para validar las FK)
  imports: [TypeOrmModule.forFeature([User]), ProgramaModule, RolModule],
  controllers: [UserController],
  providers: [UserService],
  // Exportar el servicio para usarlo en otros módulos (como Auth)
  exports: [UserService],
})
export class UserModule {}