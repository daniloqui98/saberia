import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { CatalogoInsignia } from './entities/catalogo-insignia.entity.js';
import { CreateCatalogoInsigniaDto } from './dto/create-catalogo-insignia.dto.js';
import { UpdateCatalogoInsigniaDto } from './dto/update-catalogo-insignia.dto.js';

@Injectable()
export class CatalogoInsigniaService {
  constructor(
    @InjectRepository(CatalogoInsignia)
    private readonly insigniaRepository: Repository<CatalogoInsignia>,
  ) {}

  /**
   * Crear una nueva insignia
   */
  async create(
    createInsigniaDto: CreateCatalogoInsigniaDto,
  ): Promise<CatalogoInsignia> {
    const existingInsignia = await this.insigniaRepository.findOne({
      where: { codigo: createInsigniaDto.codigo },
    });

    if (existingInsignia) {
      throw new ConflictException('El código de la insignia ya está registrado');
    }

    const insignia = this.insigniaRepository.create(createInsigniaDto);

    return await this.insigniaRepository.save(insignia);
  }

  /**
   * Obtener todas las insignias
   */
  async findAll(): Promise<CatalogoInsignia[]> {
    return await this.insigniaRepository.find();
  }

  /**
   * Obtener una insignia por ID
   */
  async findOne(id: number): Promise<CatalogoInsignia> {
    const insignia = await this.insigniaRepository.findOne({
      where: { id_badge: id },
    });

    if (!insignia) {
      throw new NotFoundException(`Insignia con ID ${id} no encontrada`);
    }

    return insignia;
  }

  /**
   * Actualizar una insignia
   */
  async update(
    id: number,
    updateInsigniaDto: UpdateCatalogoInsigniaDto,
  ): Promise<CatalogoInsignia> {
    const insignia = await this.findOne(id);

    // Si cambia el código, verificar que no lo tenga otra insignia
    if (
      updateInsigniaDto.codigo &&
      updateInsigniaDto.codigo !== insignia.codigo
    ) {
      const existingInsignia = await this.insigniaRepository.findOne({
        where: { codigo: updateInsigniaDto.codigo },
      });

      if (existingInsignia) {
        throw new ConflictException(
          'El código de la insignia ya está registrado',
        );
      }
    }

    Object.assign(insignia, updateInsigniaDto);

    return await this.insigniaRepository.save(insignia);
  }

  /**
   * Eliminar una insignia
   */
  async remove(id: number): Promise<void> {
    const insignia = await this.findOne(id);

    try {
      await this.insigniaRepository.remove(insignia);
    } catch (error) {
      // 1451 = ER_ROW_IS_REFERENCED_2: la insignia ya fue otorgada a estudiantes
      if (error instanceof QueryFailedError && error.driverError?.errno === 1451) {
        throw new ConflictException(
          'No se puede eliminar la insignia porque ya fue otorgada a estudiantes',
        );
      }
      throw error;
    }
  }
}
