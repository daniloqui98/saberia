import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Programa } from './entities/programa.entity.js';
import { CreateProgramaDto } from './dto/create-programa.dto.js';
import { UpdateProgramaDto } from './dto/update-programa.dto.js';
import { FacultadService } from '../facultad/facultad.service.js';

@Injectable()
export class ProgramaService {
  constructor(
    @InjectRepository(Programa)
    private readonly programaRepository: Repository<Programa>,
    // Servicio de Facultad para validar que la llave foránea exista
    private readonly facultadService: FacultadService,
  ) {}

  /**
   * Crear un nuevo programa
   */
  async create(createProgramaDto: CreateProgramaDto): Promise<Programa> {
    const existingPrograma = await this.programaRepository.findOne({
      where: { codigo: createProgramaDto.codigo },
    });

    if (existingPrograma) {
      throw new ConflictException('El código del programa ya está registrado');
    }

    // Lanza 404 si la facultad no existe
    const facultad = await this.facultadService.findOne(
      createProgramaDto.id_facultad,
    );

    const programa = this.programaRepository.create({
      ...createProgramaDto,
      facultad,
    });

    return await this.programaRepository.save(programa);
  }

  /**
   * Obtener todos los programas (incluye los datos de su facultad)
   */
  async findAll(): Promise<Programa[]> {
    return await this.programaRepository.find({
      relations: { facultad: true },
    });
  }

  /**
   * Obtener un programa por ID (incluye los datos de su facultad)
   */
  async findOne(id: number): Promise<Programa> {
    const programa = await this.programaRepository.findOne({
      where: { id_programa: id },
      relations: { facultad: true },
    });

    if (!programa) {
      throw new NotFoundException(`Programa con ID ${id} no encontrado`);
    }

    return programa;
  }

  /**
   * Actualizar un programa
   */
  async update(
    id: number,
    updateProgramaDto: UpdateProgramaDto,
  ): Promise<Programa> {
    const programa = await this.findOne(id);

    // Si cambia el código, verificar que no lo tenga otro programa
    if (
      updateProgramaDto.codigo &&
      updateProgramaDto.codigo !== programa.codigo
    ) {
      const existingPrograma = await this.programaRepository.findOne({
        where: { codigo: updateProgramaDto.codigo },
      });

      if (existingPrograma) {
        throw new ConflictException(
          'El código del programa ya está registrado',
        );
      }
    }

    Object.assign(programa, updateProgramaDto);

    // Si cambia la facultad, validar que exista y actualizar la relación
    if (updateProgramaDto.id_facultad) {
      programa.facultad = await this.facultadService.findOne(
        updateProgramaDto.id_facultad,
      );
    }

    return await this.programaRepository.save(programa);
  }

  /**
   * Eliminar un programa
   */
  async remove(id: number): Promise<void> {
    const programa = await this.findOne(id);

    try {
      await this.programaRepository.remove(programa);
    } catch (error) {
      // 1451 = ER_ROW_IS_REFERENCED_2: hay usuarios que apuntan a este programa
      if (error instanceof QueryFailedError && error.driverError?.errno === 1451) {
        throw new ConflictException(
          'No se puede eliminar el programa porque tiene registros asociados',
        );
      }
      throw error;
    }
  }
}
