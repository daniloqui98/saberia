import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, QueryFailedError, Repository } from 'typeorm';

import { PeriodoAcademico } from './entities/periodo-academico.entity.js';
import { CreatePeriodoAcademicoDto } from './dto/create-periodo-academico.dto.js';
import { UpdatePeriodoAcademicoDto } from './dto/update-periodo-academico.dto.js';

@Injectable()
export class PeriodoAcademicoService {
  constructor(
    @InjectRepository(PeriodoAcademico)
    private readonly periodoRepository: Repository<PeriodoAcademico>,
  ) {}

  /**
   * Crear un nuevo periodo académico
   */
  async create(
    createPeriodoDto: CreatePeriodoAcademicoDto,
  ): Promise<PeriodoAcademico> {
    const existingPeriodo = await this.periodoRepository.findOne({
      where: { codigo: createPeriodoDto.codigo },
    });

    if (existingPeriodo) {
      throw new ConflictException('El código del periodo ya está registrado');
    }

    this.validarFechas(createPeriodoDto.fecha_inicio, createPeriodoDto.fecha_fin);

    const periodo = this.periodoRepository.create(createPeriodoDto);
    const savedPeriodo = await this.periodoRepository.save(periodo);

    if (savedPeriodo.activo) {
      await this.desactivarOtros(savedPeriodo.id_periodo);
    }

    return savedPeriodo;
  }

  /**
   * Obtener todos los periodos académicos
   */
  async findAll(): Promise<PeriodoAcademico[]> {
    return await this.periodoRepository.find();
  }

  /**
   * Obtener un periodo académico por ID
   */
  async findOne(id: number): Promise<PeriodoAcademico> {
    const periodo = await this.periodoRepository.findOne({
      where: { id_periodo: id },
    });

    if (!periodo) {
      throw new NotFoundException(
        `Periodo académico con ID ${id} no encontrado`,
      );
    }

    return periodo;
  }

  /**
   * Actualizar un periodo académico
   */
  async update(
    id: number,
    updatePeriodoDto: UpdatePeriodoAcademicoDto,
  ): Promise<PeriodoAcademico> {
    const periodo = await this.findOne(id);

    // Si cambia el código, verificar que no lo tenga otro periodo
    if (updatePeriodoDto.codigo && updatePeriodoDto.codigo !== periodo.codigo) {
      const existingPeriodo = await this.periodoRepository.findOne({
        where: { codigo: updatePeriodoDto.codigo },
      });

      if (existingPeriodo) {
        throw new ConflictException('El código del periodo ya está registrado');
      }
    }

    // Validar las fechas combinando las nuevas con las que ya tenía
    this.validarFechas(
      updatePeriodoDto.fecha_inicio ?? periodo.fecha_inicio,
      updatePeriodoDto.fecha_fin ?? periodo.fecha_fin,
    );

    Object.assign(periodo, updatePeriodoDto);
    const savedPeriodo = await this.periodoRepository.save(periodo);

    if (savedPeriodo.activo) {
      await this.desactivarOtros(savedPeriodo.id_periodo);
    }

    return savedPeriodo;
  }

  /**
   * Eliminar un periodo académico
   */
  async remove(id: number): Promise<void> {
    const periodo = await this.findOne(id);

    try {
      await this.periodoRepository.remove(periodo);
    } catch (error) {
      // 1451 = ER_ROW_IS_REFERENCED_2: hay grupos que apuntan a este periodo
      if (error instanceof QueryFailedError && error.driverError?.errno === 1451) {
        throw new ConflictException(
          'No se puede eliminar el periodo porque tiene registros asociados',
        );
      }
      throw error;
    }
  }

  /**
   * Regla del diccionario: fecha_inicio < fecha_fin
   * Las fechas YYYY-MM-DD se pueden comparar como texto
   */
  private validarFechas(fechaInicio: string, fechaFin: string): void {
    if (fechaInicio >= fechaFin) {
      throw new BadRequestException(
        'La fecha de inicio debe ser anterior a la fecha de fin',
      );
    }
  }

  /**
   * Regla del diccionario: solo un periodo puede estar activo
   * Al activar uno, se desactivan todos los demás
   */
  private async desactivarOtros(idActivo: number): Promise<void> {
    await this.periodoRepository.update(
      { id_periodo: Not(idActivo), activo: true },
      { activo: false },
    );
  }
}
