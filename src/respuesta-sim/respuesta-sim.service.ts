import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RespuestaSim } from './entities/respuesta-sim.entity.js';
import { CreateRespuestaSimDto } from './dto/create-respuesta-sim.dto.js';
import { UpdateRespuestaSimDto } from './dto/update-respuesta-sim.dto.js';
import { SesionSimService } from '../sesion-sim/sesion-sim.service.js';
import { SimPreguntaService } from '../sim-pregunta/sim-pregunta.service.js';
import { OpcionService } from '../opcion/opcion.service.js';
import { SesionSim } from '../sesion-sim/entities/sesion-sim.entity.js';
import { Opcion } from '../opcion/entities/opcion.entity.js';
import { User } from '../user/entities/user.entity.js';

@Injectable()
export class RespuestaSimService {
  constructor(
    @InjectRepository(RespuestaSim)
    private readonly respuestaRepository: Repository<RespuestaSim>,
    // Servicios para validar que las 3 llaves foráneas existan
    private readonly sesionService: SesionSimService,
    private readonly simPreguntaService: SimPreguntaService,
    private readonly opcionService: OpcionService,
  ) {}

  /**
   * Registrar la respuesta de un estudiante a una pregunta
   */
  async create(
    createDto: CreateRespuestaSimDto,
    usuarioActual: User,
  ): Promise<RespuestaSim> {
    const sesion = await this.buscarSesionEnCurso(
      createDto.id_sesion,
      usuarioActual,
    );
    // Lanza 404 si la pregunta del simulacro no existe
    const simPregunta = await this.simPreguntaService.findOne(
      createDto.id_sim_pregunta,
    );

    // La pregunta debe ser del simulacro que se está presentando
    if (simPregunta.id_simulacro !== sesion.id_simulacro) {
      throw new BadRequestException(
        'Esa pregunta no pertenece al simulacro de la sesión',
      );
    }

    // Regla: una sola respuesta por pregunta en cada sesión
    const existente = await this.respuestaRepository.findOne({
      where: {
        id_sesion: createDto.id_sesion,
        id_sim_pregunta: createDto.id_sim_pregunta,
      },
    });

    if (existente) {
      throw new ConflictException(
        `La pregunta ya fue respondida en esta sesión (respuesta ${existente.id_respuesta}); usa PATCH para cambiarla`,
      );
    }

    const opcion = await this.buscarOpcion(
      createDto.id_opcion,
      simPregunta.id_pregunta,
    );

    const respuesta = this.respuestaRepository.create({
      ...createDto,
      id_opcion: opcion ? opcion.id_opcion : null,
      sesion,
      simPregunta,
      opcion,
      // NULL = en blanco; si marcó, el sistema revisa si era la correcta
      es_correcta: opcion ? opcion.es_correcta : null,
      fecha_respuesta: new Date(),
    });

    const saved = await this.respuestaRepository.save(respuesta);
    await this.recalcularPuntaje(sesion.id_sesion);

    return saved;
  }

  /**
   * Obtener todas las respuestas
   */
  async findAll(): Promise<RespuestaSim[]> {
    return await this.respuestaRepository.find({
      relations: { sesion: true, simPregunta: true, opcion: true },
    });
  }

  /**
   * Obtener las respuestas de una sesión, en el orden del simulacro
   */
  async findBySesion(idSesion: number): Promise<RespuestaSim[]> {
    // Lanza 404 si la sesión no existe
    await this.sesionService.findOne(idSesion);

    return await this.respuestaRepository.find({
      where: { id_sesion: idSesion },
      relations: { simPregunta: true, opcion: true },
      order: { simPregunta: { orden: 'ASC' } },
    });
  }

  /**
   * Obtener una respuesta por ID
   */
  async findOne(id: number): Promise<RespuestaSim> {
    const respuesta = await this.respuestaRepository.findOne({
      where: { id_respuesta: id },
      relations: { sesion: true, simPregunta: true, opcion: true },
    });

    if (!respuesta) {
      throw new NotFoundException(`Respuesta con ID ${id} no encontrada`);
    }

    return respuesta;
  }

  /**
   * Cambiar la respuesta mientras la sesión sigue en curso
   */
  async update(
    id: number,
    updateDto: UpdateRespuestaSimDto,
    usuarioActual: User,
  ): Promise<RespuestaSim> {
    const respuesta = await this.findOne(id);
    await this.buscarSesionEnCurso(respuesta.id_sesion, usuarioActual);

    if (updateDto.tiempo_seg !== undefined) {
      respuesta.tiempo_seg = updateDto.tiempo_seg;
    }
    if (updateDto.marcada_revision !== undefined) {
      respuesta.marcada_revision = updateDto.marcada_revision;
    }

    // Cambiar de opción (número) o dejarla en blanco (null)
    if (updateDto.id_opcion !== undefined) {
      const opcion = await this.buscarOpcion(
        updateDto.id_opcion,
        respuesta.simPregunta.id_pregunta,
      );

      respuesta.opcion = opcion;
      respuesta.id_opcion = opcion ? opcion.id_opcion : null;
      respuesta.es_correcta = opcion ? opcion.es_correcta : null;
      respuesta.fecha_respuesta = new Date();
    }

    const saved = await this.respuestaRepository.save(respuesta);
    await this.recalcularPuntaje(respuesta.id_sesion);

    return saved;
  }

  /**
   * Eliminar una respuesta (solo administradores y docentes)
   */
  async remove(id: number): Promise<void> {
    const respuesta = await this.findOne(id);
    const idSesion = respuesta.id_sesion;

    await this.respuestaRepository.remove(respuesta);
    await this.recalcularPuntaje(idSesion);
  }

  /**
   * La sesión debe existir, estar 'En curso' y ser del estudiante que responde
   */
  private async buscarSesionEnCurso(
    idSesion: number,
    usuarioActual: User,
  ): Promise<SesionSim> {
    // Lanza 404 si la sesión no existe
    const sesion = await this.sesionService.findOne(idSesion);

    this.sesionService.validarDueno(sesion.perfil.id_usuario, usuarioActual);

    if (sesion.estado !== 'En curso') {
      throw new BadRequestException(
        `La sesión está ${sesion.estado}: ya no se pueden registrar ni cambiar respuestas`,
      );
    }

    return sesion;
  }

  /**
   * Buscar la opción marcada y validar que sea de esa pregunta
   * (sin opción = respuesta en blanco)
   */
  private async buscarOpcion(
    idOpcion: number | null | undefined,
    idPregunta: number,
  ): Promise<Opcion | null> {
    if (!idOpcion) {
      return null;
    }

    // Lanza 404 si la opción no existe
    const opcion = await this.opcionService.findOne(idOpcion);

    if (opcion.id_pregunta !== idPregunta) {
      throw new BadRequestException(
        'Esa opción no pertenece a la pregunta que se está respondiendo',
      );
    }

    return opcion;
  }

  /**
   * puntaje_total de la sesión = suma de los puntajes de las preguntas acertadas
   */
  private async recalcularPuntaje(idSesion: number): Promise<void> {
    const respuestas = await this.respuestaRepository.find({
      where: { id_sesion: idSesion, es_correcta: true },
      relations: { simPregunta: true },
    });

    const puntaje = respuestas.reduce(
      (total, respuesta) => total + respuesta.simPregunta.puntaje,
      0,
    );

    await this.sesionService.actualizarPuntaje(
      idSesion,
      Math.round(puntaje * 100) / 100,
    );
  }
}
