import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Afirmacion } from './entities/afirmacion.entity.js';
import { CreateAfirmacionDto } from './dto/create-afirmacion.dto.js';
import { UpdateAfirmacionDto } from './dto/update-afirmacion.dto.js';
import { CompetenciaService } from '../competencia/competencia.service.js';

@Injectable()
export class AfirmacionService {
  constructor(
    @InjectRepository(Afirmacion)
    private readonly afirmacionRepository: Repository<Afirmacion>,
    // Servicio de Competencia para validar que la llave foránea exista
    private readonly competenciaService: CompetenciaService,
  ) {}

  /**
   * Crear una nueva afirmación
   * (el código no es único según el diccionario, por eso no se valida)
   */
  async create(createAfirmacionDto: CreateAfirmacionDto): Promise<Afirmacion> {
    // Lanza 404 si la competencia no existe
    const competencia = await this.competenciaService.findOne(
      createAfirmacionDto.id_competencia,
    );

    const afirmacion = this.afirmacionRepository.create({
      ...createAfirmacionDto,
      competencia,
    });

    return await this.afirmacionRepository.save(afirmacion);
  }

  /**
   * Obtener todas las afirmaciones (incluye los datos de su competencia)
   */
  async findAll(): Promise<Afirmacion[]> {
    return await this.afirmacionRepository.find({
      relations: { competencia: true },
    });
  }

  /**
   * Obtener una afirmación por ID (incluye los datos de su competencia)
   */
  async findOne(id: number): Promise<Afirmacion> {
    const afirmacion = await this.afirmacionRepository.findOne({
      where: { id_afirmacion: id },
      relations: { competencia: true },
    });

    if (!afirmacion) {
      throw new NotFoundException(`Afirmación con ID ${id} no encontrada`);
    }

    return afirmacion;
  }

  /**
   * Actualizar una afirmación
   */
  async update(
    id: number,
    updateAfirmacionDto: UpdateAfirmacionDto,
  ): Promise<Afirmacion> {
    const afirmacion = await this.findOne(id);

    Object.assign(afirmacion, updateAfirmacionDto);

    // Si cambia la competencia, validar que exista y actualizar la relación
    if (updateAfirmacionDto.id_competencia) {
      afirmacion.competencia = await this.competenciaService.findOne(
        updateAfirmacionDto.id_competencia,
      );
    }

    return await this.afirmacionRepository.save(afirmacion);
  }

  /**
   * Eliminar una afirmación
   */
  async remove(id: number): Promise<void> {
    const afirmacion = await this.findOne(id);

    try {
      await this.afirmacionRepository.remove(afirmacion);
    } catch (error) {
      // 1451 = ER_ROW_IS_REFERENCED_2: hay evidencias que apuntan a esta afirmación
      if (error instanceof QueryFailedError && error.driverError?.errno === 1451) {
        throw new ConflictException(
          'No se puede eliminar la afirmación porque tiene registros asociados',
        );
      }
      throw error;
    }
  }
}
