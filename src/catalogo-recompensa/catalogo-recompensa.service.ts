import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { CatalogoRecompensa } from './entities/catalogo-recompensa.entity.js';
import { CreateCatalogoRecompensaDto } from './dto/create-catalogo-recompensa.dto.js';
import { UpdateCatalogoRecompensaDto } from './dto/update-catalogo-recompensa.dto.js';

@Injectable()
export class CatalogoRecompensaService {
  constructor(
    @InjectRepository(CatalogoRecompensa)
    private readonly recompensaRepository: Repository<CatalogoRecompensa>,
  ) {}

  /**
   * Crear una nueva recompensa
   * (esta tabla no tiene campos únicos aparte del id)
   */
  async create(
    createRecompensaDto: CreateCatalogoRecompensaDto,
  ): Promise<CatalogoRecompensa> {
    const recompensa = this.recompensaRepository.create(createRecompensaDto);

    return await this.recompensaRepository.save(recompensa);
  }

  /**
   * Obtener todas las recompensas
   */
  async findAll(): Promise<CatalogoRecompensa[]> {
    return await this.recompensaRepository.find();
  }

  /**
   * Obtener una recompensa por ID
   */
  async findOne(id: number): Promise<CatalogoRecompensa> {
    const recompensa = await this.recompensaRepository.findOne({
      where: { id_item: id },
    });

    if (!recompensa) {
      throw new NotFoundException(`Recompensa con ID ${id} no encontrada`);
    }

    return recompensa;
  }

  /**
   * Actualizar una recompensa
   */
  async update(
    id: number,
    updateRecompensaDto: UpdateCatalogoRecompensaDto,
  ): Promise<CatalogoRecompensa> {
    const recompensa = await this.findOne(id);

    Object.assign(recompensa, updateRecompensaDto);

    return await this.recompensaRepository.save(recompensa);
  }

  /**
   * Sumar o restar unidades al stock (lo usa Canje de recompensa)
   * cantidad = -1 al canjear, +1 al anular un canje
   */
  async ajustarStock(id: number, cantidad: number): Promise<void> {
    await this.recompensaRepository.increment(
      { id_item: id },
      'stock',
      cantidad,
    );
  }

  /**
   * Eliminar una recompensa
   */
  async remove(id: number): Promise<void> {
    const recompensa = await this.findOne(id);

    try {
      await this.recompensaRepository.remove(recompensa);
    } catch (error) {
      // 1451 = ER_ROW_IS_REFERENCED_2: la recompensa ya fue canjeada
      if (error instanceof QueryFailedError && error.driverError?.errno === 1451) {
        throw new ConflictException(
          'No se puede eliminar la recompensa porque ya tiene canjes; desactívala con activo: false',
        );
      }
      throw error;
    }
  }
}
