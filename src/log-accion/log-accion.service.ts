import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LogAccion } from './entities/log-accion.entity.js';
import { CreateLogAccionDto } from './dto/create-log-accion.dto.js';
import { UserService } from '../user/user.service.js';

@Injectable()
export class LogAccionService {
  constructor(
    @InjectRepository(LogAccion)
    private readonly logRepository: Repository<LogAccion>,
    // Servicio de Usuario para validar que la llave foránea exista
    private readonly userService: UserService,
  ) {}

  /**
   * Registrar una acción en el log
   * ipPeticion: IP de quien hizo la petición (se usa si no viene en el JSON)
   */
  async create(
    createLogDto: CreateLogAccionDto,
    ipPeticion: string,
  ): Promise<LogAccion> {
    // Lanza 404 si el usuario no existe
    const usuario = await this.userService.findOne(createLogDto.id_usuario);

    const log = this.logRepository.create({
      ...createLogDto,
      usuario,
      ip_origen: createLogDto.ip_origen ?? ipPeticion,
    });

    return await this.logRepository.save(log);
  }

  /**
   * Obtener todos los registros del log (los más recientes primero)
   */
  async findAll(): Promise<LogAccion[]> {
    return await this.logRepository.find({
      relations: { usuario: true },
      order: { fecha: 'DESC' },
    });
  }

  /**
   * Obtener las acciones de un usuario (las más recientes primero)
   */
  async findByUsuario(idUsuario: number): Promise<LogAccion[]> {
    // Lanza 404 si el usuario no existe
    await this.userService.findOne(idUsuario);

    return await this.logRepository.find({
      where: { id_usuario: idUsuario },
      order: { fecha: 'DESC' },
    });
  }

  /**
   * Obtener un registro del log por ID
   */
  async findOne(id: number): Promise<LogAccion> {
    const log = await this.logRepository.findOne({
      where: { id_log: id },
      relations: { usuario: true },
    });

    if (!log) {
      throw new NotFoundException(`Registro de log con ID ${id} no encontrado`);
    }

    return log;
  }
}
