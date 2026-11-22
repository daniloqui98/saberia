import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TransaccionPuntos } from './entities/transaccion-puntos.entity.js';
import { CreateTransaccionPuntosDto } from './dto/create-transaccion-puntos.dto.js';
import { PerfilEstudianteService } from '../perfil-estudiante/perfil-estudiante.service.js';
import { SesionSimService } from '../sesion-sim/sesion-sim.service.js';

@Injectable()
export class TransaccionPuntosService {
  constructor(
    @InjectRepository(TransaccionPuntos)
    private readonly transaccionRepository: Repository<TransaccionPuntos>,
    // Servicio de Perfil para validar la FK y guardar el saldo
    private readonly perfilService: PerfilEstudianteService,
    // Servicio de Sesión para validar el origen cuando es una sesión
    private readonly sesionService: SesionSimService,
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
   * También lo usan Insignia estudiante (Ingreso) y Canje de recompensa (Egreso)
   */
  async registrar(datos: CreateTransaccionPuntosDto): Promise<TransaccionPuntos> {
    // Lanza 404 si el perfil no existe
    const perfil = await this.perfilService.findOne(datos.id_perfil);
    const tipo = datos.tipo ?? 'Ingreso';

    // Un egreso no puede dejar el saldo en negativo
    const saldo = await this.calcularSaldo(datos.id_perfil);
    if (tipo === 'Egreso' && datos.puntos > saldo) {
      throw new BadRequestException(
        `Saldo insuficiente: el estudiante tiene ${saldo} puntos y se intentan descontar ${datos.puntos}`,
      );
    }

    const transaccion = this.transaccionRepository.create({
      ...datos,
      tipo,
      origen_id: datos.origen_id ?? null,
      perfil,
      fecha: new Date(),
    });

    const saved = await this.transaccionRepository.save(transaccion);

    // (*) puntos_totales del perfil = ingresos - egresos
    const nuevoSaldo = tipo === 'Ingreso' ? saldo + datos.puntos : saldo - datos.puntos;
    await this.perfilService.actualizarPuntos(datos.id_perfil, nuevoSaldo);

    return saved;
  }

  /**
   * Saldo actual del estudiante, calculado desde sus movimientos
   */
  async calcularSaldo(idPerfil: number): Promise<number> {
    const movimientos = await this.transaccionRepository.find({
      where: { id_perfil: idPerfil },
    });

    return movimientos.reduce(
      (saldo, mov) => (mov.tipo === 'Ingreso' ? saldo + mov.puntos : saldo - mov.puntos),
      0,
    );
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
