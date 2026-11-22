import {
  Injectable,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, QueryFailedError, Repository } from 'typeorm';

import { SesionSim } from './entities/sesion-sim.entity.js';
import { CreateSesionSimDto } from './dto/create-sesion-sim.dto.js';
import { UpdateSesionSimDto } from './dto/update-sesion-sim.dto.js';
import { PerfilEstudianteService } from '../perfil-estudiante/perfil-estudiante.service.js';
import { SimulacroService } from '../simulacro/simulacro.service.js';
import { AsignacionSimulacroService } from '../asignacion-simulacro/asignacion-simulacro.service.js';
import { User } from '../user/entities/user.entity.js';

@Injectable()
export class SesionSimService {
  constructor(
    @InjectRepository(SesionSim)
    private readonly sesionRepository: Repository<SesionSim>,
    // Servicios para validar que las 3 llaves foráneas existan
    private readonly perfilService: PerfilEstudianteService,
    private readonly simulacroService: SimulacroService,
    private readonly asignacionService: AsignacionSimulacroService,
  ) {}

  /**
   * Iniciar un intento de simulacro
   * usuarioActual: quien hace la petición (un estudiante solo inicia los suyos)
   */
  async create(
    createDto: CreateSesionSimDto,
    usuarioActual: User,
  ): Promise<SesionSim> {
    // Lanzan 404 si el perfil o el simulacro no existen
    const perfil = await this.perfilService.findOne(createDto.id_perfil);
    const simulacro = await this.simulacroService.findOne(
      createDto.id_simulacro,
    );

    this.validarDueno(perfil.id_usuario, usuarioActual);

    if (!simulacro.estado || simulacro.total_preguntas === 0) {
      throw new BadRequestException(
        `El simulacro con ID ${simulacro.id_simulacro} no está disponible`,
      );
    }

    // No se puede tener dos intentos abiertos del mismo simulacro
    const enCurso = await this.sesionRepository.findOne({
      where: {
        id_perfil: createDto.id_perfil,
        id_simulacro: createDto.id_simulacro,
        estado: 'En curso',
      },
    });

    if (enCurso) {
      throw new ConflictException(
        `El estudiante ya tiene un intento en curso de este simulacro (sesión ${enCurso.id_sesion})`,
      );
    }

    let asignacion: SesionSim['asignacion'] = null;

    if (createDto.id_asignacion) {
      // Intento asignado: debe cumplir las reglas de la asignación
      asignacion = await this.asignacionService.findOne(
        createDto.id_asignacion,
      );
      const ahora = new Date();

      if (asignacion.id_simulacro !== createDto.id_simulacro) {
        throw new BadRequestException(
          'La asignación no corresponde a ese simulacro',
        );
      }
      if (perfil.id_grupo !== asignacion.id_grupo) {
        throw new BadRequestException(
          'El estudiante no pertenece al grupo de esta asignación',
        );
      }
      if (!asignacion.estado) {
        throw new BadRequestException('La asignación está deshabilitada');
      }
      if (ahora < asignacion.fecha_apertura || ahora > asignacion.fecha_cierre) {
        throw new BadRequestException(
          'La asignación no está abierta en este momento',
        );
      }
    } else if (simulacro.visibilidad !== 'Publico') {
      // Intento libre: solo con simulacros públicos
      throw new BadRequestException(
        'Solo los simulacros públicos se pueden presentar sin asignación',
      );
    }

    // intento_num = intentos anteriores + 1 (por asignación, o libres del simulacro)
    const intentosPrevios = await this.sesionRepository.count({
      where: {
        id_perfil: createDto.id_perfil,
        id_simulacro: createDto.id_simulacro,
        id_asignacion: asignacion ? asignacion.id_asignacion : IsNull(),
      },
    });

    if (asignacion && intentosPrevios >= asignacion.intentos_max) {
      throw new ConflictException(
        `El estudiante ya usó sus ${asignacion.intentos_max} intento(s) de esta asignación`,
      );
    }

    const sesion = this.sesionRepository.create({
      id_perfil: createDto.id_perfil,
      id_simulacro: createDto.id_simulacro,
      id_asignacion: asignacion ? asignacion.id_asignacion : null,
      perfil,
      simulacro,
      asignacion,
      intento_num: intentosPrevios + 1,
      fecha_inicio: new Date(),
      estado: 'En curso',
    });

    return await this.sesionRepository.save(sesion);
  }

