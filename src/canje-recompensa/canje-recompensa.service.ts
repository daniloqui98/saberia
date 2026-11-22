import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CanjeRecompensa } from './entities/canje-recompensa.entity.js';
import { CreateCanjeRecompensaDto } from './dto/create-canje-recompensa.dto.js';
import { UpdateCanjeRecompensaDto } from './dto/update-canje-recompensa.dto.js';
import { PerfilEstudianteService } from '../perfil-estudiante/perfil-estudiante.service.js';
import { CatalogoRecompensaService } from '../catalogo-recompensa/catalogo-recompensa.service.js';
import { TransaccionPuntosService } from '../transaccion-puntos/transaccion-puntos.service.js';
import { User } from '../user/entities/user.entity.js';

@Injectable()
export class CanjeRecompensaService {
  constructor(
    @InjectRepository(CanjeRecompensa)
    private readonly canjeRepository: Repository<CanjeRecompensa>,
    // Servicios para validar las llaves foráneas y mover stock
    private readonly perfilService: PerfilEstudianteService,
    private readonly catalogoService: CatalogoRecompensaService,
    // Servicio de puntos para descontar (o devolver) los puntos
    private readonly transaccionService: TransaccionPuntosService,
  ) {}

  /**
   * Canjear una recompensa
   * usuarioActual: un estudiante solo puede canjear con su propio perfil
   */
  async create(
    createDto: CreateCanjeRecompensaDto,
    usuarioActual: User,
  ): Promise<CanjeRecompensa> {
    // Lanzan 404 si el perfil o la recompensa no existen
    const perfil = await this.perfilService.findOne(createDto.id_perfil);
    const item = await this.catalogoService.findOne(createDto.id_item);

    if (
      usuarioActual.rol.nombre === 'ESTUDIANTE' &&
      usuarioActual.id_usuario !== perfil.id_usuario
    ) {
      throw new ForbiddenException(
        'Un estudiante solo puede canjear con sus propios puntos',
      );
    }

    if (!item.activo) {
      throw new BadRequestException(
        `La recompensa "${item.nombre}" no está disponible en la tienda`,
      );
    }

    if (item.stock <= 0) {
      throw new BadRequestException(`La recompensa "${item.nombre}" está agotada`);
    }

    const saldo = await this.transaccionService.calcularSaldo(createDto.id_perfil);
    if (saldo < item.costo_puntos) {
      throw new BadRequestException(
        `Saldo insuficiente: la recompensa cuesta ${item.costo_puntos} puntos y el estudiante tiene ${saldo}`,
      );
    }

    // Regla del diccionario: puntos_gastados congela el costo actual
    const canje = this.canjeRepository.create({
      ...createDto,
      perfil,
      item,
      puntos_gastados: item.costo_puntos,
      estado: 'Pendiente',
      fecha_canje: new Date(),
    });

    const saved = await this.canjeRepository.save(canje);

    // Descontar los puntos (Egreso) y una unidad del stock
    await this.transaccionService.registrar({
      id_perfil: createDto.id_perfil,
      tipo: 'Egreso',
      concepto: `Canje: ${item.nombre}`.slice(0, 100),
      puntos: item.costo_puntos,
      origen_tipo: 'Canje',
      origen_id: saved.id_canje,
    });
    await this.catalogoService.ajustarStock(item.id_item, -1);

    return await this.findOne(saved.id_canje);
  }

  /**
   * Obtener todos los canjes (los más recientes primero)
   */
  async findAll(): Promise<CanjeRecompensa[]> {
    return await this.canjeRepository.find({
      relations: { perfil: true, item: true },
      order: { fecha_canje: 'DESC' },
    });
  }

  /**
   * Obtener los canjes de un estudiante
   */
  async findByPerfil(idPerfil: number): Promise<CanjeRecompensa[]> {
    // Lanza 404 si el perfil no existe
    await this.perfilService.findOne(idPerfil);

    return await this.canjeRepository.find({
      where: { id_perfil: idPerfil },
      relations: { item: true },
      order: { fecha_canje: 'DESC' },
    });
  }

  /**
   * Obtener un canje por ID
   */
  async findOne(id: number): Promise<CanjeRecompensa> {
    const canje = await this.canjeRepository.findOne({
      where: { id_canje: id },
      relations: { perfil: true, item: true },
    });

    if (!canje) {
      throw new NotFoundException(`Canje con ID ${id} no encontrado`);
    }

    return canje;
  }

  /**
   * Marcar un canje 'Pendiente' como Entregado o Anulado
   * Al anular se devuelven los puntos y la unidad de stock
   */
  async update(
    id: number,
    updateDto: UpdateCanjeRecompensaDto,
  ): Promise<CanjeRecompensa> {
    const canje = await this.findOne(id);

    if (canje.estado !== 'Pendiente') {
      throw new BadRequestException(
        `El canje ya está ${canje.estado} y no se puede modificar`,
      );
    }

    canje.estado = updateDto.estado;
    const saved = await this.canjeRepository.save(canje);

    if (updateDto.estado === 'Anulado') {
      // El libro de puntos no se borra: se registra el movimiento contrario
      await this.transaccionService.registrar({
        id_perfil: canje.id_perfil,
        tipo: 'Ingreso',
        concepto: `Anulación de canje: ${canje.item.nombre}`.slice(0, 100),
        puntos: canje.puntos_gastados,
        origen_tipo: 'Canje',
        origen_id: canje.id_canje,
      });
      await this.catalogoService.ajustarStock(canje.id_item, 1);
    }

    return saved;
  }
}
