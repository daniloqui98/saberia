import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';
import { FacultadModule } from './facultad/facultad.module.js';
import { RolModule } from './rol/rol.module.js';
import { PeriodoAcademicoModule } from './periodo-academico/periodo-academico.module.js';
import { ModuloModule } from './modulo/modulo.module.js';
import { CatalogoInsigniaModule } from './catalogo-insignia/catalogo-insignia.module.js';
import { CatalogoRecompensaModule } from './catalogo-recompensa/catalogo-recompensa.module.js';
import { ProgramaModule } from './programa/programa.module.js';
import { CompetenciaModule } from './competencia/competencia.module.js';
import { LogAccionModule } from './log-accion/log-accion.module.js';
import { PerfilDocenteModule } from './perfil-docente/perfil-docente.module.js';
import { PerfilEstudianteModule } from './perfil-estudiante/perfil-estudiante.module.js';
import { GrupoModule } from './grupo/grupo.module.js';
import { AfirmacionModule } from './afirmacion/afirmacion.module.js';
import { EvidenciaModule } from './evidencia/evidencia.module.js';
import { PreguntaModule } from './pregunta/pregunta.module.js';
import { OpcionModule } from './opcion/opcion.module.js';
import { SimulacroModule } from './simulacro/simulacro.module.js';
import { SimPreguntaModule } from './sim-pregunta/sim-pregunta.module.js';
import { AsignacionSimulacroModule } from './asignacion-simulacro/asignacion-simulacro.module.js';
import { SesionSimModule } from './sesion-sim/sesion-sim.module.js';
import { RespuestaSimModule } from './respuesta-sim/respuesta-sim.module.js';
import { DesempenoCompetenciaModule } from './desempeno-competencia/desempeno-competencia.module.js';
import { RecursoApoyoModule } from './recurso-apoyo/recurso-apoyo.module.js';
import { RetroalimentacionModule } from './retroalimentacion/retroalimentacion.module.js';
import { ReporteGrupoModule } from './reporte-grupo/reporte-grupo.module.js';
import { TransaccionPuntosModule } from './transaccion-puntos/transaccion-puntos.module.js';
import { InsigniaEstudianteModule } from './insignia-estudiante/insignia-estudiante.module.js';
import { CanjeRecompensaModule } from './canje-recompensa/canje-recompensa.module.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { ExampleController } from './example/example.controller.js';


const __filename = fileURLToPath(import.meta.url);
const _dirname = dirname(__filename);


export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [ // Configuración de variables de entorno
    // isGlobal: true hace que ConfigModule esté disponible en toda la app
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configuración de TypeORM con MySQL
    // useFactory permite inyectar ConfigService para leer variables de entorno
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [_dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // ⚠️ Solo en desarrollo
      }),
      inject: [ConfigService],
    }),
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'saberia',
    }),
    UserModule,
    AuthModule,
    FacultadModule,
    RolModule,
    PeriodoAcademicoModule,
    ModuloModule,
    CatalogoInsigniaModule,
    CatalogoRecompensaModule,
    ProgramaModule,
    CompetenciaModule,
    LogAccionModule,
    PerfilDocenteModule,
    PerfilEstudianteModule,
    GrupoModule,
    AfirmacionModule,
    EvidenciaModule,
    PreguntaModule,
    OpcionModule,
    SimulacroModule,
    SimPreguntaModule,
    AsignacionSimulacroModule,
    SesionSimModule,
    RespuestaSimModule,
    DesempenoCompetenciaModule,
    RecursoApoyoModule,
    RetroalimentacionModule,
    ReporteGrupoModule,
    TransaccionPuntosModule,
    InsigniaEstudianteModule,
    CanjeRecompensaModule,
  ],
  
  controllers: [AppController, ExampleController],
  providers: [AppService],
})

export class AppModule {}