  /**
   * Obtener todas las sesiones (las más recientes primero)
   */
  async findAll(): Promise<SesionSim[]> {
    return await this.sesionRepository.find({
      relations: { perfil: true, simulacro: true, asignacion: true },
      order: { fecha_inicio: 'DESC' },
    });
  }

  /**
   * Obtener los intentos de un estudiante
   */
  async findByPerfil(idPerfil: number): Promise<SesionSim[]> {
    // Lanza 404 si el perfil no existe
    await this.perfilService.findOne(idPerfil);

    return await this.sesionRepository.find({
      where: { id_perfil: idPerfil },
      relations: { simulacro: true },
      order: { fecha_inicio: 'DESC' },
    });
  }

  /**
   * Intentos finalizados de una asignación (los usa Reporte de grupo)
   */
  async findFinalizadasByAsignacion(idAsignacion: number): Promise<SesionSim[]> {
    return await this.sesionRepository.find({
      where: { id_asignacion: idAsignacion, estado: 'Finalizado' },
    });
  }

  /**
   * Obtener una sesión por ID
   */
  async findOne(id: number): Promise<SesionSim> {
    const sesion = await this.sesionRepository.findOne({
      where: { id_sesion: id },
      relations: { perfil: true, simulacro: true, asignacion: true },
    });

    if (!sesion) {
      throw new NotFoundException(`Sesión con ID ${id} no encontrada`);
    }

    return sesion;
  }

  /**
   * Terminar un intento (Finalizado o Abandonado)
   */
  async update(
    id: number,
    updateDto: UpdateSesionSimDto,
    usuarioActual: User,
  ): Promise<SesionSim> {
    const sesion = await this.findOne(id);

    this.validarDueno(sesion.perfil.id_usuario, usuarioActual);

    // Solo se puede terminar un intento que sigue en curso
    if (sesion.estado !== 'En curso') {
      throw new BadRequestException(
        `La sesión ya está ${sesion.estado} y no se puede modificar`,
      );
    }

    const fechaFin = new Date();

    sesion.estado = updateDto.estado;
    sesion.fecha_fin = fechaFin;
    // Regla del diccionario: fecha_inicio <= fecha_fin
    sesion.tiempo_total_seg = Math.max(
      0,
      Math.round((fechaFin.getTime() - sesion.fecha_inicio.getTime()) / 1000),
    );

    return await this.sesionRepository.save(sesion);
  }

  /**
   * Guardar el puntaje total de la sesión
   * Lo llama Respuesta de simulacro cada vez que cambia una respuesta
   */
  async actualizarPuntaje(id: number, puntaje: number): Promise<void> {
    await this.sesionRepository.update(
      { id_sesion: id },
      { puntaje_total: puntaje },
    );
  }

  /**
   * Eliminar una sesión
   */
  async remove(id: number): Promise<void> {
    const sesion = await this.findOne(id);

    try {
      await this.sesionRepository.remove(sesion);
    } catch (error) {
      // 1451 = ER_ROW_IS_REFERENCED_2: hay respuestas o desempeños de esta sesión
      if (error instanceof QueryFailedError && error.driverError?.errno === 1451) {
        throw new ConflictException(
          'No se puede eliminar la sesión porque tiene registros asociados',
        );
      }
      throw error;
    }
  }

  /**
   * Un estudiante solo puede manejar sus propios intentos (y sus respuestas)
   */
  validarDueno(idUsuarioPerfil: number, usuarioActual: User): void {
    if (
      usuarioActual.rol.nombre === 'ESTUDIANTE' &&
      usuarioActual.id_usuario !== idUsuarioPerfil
    ) {
      throw new ForbiddenException(
        'Un estudiante solo puede manejar sus propios intentos',
      );
    }
  }
}
