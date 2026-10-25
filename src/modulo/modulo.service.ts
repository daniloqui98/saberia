import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Modulo } from './entities/modulo.entity.js';
import { CreateModuloDto } from './dto/create-modulo.dto.js';
import { UpdateModuloDto } from './dto/update-modulo.dto.js';

@Injectable()
export class ModuloService {
  constructor(
    @InjectRepository(Modulo)
    private readonly moduloRepository: Repository<Modulo>,
  ) {}

  /**
   * Crear un nuevo módulo
   */
  async create(createModuloDto: CreateModuloDto): Promise<Modulo> {
    const existingModulo = await this.moduloRepository.findOne({
      where: { codigo: createModuloDto.codigo },
    });

    if (existingModulo) {
      throw new ConflictException('El código del módulo ya está registrado');
    }

    const modulo = this.moduloRepository.create(createModuloDto);

    return await this.moduloRepository.save(modulo);
  }

  /**
   * Obtener todos los módulos
   */
  async findAll(): Promise<Modulo[]> {
    return await this.moduloRepository.find();
  }

  /**
   * Obtener un módulo por ID
   */
  async findOne(id: number): Promise<Modulo> {
    const modulo = await this.moduloRepository.findOne({
      where: { id_modulo: id },
    });

    if (!modulo) {
      throw new NotFoundException(`Módulo con ID ${id} no encontrado`);
    }

    return modulo;
  }

  /**
   * Actualizar un módulo
   */
  async update(id: number, updateModuloDto: UpdateModuloDto): Promise<Modulo> {
    const modulo = await this.findOne(id);

    // Si cambia el código, verificar que no lo tenga otro módulo
    if (updateModuloDto.codigo && updateModuloDto.codigo !== modulo.codigo) {
      const existingModulo = await this.moduloRepository.findOne({
        where: { codigo: updateModuloDto.codigo },
      });

      if (existingModulo) {
        throw new ConflictException('El código del módulo ya está registrado');
      }
    }

    Object.assign(modulo, updateModuloDto);

    return await this.moduloRepository.save(modulo);
  }

  /**
   * Eliminar un módulo
   */
  async remove(id: number): Promise<void> {
    const modulo = await this.findOne(id);

    try {
      await this.moduloRepository.remove(modulo);
    } catch (error) {
      // 1451 = ER_ROW_IS_REFERENCED_2: hay competencias que apuntan a este módulo
      if (error instanceof QueryFailedError && error.driverError?.errno === 1451) {
        throw new ConflictException(
          'No se puede eliminar el módulo porque tiene registros asociados',
        );
      }
      throw error;
    }
  }
}
