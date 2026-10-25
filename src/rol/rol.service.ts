import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Rol } from './entities/rol.entity.js';
import { CreateRolDto } from './dto/create-rol.dto.js';
import { UpdateRolDto } from './dto/update-rol.dto.js';

@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  /**
   * Crear un nuevo rol
   */
  async create(createRolDto: CreateRolDto): Promise<Rol> {
    const existingRol = await this.rolRepository.findOne({
      where: { nombre: createRolDto.nombre },
    });

    if (existingRol) {
      throw new ConflictException('El nombre del rol ya está registrado');
    }

    const rol = this.rolRepository.create(createRolDto);

    return await this.rolRepository.save(rol);
  }

  /**
   * Obtener todos los roles
   */
  async findAll(): Promise<Rol[]> {
    return await this.rolRepository.find();
  }

  /**
   * Obtener un rol por ID
   */
  async findOne(id: number): Promise<Rol> {
    const rol = await this.rolRepository.findOne({
      where: { id_rol: id },
    });

    if (!rol) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }

    return rol;
  }

  /**
   * Obtener un rol por su nombre (ej: 'ESTUDIANTE')
   */
  async findByNombre(nombre: string): Promise<Rol> {
    const rol = await this.rolRepository.findOne({
      where: { nombre },
    });

    if (!rol) {
      throw new NotFoundException(
        `El rol ${nombre} no existe, debe crearse primero en /roles`,
      );
    }

    return rol;
  }

  /**
   * Actualizar un rol
   */
  async update(id: number, updateRolDto: UpdateRolDto): Promise<Rol> {
    const rol = await this.findOne(id);

    // Si cambia el nombre, verificar que no lo tenga otro rol
    if (updateRolDto.nombre && updateRolDto.nombre !== rol.nombre) {
      const existingRol = await this.rolRepository.findOne({
        where: { nombre: updateRolDto.nombre },
      });

      if (existingRol) {
        throw new ConflictException('El nombre del rol ya está registrado');
      }
    }

    Object.assign(rol, updateRolDto);

    return await this.rolRepository.save(rol);
  }

  /**
   * Eliminar un rol
   */
  async remove(id: number): Promise<void> {
    const rol = await this.findOne(id);

    try {
      await this.rolRepository.remove(rol);
    } catch (error) {
      // 1451 = ER_ROW_IS_REFERENCED_2: hay usuarios que tienen este rol
      if (error instanceof QueryFailedError && error.driverError?.errno === 1451) {
        throw new ConflictException(
          'No se puede eliminar el rol porque hay usuarios con este rol',
        );
      }
      throw error;
    }
  }
}
