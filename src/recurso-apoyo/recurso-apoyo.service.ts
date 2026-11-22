import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { RecursoApoyo } from './entities/recurso-apoyo.entity.js';
import { CreateRecursoApoyoDto } from './dto/create-recurso-apoyo.dto.js';
import { UpdateRecursoApoyoDto } from './dto/update-recurso-apoyo.dto.js';
import { CompetenciaService } from '../competencia/competencia.service.js';

@Injectable()
export class RecursoApoyoService {
  constructor(
    @InjectRepository(RecursoApoyo)
    private readonly recursoRepository: Repository<RecursoApoyo>,
    // Servicio de Competencia para validar que la llave foránea exista
    private readonly competenciaService: CompetenciaService,
  ) {}

  /**
   * Crear un nuevo recurso de apoyo
   */
  async create(createDto: CreateRecursoApoyoDto): Promise<RecursoApoyo> {
    // Lanza 404 si la competencia no existe
    const competencia = await this.competenciaService.findOne(
      createDto.id_competencia,
    );

    const recurso = this.recursoRepository.create({
      ...createDto,
      competencia,
    });

    return await this.recursoRepository.save(recurso);
  }

  /**
   * Obtener todos los recursos (incluye su competencia)
   */
  async findAll(): Promise<RecursoApoyo[]> {
    return await this.recursoRepository.find({
      relations: { competencia: true },
    });
  }

  /**
   * Obtener los recursos que refuerzan una competencia
   * (los usa Retroalimentación para sugerir material)
   */
  async findByCompetencia(idCompetencia: number): Promise<RecursoApoyo[]> {
    // Lanza 404 si la competencia no existe
    await this.competenciaService.findOne(idCompetencia);

    return await this.recursoRepository.find({
      where: { id_competencia: idCompetencia },
    });
  }

  /**
   * Obtener un recurso por ID (incluye su competencia)
   */
  async findOne(id: number): Promise<RecursoApoyo> {
    const recurso = await this.recursoRepository.findOne({
      where: { id_recurso: id },
      relations: { competencia: true },
    });

    if (!recurso) {
      throw new NotFoundException(`Recurso de apoyo con ID ${id} no encontrado`);
    }

    return recurso;
  }

  /**
   * Actualizar un recurso de apoyo
   */
  async update(
    id: number,
    updateDto: UpdateRecursoApoyoDto,
  ): Promise<RecursoApoyo> {
    const recurso = await this.findOne(id);

    Object.assign(recurso, updateDto);

    // Si cambia la competencia, validar que exista y actualizar la relación
    if (updateDto.id_competencia) {
      recurso.competencia = await this.competenciaService.findOne(
        updateDto.id_competencia,
      );
    }

    return await this.recursoRepository.save(recurso);
  }

  /**
   * Eliminar un recurso de apoyo
   */
  async remove(id: number): Promise<void> {
    const recurso = await this.findOne(id);

    try {
      await this.recursoRepository.remove(recurso);
    } catch (error) {
      // 1451 = ER_ROW_IS_REFERENCED_2: hay retroalimentaciones que sugieren este recurso
      if (error instanceof QueryFailedError && error.driverError?.errno === 1451) {
        throw new ConflictException(
          'No se puede eliminar el recurso porque tiene registros asociados',
        );
      }
      throw error;
    }
  }
}
