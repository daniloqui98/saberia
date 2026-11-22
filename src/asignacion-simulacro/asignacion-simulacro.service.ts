import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { AsignacionSimulacro } from './entities/asignacion-simulacro.entity.js';
import { CreateAsignacionSimulacroDto } from './dto/create-asignacion-simulacro.dto.js';
import { UpdateAsignacionSimulacroDto } from './dto/update-asignacion-simulacro.dto.js';
import { GrupoService } from '../grupo/grupo.service.js';
import { SimulacroService } from '../simulacro/simulacro.service.js';

@Injectable()
export class AsignacionSimulacroService {
  constructor(
    @InjectRepository(AsignacionSimulacro)
    private readonly asignacionRepository: Repository<AsignacionSimulacro>,
    // Servicios de Grupo y Simulacro para validar que las llaves foráneas existan
    private readonly grupoService: GrupoService,
    private readonly simulacroService: SimulacroService,
  ) {}

  /**
   * Asignar un simulacro a un grupo
   */
  async create(
    createDto: CreateAsignacionSimulacroDto,
  ): Promise<AsignacionSimulacro> {
    // Lanzan 404 si el grupo o el simulacro no existen
    const grupo = await this.grupoService.findOne(createDto.id_grupo);
    const simulacro = await this.simulacroService.findOne(
      createDto.id_simulacro,
    );

    if (!grupo.estado) {
      throw new BadRequestException(
        `El grupo con ID ${grupo.id_grupo} está cerrado`,
      );
    }

    if (!simulacro.estado) {
      throw new BadRequestException(
        `El simulacro con ID ${simulacro.id_simulacro} está deshabilitado`,
      );
    }

    // Un simulacro sin preguntas no se puede presentar
    if (simulacro.total_preguntas === 0) {
      throw new BadRequestException(
        `El simulacro con ID ${simulacro.id_simulacro} no tiene preguntas`,
      );
    }

    // Si no se envía la apertura, el simulacro queda abierto desde ahora
    const fechaApertura = createDto.fecha_apertura
      ? new Date(createDto.fecha_apertura)
      : new Date();
    const fechaCierre = new Date(createDto.fecha_cierre);

    this.validarFechas(fechaApertura, fechaCierre);

    const asignacion = this.asignacionRepository.create({
      ...createDto,
      fecha_apertura: fechaApertura,
      fecha_cierre: fechaCierre,
      grupo,
      simulacro,
    });

    return await this.asignacionRepository.save(asignacion);
  }

  /**
   * Obtener todas las asignaciones (incluye grupo y simulacro)
   */
  async findAll(): Promise<AsignacionSimulacro[]> {
    return await this.asignacionRepository.find({
      relations: { grupo: true, simulacro: true },
      order: { fecha_apertura: 'DESC' },
    });
  }

  /**
   * Obtener las asignaciones de un grupo
   */
  async findByGrupo(idGrupo: number): Promise<AsignacionSimulacro[]> {
    // Lanza 404 si el grupo no existe
    await this.grupoService.findOne(idGrupo);

    return await this.asignacionRepository.find({
      where: { id_grupo: idGrupo },
      relations: { simulacro: true },
      order: { fecha_apertura: 'DESC' },
    });
  }

  /**
   * Obtener una asignación por ID (incluye grupo y simulacro)
   */
  async findOne(id: number): Promise<AsignacionSimulacro> {
    const asignacion = await this.asignacionRepository.findOne({
      where: { id_asignacion: id },
      relations: { grupo: true, simulacro: true },
    });

    if (!asignacion) {
      throw new NotFoundException(`Asignación con ID ${id} no encontrada`);
    }

    return asignacion;
  }

  /**
   * Actualizar una asignación (fechas, intentos o estado)
   */
  async update(
    id: number,
    updateDto: UpdateAsignacionSimulacroDto,
  ): Promise<AsignacionSimulacro> {
    const asignacion = await this.findOne(id);

    // Validar las fechas combinando las nuevas con las que ya tenía
    const fechaApertura = updateDto.fecha_apertura
      ? new Date(updateDto.fecha_apertura)
      : asignacion.fecha_apertura;
    const fechaCierre = updateDto.fecha_cierre
      ? new Date(updateDto.fecha_cierre)
      : asignacion.fecha_cierre;

    this.validarFechas(fechaApertura, fechaCierre);

    Object.assign(asignacion, {
      ...updateDto,
      fecha_apertura: fechaApertura,
      fecha_cierre: fechaCierre,
    });

    return await this.asignacionRepository.save(asignacion);
  }

  /**
   * Eliminar una asignación
   */
  async remove(id: number): Promise<void> {
    const asignacion = await this.findOne(id);

    try {
      await this.asignacionRepository.remove(asignacion);
    } catch (error) {
      // 1451 = ER_ROW_IS_REFERENCED_2: hay sesiones o reportes de esta asignación
      if (error instanceof QueryFailedError && error.driverError?.errno === 1451) {
        throw new ConflictException(
          'No se puede eliminar la asignación porque tiene registros asociados',
        );
      }
      throw error;
    }
  }

  /**
   * Regla del diccionario: fecha_apertura < fecha_cierre
   */
  private validarFechas(fechaApertura: Date, fechaCierre: Date): void {
    if (fechaApertura >= fechaCierre) {
      throw new BadRequestException(
        'La fecha de apertura debe ser anterior a la fecha de cierre',
      );
    }
  }
}
