import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Simulacro } from './entities/simulacro.entity.js';
import { CreateSimulacroDto } from './dto/create-simulacro.dto.js';
import { UpdateSimulacroDto } from './dto/update-simulacro.dto.js';
import { UserService } from '../user/user.service.js';
import { ModuloService } from '../modulo/modulo.service.js';
import { User } from '../user/entities/user.entity.js';

// Roles que pueden crear simulacros
const ROLES_CREADOR = ['DOCENTE', 'ADMINISTRADOR'];

@Injectable()
export class SimulacroService {
  constructor(
    @InjectRepository(Simulacro)
    private readonly simulacroRepository: Repository<Simulacro>,
    // Servicios de Usuario y Módulo para validar que las llaves foráneas existan
    private readonly userService: UserService,
    private readonly moduloService: ModuloService,
  ) {}

  /**
   * Crear un nuevo simulacro
   * idUsuarioActual: quien hace la petición (creador si no se envía id_creador)
   */
  async create(
    createSimulacroDto: CreateSimulacroDto,
    idUsuarioActual: number,
  ): Promise<Simulacro> {
    const creador = await this.buscarCreador(
      createSimulacroDto.id_creador ?? idUsuarioActual,
    );

    // Lanza 404 si el módulo no existe (solo si se envió)
    const modulo = createSimulacroDto.id_modulo
      ? await this.moduloService.findOne(createSimulacroDto.id_modulo)
      : null;

    const simulacro = this.simulacroRepository.create({
      ...createSimulacroDto,
      id_creador: creador.id_usuario,
      creador,
      modulo,
    });

    return await this.simulacroRepository.save(simulacro);
  }

  /**
   * Obtener todos los simulacros (incluye creador y módulo)
   */
  async findAll(): Promise<Simulacro[]> {
    return await this.simulacroRepository.find({
      relations: { creador: true, modulo: true },
      order: { fecha_creacion: 'DESC' },
    });
  }

  /**
   * Obtener un simulacro por ID (incluye creador y módulo)
   */
  async findOne(id: number): Promise<Simulacro> {
    const simulacro = await this.simulacroRepository.findOne({
      where: { id_simulacro: id },
      relations: { creador: true, modulo: true },
    });

    if (!simulacro) {
      throw new NotFoundException(`Simulacro con ID ${id} no encontrado`);
    }

    return simulacro;
  }

  /**
   * Actualizar un simulacro
   */
  async update(
    id: number,
    updateSimulacroDto: UpdateSimulacroDto,
  ): Promise<Simulacro> {
    const simulacro = await this.findOne(id);

    Object.assign(simulacro, updateSimulacroDto);

    // Si cambia el creador, validar que exista y tenga un rol permitido
    if (updateSimulacroDto.id_creador) {
      simulacro.creador = await this.buscarCreador(
        updateSimulacroDto.id_creador,
      );
    }

    // Cambiar de módulo (número) o volverlo mixto (null)
    if (updateSimulacroDto.id_modulo === null) {
      simulacro.modulo = null;
    } else if (updateSimulacroDto.id_modulo) {
      simulacro.modulo = await this.moduloService.findOne(
        updateSimulacroDto.id_modulo,
      );
    }

    return await this.simulacroRepository.save(simulacro);
  }

  /**
   * (*) Guardar el total de preguntas (atributo derivado)
   * Lo llama Sim_Pregunta cada vez que se agrega o quita una pregunta
   */
  async actualizarTotalPreguntas(id: number, total: number): Promise<void> {
    await this.simulacroRepository.update(
      { id_simulacro: id },
      { total_preguntas: total },
    );
  }

  /**
   * Eliminar un simulacro
   */
  async remove(id: number): Promise<void> {
    const simulacro = await this.findOne(id);

    try {
      await this.simulacroRepository.remove(simulacro);
    } catch (error) {
      // 1451 = ER_ROW_IS_REFERENCED_2: hay preguntas o asignaciones en este simulacro
      if (error instanceof QueryFailedError && error.driverError?.errno === 1451) {
        throw new ConflictException(
          'No se puede eliminar el simulacro porque tiene registros asociados',
        );
      }
      throw error;
    }
  }

  /**
   * Buscar el creador y validar que tenga rol DOCENTE o ADMINISTRADOR
   */
  private async buscarCreador(idCreador: number): Promise<User> {
    // Lanza 404 si el usuario no existe
    const creador = await this.userService.findOne(idCreador);

    if (!ROLES_CREADOR.includes(creador.rol.nombre)) {
      throw new BadRequestException(
        `El usuario con ID ${idCreador} no puede crear simulacros: debe ser DOCENTE o ADMINISTRADOR`,
      );
    }

    return creador;
  }
}
