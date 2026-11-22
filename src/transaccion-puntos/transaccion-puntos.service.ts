import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { TransaccionPuntos } from './entities/transaccion-puntos.entity.js';
import { CreateTransaccionPuntosDto } from './dto/create-transaccion-puntos.dto.js';
import { PerfilEstudianteService } from '../perfil-estudiante/perfil-estudiante.service.js';
import { PerfilEstudiante } from '../perfil-estudiante/entities/perfil-estudiante.entity.js';
import { SesionSimService } from '../sesion-sim/sesion-sim.service.js';

@Injectable()
export class TransaccionPuntosService {
  constructor(
    @InjectRepository(TransaccionPuntos)
    private readonly transaccionRepository: Repository<TransaccionPuntos>,
    // Servicio de Perfil para validar la FK en las consultas
    private readonly perfilService: PerfilEstudianteService,
    // Servicio de Sesión para validar el origen cuando es una sesión
    private readonly sesionService: SesionSimService,
    // Conexión para abrir transacciones
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Registrar un movimiento de puntos desde la API
   */
  async create(createDto: CreateTransaccionPuntosDto): Promise<TransaccionPuntos> {
    // Si el origen es una sesión, debe existir y ser del mismo estudiante
    if (createDto.origen_tipo === 'Sesion' && createDto.origen_id) {
      const sesion = await this.sesionService.findOne(createDto.origen_id);
      if (sesion.id_perfil !== createDto.id_perfil) {
        throw new BadRequestException(
          'La sesión de origen no pertenece a ese estudiante',
        );
      }
    }

    return await this.registrar(createDto);
  }

  /**
   * Registrar un movimiento y actualizar el saldo del estudiante
   * También lo usan Insignia estudiante (Ingreso) y Canje de recompensa (Egreso).
   *
   * manager: si quien llama ya abrió una transacción, el movimiento entra en
   * ella (si algo falla después, también se deshace). Si no, abre una propia.
   */
  async registrar(
    datos: CreateTransaccionPuntosDto,
    manager?: EntityManager,
  ): Promise<TransaccionPuntos> {
    if (!manager) {
      return await this.dataSource.transaction((m) => this.registrar(datos, m));
    }

    // Bloquear la fila del perfil (SELECT ... FOR UPDATE): si llegan dos
    // movimientos del mismo estudiante a la vez, el segundo espera al primero
    // y así nunca se gasta el mismo saldo dos veces
    const perfil = await manager.getRepository(PerfilEstudiante).findOne({
      where: { id_perfil: datos.id_perfil },
      lock: { mode: 'pessimistic_write' },
    });

    if (!perfil) {
      throw new NotFoundException(
        `Perfil estudiante con ID ${datos.id_perfil} no encontrado`,
      );
    }

    const tipo = datos.tipo ?? 'Ingreso';
    const saldo = await this.calcularSaldo(datos.id_perfil, manager);

    // Un egreso no puede dejar el saldo en negativo
    if (tipo === 'Egreso' && datos.puntos > saldo) {
      throw new BadRequestException(
        `Saldo insuficiente: el estudiante tiene ${saldo} puntos y se intentan descontar ${datos.puntos}`,
      );
    }

    const repo = manager.getRepository(TransaccionPuntos);
    const saved = await repo.save(
      repo.create({
        ...datos,
        tipo,
        origen_id: datos.origen_id ?? null,
        perfil,
        fecha: new Date(),
      }),
    );

    // (*) puntos_totales del perfil = ingresos - egresos
    const nuevoSaldo =
      tipo === 'Ingreso' ? saldo + datos.puntos : saldo - datos.puntos;
    await manager
      .getRepository(PerfilEstudiante)
      .update({ id_perfil: datos.id_perfil }, { puntos_totales: nuevoSaldo });

    return saved;
  }

  /**
   * Saldo actual del estudiante (ingresos - egresos), calculado en la base de datos
   */
  async calcularSaldo(idPerfil: number, manager?: EntityManager): Promise<number> {
    const repo = (manager ?? this.dataSource.manager).getRepository(
      TransaccionPuntos,
    );

    const fila = await repo
      .createQueryBuilder('t')
      .select(
        "COALESCE(SUM(CASE WHEN t.tipo = 'Ingreso' THEN t.puntos ELSE -t.puntos END), 0)",
        'saldo',
      )
      .where('t.id_perfil = :idPerfil', { idPerfil })
      .getRawOne<{ saldo: string | number }>();

    return Number(fila?.saldo ?? 0);
  }

  /**
   * Obtener todos los movimientos (los más recientes primero)
   */
  async findAll(): Promise<TransaccionPuntos[]> {
    return await this.transaccionRepository.find({
      relations: { perfil: true },
      order: { fecha: 'DESC' },
    });
  }

  /**
   * Obtener el historial de un estudiante y su saldo
   */
  async findByPerfil(
    idPerfil: number,
  ): Promise<{ saldo: number; movimientos: TransaccionPuntos[] }> {
    // Lanza 404 si el perfil no existe
    await this.perfilService.findOne(idPerfil);

    const movimientos = await this.transaccionRepository.find({
      where: { id_perfil: idPerfil },
      order: { fecha: 'DESC' },
    });

    return { saldo: await this.calcularSaldo(idPerfil), movimientos };
  }

  /**
   * Obtener un movimiento por ID
   */
  async findOne(id: number): Promise<TransaccionPuntos> {
    const transaccion = await this.transaccionRepository.findOne({
      where: { id_transaccion: id },
      relations: { perfil: true },
    });

    if (!transaccion) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada`);
    }

    return transaccion;
  }
}
