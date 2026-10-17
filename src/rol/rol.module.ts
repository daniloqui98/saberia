import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolService } from './rol.service.js';
import { RolController } from './rol.controller.js';
import { Rol } from './entities/rol.entity.js';

@Module({
  // Importar el repositorio de Rol
  imports: [TypeOrmModule.forFeature([Rol])],
  controllers: [RolController],
  providers: [RolService],
  // Exportar el servicio para usarlo después en Usuario_Rol (que tiene FK a Rol)
  exports: [RolService],
})
export class RolModule {}
