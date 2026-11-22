import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  QueryFailedError,
  Repository,
} from 'typeorm';

import { SimPregunta } from './entities/sim-pregunta.entity.js';
import { Simulacro } from '../simulacro/entities/simulacro.entity.js';
import { CreateSimPreguntaDto } from './dto/create-sim-pregunta.dto.js';
import { UpdateSimPreguntaDto } from './dto/update-sim-pregunta.dto.js';
import { SimulacroService } from '../simulacro/simulacro.service.js';
import { PreguntaService } from '../pregunta/pregunta.service.js';

@Injectable()
export class SimPreguntaService {
  constructor(
    @InjectRepository(SimPregunta)
    private readonly simPreguntaRepository: Repository<SimPregunta>,
    // Servicios de Simulacro y Pregunta para validar que las llaves foráneas existan
    private readonly simulacroService: SimulacroService,
    private readonly preguntaService: PreguntaService,
    // Conexión para abrir transacciones
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Agregar una pregunta a un simulacro
   */
  async create(createDto: CreateSimPreguntaDto): Promise<SimPregunta> {
    // Lanzan 404 si el simulacro o la pregunta no existen
    const simulacro = await this.simulacroService.findOne(createDto.id_simulacro);
    const pregunta = await this.preguntaService.findOne(createDto.id_pregunta);

    // Solo las preguntas activas están disponibles para simulacros
    if (!pregunta.activa) {
      throw new BadRequestException(
        `La pregunta con ID ${pregunta.id_pregunta} está inactiva`,
      );
    }

    // Si el simulacro es de un módulo, la pregunta debe ser de ese mismo módulo
    // (pregunta -> evidencia -> afirmación -> competencia -> módulo)
    const moduloPregunta = pregunta.evidencia.afirmacion.competencia.id_modulo;
    if (simulacro.id_modulo && simulacro.id_modulo !== moduloPregunta) {
      throw new BadRequestException(
        `La pregunta es del módulo ${moduloPregunta} y el simulacro es del módulo ${simulacro.id_modulo}`,
      );
    }

    // Una pregunta no se puede repetir en el mismo simulacro
    const repetida = await this.simPreguntaRepository.findOne({
      where: {
        id_simulacro: createDto.id_simulacro,
        id_pregunta: createDto.id_pregunta,
      },
    });

    if (repetida) {
      throw new ConflictException('La pregunta ya está en este simulacro');
    }

    // Calcular la posición, guardar y recalcular el total en UNA transacción
    return await this.enTransaccion(createDto.id_simulacro, async (manager) => {
      // Si no se envía el orden, la pregunta va al final
      const orden =
        createDto.orden ??
        (await this.siguienteOrden(createDto.id_simulacro, manager));
      await this.validarOrdenLibre(createDto.id_simulacro, orden, manager);

      const repo = manager.getRepository(SimPregunta);
      return await repo.save(
        repo.create({ ...createDto, orden, simulacro, pregunta }),
      );
    });
  }

  /**
   * Obtener todas las preguntas de todos los simulacros
   */
  async findAll(): Promise<SimPregunta[]> {
    return await this.simPreguntaRepository.find({
      relations: { simulacro: true, pregunta: true },
    });
  }

  /**
   * Obtener las preguntas de un simulacro, en el orden en que se muestran
   */
  async findBySimulacro(idSimulacro: number): Promise<SimPregunta[]> {
    // Lanza 404 si el simulacro no existe
    await this.simulacroService.findOne(idSimulacro);

    return await this.simPreguntaRepository.find({
      where: { id_simulacro: idSimulacro },
      relations: { pregunta: true },
      order: { orden: 'ASC' },
    });
  }

  /**
   * Preguntas de un simulacro con la competencia (y su módulo) que mide cada una
   * (pregunta -> evidencia -> afirmación -> competencia -> módulo). Lo usa Desempeño
   */
  async findBySimulacroConCompetencia(
    idSimulacro: number,
  ): Promise<SimPregunta[]> {
    return await this.simPreguntaRepository.find({
      where: { id_simulacro: idSimulacro },
      relations: {
        pregunta: {
          evidencia: { afirmacion: { competencia: { modulo: true } } },
        },
      },
    });
  }

  /**
   * Obtener un registro por ID (incluye simulacro y pregunta)
   */
  async findOne(id: number): Promise<SimPregunta> {
    const simPregunta = await this.simPreguntaRepository.findOne({
      where: { id_sim_pregunta: id },
      relations: { simulacro: true, pregunta: true },
    });

    if (!simPregunta) {
      throw new NotFoundException(
        `Pregunta de simulacro con ID ${id} no encontrada`,
      );
    }

    return simPregunta;
  }

  /**
   * Cambiar el orden o el puntaje de una pregunta dentro del simulacro
   */
  async update(
    id: number,
    updateDto: UpdateSimPreguntaDto,
  ): Promise<SimPregunta> {
    const simPregunta = await this.findOne(id);

    // Si cambia de posición, verificar que la nueva esté libre
    if (updateDto.orden && updateDto.orden !== simPregunta.orden) {
      await this.validarOrdenLibre(simPregunta.id_simulacro, updateDto.orden);
    }

    Object.assign(simPregunta, updateDto);

    return await this.simPreguntaRepository.save(simPregunta);
  }

  /**
   * Quitar una pregunta de un simulacro
   */
  async remove(id: number): Promise<void> {
    const simPregunta = await this.findOne(id);

    try {
      await this.enTransaccion(simPregunta.id_simulacro, async (manager) => {
        await manager.getRepository(SimPregunta).remove(simPregunta);
      });
    } catch (error) {
      // 1451 = ER_ROW_IS_REFERENCED_2: hay respuestas de estudiantes a esta pregunta
      if (error instanceof QueryFailedError && error.driverError?.errno === 1451) {
        throw new ConflictException(
          'No se puede quitar la pregunta porque ya tiene respuestas de estudiantes',
        );
      }
      throw error;
    }
  }

  /**
   * Ejecutar un cambio y recalcular total_preguntas en UNA transacción,
   * bloqueando la fila del simulacro para que dos cambios simultáneos al
   * mismo simulacro se hagan uno detrás del otro
   */
  private async enTransaccion<T>(
    idSimulacro: number,
    accion: (manager: EntityManager) => Promise<T>,
  ): Promise<T> {
    return await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(Simulacro).findOne({
        where: { id_simulacro: idSimulacro },
        lock: { mode: 'pessimistic_write' },
      });

      const resultado = await accion(manager);
      await this.recalcularTotal(idSimulacro, manager);
      return resultado;
    });
  }

  /**
   * Regla del diccionario: el orden es único por simulacro
   */
  private async validarOrdenLibre(
    idSimulacro: number,
    orden: number,
    manager?: EntityManager,
  ): Promise<void> {
    const repo = manager
      ? manager.getRepository(SimPregunta)
      : this.simPreguntaRepository;
    const ocupada = await repo.findOne({
      where: { id_simulacro: idSimulacro, orden },
    });

    if (ocupada) {
      throw new ConflictException(
        `El simulacro ya tiene una pregunta en la posición ${orden}`,
      );
    }
  }

  /**
   * Siguiente posición libre al final del simulacro
   */
  private async siguienteOrden(
    idSimulacro: number,
    manager: EntityManager,
  ): Promise<number> {
    const ultimo = await manager.getRepository(SimPregunta).findOne({
      where: { id_simulacro: idSimulacro },
      order: { orden: 'DESC' },
    });

    return ultimo ? ultimo.orden + 1 : 1;
  }

  /**
   * (*) Recalcular total_preguntas del simulacro (atributo derivado)
   */
  private async recalcularTotal(
    idSimulacro: number,
    manager: EntityManager,
  ): Promise<void> {
    const total = await manager.getRepository(SimPregunta).count({
      where: { id_simulacro: idSimulacro },
    });

    await this.simulacroService.actualizarTotalPreguntas(
      idSimulacro,
      total,
      manager,
    );
  }
}
