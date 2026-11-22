import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Evidencia } from './entities/evidencia.entity.js';
import { CreateEvidenciaDto } from './dto/create-evidencia.dto.js';
import { UpdateEvidenciaDto } from './dto/update-evidencia.dto.js';
import { AfirmacionService } from '../afirmacion/afirmacion.service.js';

@Injectable()
export class EvidenciaService {
  constructor(
    @InjectRepository(Evidencia)
    private readonly evidenciaRepository: Repository<Evidencia>,
    // Servicio de Afirmación para validar que la llave foránea exista
    private readonly afirmacionService: AfirmacionService,
  ) {}

  /**
   * Crear una nueva evidencia
   * (el código no es único según el diccionario, por eso no se valida)
   */
  async create(createEvidenciaDto: CreateEvidenciaDto): Promise<Evidencia> {
    // Lanza 404 si la afirmación no existe
    const afirmacion = await this.afirmacionService.findOne(
      createEvidenciaDto.id_afirmacion,
    );

    const evidencia = this.evidenciaRepository.create({
      ...createEvidenciaDto,
      afirmacion,
    });

    return await this.evidenciaRepository.save(evidencia);
  }

  /**
   * Obtener todas las evidencias (incluye su afirmación)
   */
  async findAll(): Promise<Evidencia[]> {
    return await this.evidenciaRepository.find({
      relations: { afirmacion: true },
    });
  }

  /**
   * Obtener una evidencia por ID (incluye su afirmación y la competencia)
   */
  async findOne(id: number): Promise<Evidencia> {
    const evidencia = await this.evidenciaRepository.findOne({
      where: { id_evidencia: id },
      relations: { afirmacion: { competencia: true } },
    });

    if (!evidencia) {
      throw new NotFoundException(`Evidencia con ID ${id} no encontrada`);
    }

    return evidencia;
  }

  /**
   * Actualizar una evidencia
   */
  async update(
    id: number,
    updateEvidenciaDto: UpdateEvidenciaDto,
  ): Promise<Evidencia> {
    const evidencia = await this.findOne(id);

    Object.assign(evidencia, updateEvidenciaDto);

    // Si cambia la afirmación, validar que exista y actualizar la relación
    if (updateEvidenciaDto.id_afirmacion) {
      evidencia.afirmacion = await this.afirmacionService.findOne(
        updateEvidenciaDto.id_afirmacion,
      );
    }

    return await this.evidenciaRepository.save(evidencia);
  }

  /**
   * Eliminar una evidencia
   */
  async remove(id: number): Promise<void> {
    const evidencia = await this.findOne(id);

    try {
      await this.evidenciaRepository.remove(evidencia);
    } catch (error) {
      // 1451 = ER_ROW_IS_REFERENCED_2: hay preguntas que apuntan a esta evidencia
      if (error instanceof QueryFailedError && error.driverError?.errno === 1451) {
        throw new ConflictException(
          'No se puede eliminar la evidencia porque tiene registros asociados',
        );
      }
      throw error;
    }
  }
}
