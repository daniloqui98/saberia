import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Facultad } from './entities/facultad.entity.js';
import { CreateFacultadDto } from './dto/create-facultad.dto.js';
import { UpdateFacultadDto } from './dto/update-facultad.dto.js';

@Injectable()
export class FacultadService {
  constructor(
    @InjectRepository(Facultad)
    private readonly facultadRepository: Repository<Facultad>,
  ) {}

  /**
   * Crear una nueva facultad
   */
  async create(createFacultadDto: CreateFacultadDto): Promise<Facultad> {
    const existingFacultad = await this.facultadRepository.findOne({
      where: { codigo: createFacultadDto.codigo },
    });

    if (existingFacultad) {
      throw new ConflictException('El código de facultad ya está registrado');
    }

    const facultad = this.facultadRepository.create(createFacultadDto);

    return await this.facultadRepository.save(facultad);
  }

  /**
   * Obtener todas las facultades
   */
  async findAll(): Promise<Facultad[]> {
    return await this.facultadRepository.find();
  }

  /**
   * Obtener una facultad por ID
   */
  async findOne(id: number): Promise<Facultad> {
    const facultad = await this.facultadRepository.findOne({
      where: { id_facultad: id },
    });

    if (!facultad) {
      throw new NotFoundException(`Facultad con ID ${id} no encontrada`);
    }

    return facultad;
  }

  /**
   * Actualizar una facultad
   */
  async update(
    id: number,
    updateFacultadDto: UpdateFacultadDto,
  ): Promise<Facultad> {
    const facultad = await this.findOne(id);

    // Si cambia el código, verificar que no lo tenga otra facultad
    if (
      updateFacultadDto.codigo &&
      updateFacultadDto.codigo !== facultad.codigo
    ) {
      const existingFacultad = await this.facultadRepository.findOne({
        where: { codigo: updateFacultadDto.codigo },
      });

      if (existingFacultad) {
        throw new ConflictException('El código de facultad ya está registrado');
      }
    }

    Object.assign(facultad, updateFacultadDto);

    return await this.facultadRepository.save(facultad);
  }

  /**
   * Eliminar una facultad
   */
  async remove(id: number): Promise<void> {
    const facultad = await this.findOne(id);

    try {
      await this.facultadRepository.remove(facultad);
    } catch (error) {
      // 1451 = ER_ROW_IS_REFERENCED_2: hay programas que apuntan a esta facultad
      if (error instanceof QueryFailedError && error.driverError?.errno === 1451) {
        throw new ConflictException(
          'No se puede eliminar la facultad porque tiene programas asociados',
        );
      }
      throw error;
    }
  }
}
