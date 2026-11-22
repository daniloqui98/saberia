import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsigniaEstudianteService } from './insignia-estudiante.service.js';
import { InsigniaEstudianteController } from './insignia-estudiante.controller.js';
import { InsigniaEstudiante } from './entities/insignia-estudiante.entity.js';
import { PerfilEstudianteModule } from '../perfil-estudiante/perfil-estudiante.module.js';
import { CatalogoInsigniaModule } from '../catalogo-insignia/catalogo-insignia.module.js';
import { TransaccionPuntosModule } from '../transaccion-puntos/transaccion-puntos.module.js';

@Module({
  // Importar el repositorio, los módulos de sus FK y el de puntos
  imports: [
    TypeOrmModule.forFeature([InsigniaEstudiante]),
    PerfilEstudianteModule,
    CatalogoInsigniaModule,
    TransaccionPuntosModule,
  ],
  controllers: [InsigniaEstudianteController],
  providers: [InsigniaEstudianteService],
  exports: [InsigniaEstudianteService],
})
export class InsigniaEstudianteModule {}
