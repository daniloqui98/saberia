import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { PerfilDocente } from './entities/perfil-docente.entity.js';
import { CreatePerfilDocenteDto } from './dto/create-perfil-docente.dto.js';
import { UpdatePerfilDocenteDto } from './dto/update-perfil-docente.dto.js';
import { UserService } from '../user/user.service.js';

@Injectable()
export class PerfilDocenteService {
  constructor(
    @InjectRepository(PerfilDocente)
    private readonly perfilRepository: Repository<PerfilDocente>,
    // Servicio de Usuario para validar que la llave foránea exista
    private readonly userService: UserService,
  ) {}

  /**
   * Crear un perfil docente
   */
  async create(createPerfilDto: CreatePerfilDocenteDto): Promise<PerfilDocente> {
    // Lanza 404 si el usuario no existe
    const usuario = await this.userService.findOne(createPerfilDto.id_usuario);

    // Solo los usuarios con rol DOCENTE pueden tener perfil docente
    if (usuario.rol.nombre !== 'DOCENTE') {
      throw new BadRequestException(
        `El usuario con ID ${usuario.id_usuario} no tiene el rol DOCENTE`,
      );
    }

    // Relación 1:1: un usuario solo puede tener un perfil docente
    const existingPerfil = await this.perfilRepository.findOne({
      where: { id_usuario: createPerfilDto.id_usuario },
    });

    if (existingPerfil) {
      throw new ConflictException('El usuario ya tiene un perfil docente');
    }

    const perfil = this.perfilRepository.create({
      ...createPerfilDto,
      usuario,
    });

    return await this.perfilRepository.save(perfil);
  }

  /**
   * Obtener todos los perfiles docentes (incluye los datos del usuario)
   */
  async findAll(): Promise<PerfilDocente[]> {
    return await this.perfilRepository.find({
      relations: { usuario: true },
    });
  }

  /**
   * Obtener un perfil docente por ID (incluye los datos del usuario)
   */
  async findOne(id: number): Promise<PerfilDocente> {
    const perfil = await this.perfilRepository.findOne({
      where: { id_docente: id },
      relations: { usuario: true },
    });

    if (!perfil) {
      throw new NotFoundException(`Perfil docente con ID ${id} no encontrado`);
    }

    return perfil;
  }

  /**
   * Actualizar un perfil docente
   */
  async update(
    id: number,
    updatePerfilDto: UpdatePerfilDocenteDto,
  ): Promise<PerfilDocente> {
    const perfil = await this.findOne(id);

    Object.assign(perfil, updatePerfilDto);

    return await this.perfilRepository.save(perfil);
  }

  /**
   * Eliminar un perfil docente
   */
  async remove(id: number): Promise<void> {
    const perfil = await this.findOne(id);

    try {
      await this.perfilRepository.remove(perfil);
    } catch (error) {
      // 1451 = ER_ROW_IS_REFERENCED_2: hay grupos que apuntan a este docente
      if (error instanceof QueryFailedError && error.driverError?.errno === 1451) {
        throw new ConflictException(
          'No se puede eliminar el perfil docente porque tiene registros asociados',
        );
      }
      throw error;
    }
  }
}
