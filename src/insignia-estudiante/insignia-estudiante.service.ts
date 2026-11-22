import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { InsigniaEstudiante } from './entities/insignia-estudiante.entity.js';
import { CreateInsigniaEstudianteDto } from './dto/create-insignia-estudiante.dto.js';
import { PerfilEstudianteService } from '../perfil-estudiante/perfil-estudiante.service.js';
import { CatalogoInsigniaService } from '../catalogo-insignia/catalogo-insignia.service.js';
import { TransaccionPuntosService } from '../transaccion-puntos/transaccion-puntos.service.js';

@Injectable()
export class InsigniaEstudianteService {
  constructor(
    @InjectRepository(InsigniaEstudiante)
    private readonly insigniaRepository: Repository<InsigniaEstudiante>,
    // Servicios para validar las llaves foráneas
    private readonly perfilService: PerfilEstudianteService,
    private readonly catalogoService: CatalogoInsigniaService,
    // Servicio de puntos para abonar (o revertir) los puntos bonus
    private readonly transaccionService: TransaccionPuntosService,
    // Conexión para abrir transacciones
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Otorgar una insignia a un estudiante y abonar sus puntos bonus
   * (en una transacción: o quedan las dos cosas, o ninguna)
   */
  async create(
    createDto: CreateInsigniaEstudianteDto,
  ): Promise<InsigniaEstudiante> {
    // Lanzan 404 si el perfil o la insignia no existen
    const perfil = await this.perfilService.findOne(createDto.id_perfil);
    const badge = await this.catalogoService.findOne(createDto.id_badge);

    // Regla: cada insignia se gana una sola vez (si dos peticiones llegan a la
    // vez, el índice UNIQUE de la tabla detiene la segunda con un 409)
    const yaLaTiene = await this.insigniaRepository.findOne({
      where: { id_perfil: createDto.id_perfil, id_badge: createDto.id_badge },
    });

    if (yaLaTiene) {
      throw new ConflictException(
        `El estudiante ya tiene la insignia "${badge.nombre}"`,
      );
    }

    const idInsignia = await this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(InsigniaEstudiante);
      const saved = await repo.save(
        repo.create({
          ...createDto,
          perfil,
          badge,
          fecha_obtenida: new Date(),
        }),
      );

      // Los puntos bonus de la insignia entran como Ingreso en el libro de puntos
      if (badge.puntos_bonus > 0) {
        await this.transaccionService.registrar(
          {
            id_perfil: createDto.id_perfil,
            tipo: 'Ingreso',
            concepto: `Insignia: ${badge.nombre}`.slice(0, 100),
            puntos: badge.puntos_bonus,
            origen_tipo: 'Insignia',
            origen_id: saved.id_insignia,
          },
          manager,
        );
      }

      return saved.id_insignia;
    });

    return await this.findOne(idInsignia);
  }

  /**
   * Obtener todas las insignias otorgadas (las más recientes primero)
   */
  async findAll(): Promise<InsigniaEstudiante[]> {
    return await this.insigniaRepository.find({
      relations: { perfil: true, badge: true },
      order: { fecha_obtenida: 'DESC' },
    });
  }

  /**
   * Obtener las insignias de un estudiante
   */
  async findByPerfil(idPerfil: number): Promise<InsigniaEstudiante[]> {
    // Lanza 404 si el perfil no existe
    await this.perfilService.findOne(idPerfil);

    return await this.insigniaRepository.find({
      where: { id_perfil: idPerfil },
      relations: { badge: true },
      order: { fecha_obtenida: 'DESC' },
    });
  }

  /**
   * Obtener una insignia otorgada por ID
   */
  async findOne(id: number): Promise<InsigniaEstudiante> {
    const insignia = await this.insigniaRepository.findOne({
      where: { id_insignia: id },
      relations: { perfil: true, badge: true },
    });

    if (!insignia) {
      throw new NotFoundException(`Insignia otorgada con ID ${id} no encontrada`);
    }

    return insignia;
  }

  /**
   * Revocar una insignia: se descuentan los puntos bonus que dio
   * (en una transacción con el borrado)
   */
  async remove(id: number): Promise<void> {
    const insignia = await this.findOne(id);
    const bonus = insignia.badge.puntos_bonus;

    await this.dataSource.transaction(async (manager) => {
      if (bonus > 0) {
        try {
          // El libro de puntos no se borra: se registra el movimiento contrario
          await this.transaccionService.registrar(
            {
              id_perfil: insignia.id_perfil,
              tipo: 'Egreso',
              concepto: `Revocación de insignia: ${insignia.badge.nombre}`.slice(0, 100),
              puntos: bonus,
              origen_tipo: 'Insignia',
              origen_id: insignia.id_insignia,
            },
            manager,
          );
        } catch (error) {
          if (error instanceof BadRequestException) {
            throw new BadRequestException(
              `No se puede revocar: el estudiante ya gastó los ${bonus} puntos que le dio la insignia`,
            );
          }
          throw error;
        }
      }

      await manager.getRepository(InsigniaEstudiante).delete({
        id_insignia: insignia.id_insignia,
      });
    });
  }
}
