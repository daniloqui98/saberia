import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, QueryFailedError, Repository } from 'typeorm';

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
   * Descontar una unidad de stock en UNA sola consulta atómica:
   * UPDATE ... SET stock = stock - 1 WHERE id_item = ? AND stock > 0
   * Si dos canjes llegan a la vez por la última unidad, solo uno la obtiene.
   * Devuelve false si ya no había stock. Lo usa Canje de recompensa
   */
  async descontarStock(id: number, manager: EntityManager): Promise<boolean> {
    const resultado = await manager
      .createQueryBuilder()
      .update(CatalogoRecompensa)
      .set({ stock: () => 'stock - 1' })
      .where('id_item = :id AND stock > 0', { id })
      .execute();

    return (resultado.affected ?? 0) > 0;
  }

  /**
   * Devolver una unidad de stock (al anular un canje)
   */
  async devolverStock(id: number, manager: EntityManager): Promise<void> {
    await manager.getRepository(CatalogoRecompensa).increment(
      { id_item: id },
      'stock',
      1,
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
