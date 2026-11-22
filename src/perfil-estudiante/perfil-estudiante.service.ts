import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { PerfilEstudiante } from './entities/perfil-estudiante.entity.js';
import { CreatePerfilEstudianteDto } from './dto/create-perfil-estudiante.dto.js';
import { UpdatePerfilEstudianteDto } from './dto/update-perfil-estudiante.dto.js';
import { UserService } from '../user/user.service.js';
import { GrupoService } from '../grupo/grupo.service.js';

@Injectable()
export class PerfilEstudianteService {
  constructor(
    @InjectRepository(PerfilEstudiante)
    private readonly perfilRepository: Repository<PerfilEstudiante>,
    // Servicios de Usuario y Grupo para validar que las llaves foráneas existan
    private readonly userService: UserService,
    private readonly grupoService: GrupoService,
  ) {}

  /**
   * Crear un perfil estudiante
   */
  async create(
    createPerfilDto: CreatePerfilEstudianteDto,
  ): Promise<PerfilEstudiante> {
    // Lanza 404 si el usuario no existe
    const usuario = await this.userService.findOne(createPerfilDto.id_usuario);

    // Solo los usuarios con rol ESTUDIANTE pueden tener perfil estudiante
    if (usuario.rol.nombre !== 'ESTUDIANTE') {
      throw new BadRequestException(
        `El usuario con ID ${usuario.id_usuario} no tiene el rol ESTUDIANTE`,
      );
    }

    // Relación 1:1: un usuario solo puede tener un perfil estudiante
    const existingPerfil = await this.perfilRepository.findOne({
      where: { id_usuario: createPerfilDto.id_usuario },
    });

    if (existingPerfil) {
      throw new ConflictException('El usuario ya tiene un perfil estudiante');
    }

    // Lanza 404 si el grupo no existe (solo si se envió)
    const grupo = createPerfilDto.id_grupo
      ? await this.grupoService.findOne(createPerfilDto.id_grupo)
      : null;

    const perfil = this.perfilRepository.create({
      ...createPerfilDto,
      usuario,
      grupo,
    });

    return await this.perfilRepository.save(perfil);
  }

  /**
   * Obtener todos los perfiles estudiante (incluye el usuario y su grupo)
   */
  async findAll(): Promise<PerfilEstudiante[]> {
    return await this.perfilRepository.find({
      relations: { usuario: true, grupo: true },
    });
  }

  /**
   * Cantidad de estudiantes matriculados en un grupo (la usa Reporte de grupo)
   */
  async contarPorGrupo(idGrupo: number): Promise<number> {
    return await this.perfilRepository.count({ where: { id_grupo: idGrupo } });
  }

  /**
   * Obtener un perfil estudiante por ID (incluye el usuario y su grupo)
   */
  async findOne(id: number): Promise<PerfilEstudiante> {
    const perfil = await this.perfilRepository.findOne({
      where: { id_perfil: id },
      relations: { usuario: true, grupo: true },
    });

    if (!perfil) {
      throw new NotFoundException(
        `Perfil estudiante con ID ${id} no encontrado`,
      );
    }

    return perfil;
  }

  /**
   * Actualizar un perfil estudiante
   */
  async update(
    id: number,
    updatePerfilDto: UpdatePerfilEstudianteDto,
  ): Promise<PerfilEstudiante> {
    const perfil = await this.findOne(id);

    // La racha máxima nunca puede ser menor que la racha actual
    const rachaActual = updatePerfilDto.racha_actual ?? perfil.racha_actual;
    const rachaMaxima = updatePerfilDto.racha_maxima ?? perfil.racha_maxima;

    if (rachaMaxima < rachaActual) {
      throw new BadRequestException(
        'La racha_maxima no puede ser menor que la racha_actual',
      );
    }

    Object.assign(perfil, updatePerfilDto);

    // Cambiar de grupo (número) o sacar al estudiante del grupo (null)
    if (updatePerfilDto.id_grupo === null) {
      perfil.grupo = null;
    } else if (updatePerfilDto.id_grupo) {
      perfil.grupo = await this.grupoService.findOne(updatePerfilDto.id_grupo);
    }

    return await this.perfilRepository.save(perfil);
  }

  /**
   * Eliminar un perfil estudiante
   */
  async remove(id: number): Promise<void> {
    const perfil = await this.findOne(id);

    try {
      await this.perfilRepository.remove(perfil);
    } catch (error) {
      // 1451 = ER_ROW_IS_REFERENCED_2: hay registros que apuntan a este perfil
      if (error instanceof QueryFailedError && error.driverError?.errno === 1451) {
        throw new ConflictException(
          'No se puede eliminar el perfil estudiante porque tiene registros asociados',
        );
      }
      throw error;
    }
  }
}
