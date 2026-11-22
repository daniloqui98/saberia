import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Competencia } from './entities/competencia.entity.js';
import { CreateCompetenciaDto } from './dto/create-competencia.dto.js';
import { UpdateCompetenciaDto } from './dto/update-competencia.dto.js';
import { ModuloService } from '../modulo/modulo.service.js';

@Injectable()
export class CompetenciaService {
  constructor(
    @InjectRepository(Competencia)
    private readonly competenciaRepository: Repository<Competencia>,
    // Servicio de Módulo para validar que la llave foránea exista
    private readonly moduloService: ModuloService,
  ) {}

  /**
   * Crear una nueva competencia
   */
  async create(
    createCompetenciaDto: CreateCompetenciaDto,
  ): Promise<Competencia> {
    const existingCompetencia = await this.competenciaRepository.findOne({
      where: { codigo: createCompetenciaDto.codigo },
    });

    if (existingCompetencia) {
      throw new ConflictException(
        'El código de la competencia ya está registrado',
      );
    }

    // Lanza 404 si el módulo no existe
    const modulo = await this.moduloService.findOne(
      createCompetenciaDto.id_modulo,
    );

    const competencia = this.competenciaRepository.create({
      ...createCompetenciaDto,
      modulo,
    });

    return await this.competenciaRepository.save(competencia);
  }

  /**
   * Obtener todas las competencias (incluye los datos de su módulo)
   */
  async findAll(): Promise<Competencia[]> {
    return await this.competenciaRepository.find({
      relations: { modulo: true },
    });
  }

  /**
   * Obtener una competencia por ID (incluye los datos de su módulo)
   */
  async findOne(id: number): Promise<Competencia> {
    const competencia = await this.competenciaRepository.findOne({
      where: { id_competencia: id },
      relations: { modulo: true },
    });

    if (!competencia) {
      throw new NotFoundException(`Competencia con ID ${id} no encontrada`);
    }

    return competencia;
  }

  /**
   * Actualizar una competencia
   */
  async update(
    id: number,
    updateCompetenciaDto: UpdateCompetenciaDto,
  ): Promise<Competencia> {
    const competencia = await this.findOne(id);

    // Si cambia el código, verificar que no lo tenga otra competencia
    if (
      updateCompetenciaDto.codigo &&
      updateCompetenciaDto.codigo !== competencia.codigo
    ) {
      const existingCompetencia = await this.competenciaRepository.findOne({
        where: { codigo: updateCompetenciaDto.codigo },
      });

      if (existingCompetencia) {
        throw new ConflictException(
          'El código de la competencia ya está registrado',
        );
      }
    }

    Object.assign(competencia, updateCompetenciaDto);

    // Si cambia el módulo, validar que exista y actualizar la relación
    if (updateCompetenciaDto.id_modulo) {
      competencia.modulo = await this.moduloService.findOne(
        updateCompetenciaDto.id_modulo,
      );
    }

    return await this.competenciaRepository.save(competencia);
  }

  /**
   * Eliminar una competencia
   */
  async remove(id: number): Promise<void> {
    const competencia = await this.findOne(id);

    try {
      await this.competenciaRepository.remove(competencia);
    } catch (error) {
      // 1451 = ER_ROW_IS_REFERENCED_2: hay afirmaciones u otros registros que apuntan a esta competencia
      if (error instanceof QueryFailedError && error.driverError?.errno === 1451) {
        throw new ConflictException(
          'No se puede eliminar la competencia porque tiene registros asociados',
        );
      }
      throw error;
    }
  }
}
