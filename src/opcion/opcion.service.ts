import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, QueryFailedError, Repository } from 'typeorm';

import { Opcion } from './entities/opcion.entity.js';
import { CreateOpcionDto } from './dto/create-opcion.dto.js';
import { UpdateOpcionDto } from './dto/update-opcion.dto.js';
import { PreguntaService } from '../pregunta/pregunta.service.js';

@Injectable()
export class OpcionService {
  constructor(
    @InjectRepository(Opcion)
    private readonly opcionRepository: Repository<Opcion>,
    // Servicio de Pregunta para validar que la llave foránea exista
    private readonly preguntaService: PreguntaService,
  ) {}

  /**
   * Crear una nueva opción
   */
  async create(createOpcionDto: CreateOpcionDto): Promise<Opcion> {
    // Lanza 404 si la pregunta no existe
    const pregunta = await this.preguntaService.findOne(
      createOpcionDto.id_pregunta,
    );

    // Las preguntas abiertas no tienen opciones de respuesta
    if (pregunta.tipo === 'Abierta') {
      throw new BadRequestException(
        `La pregunta con ID ${pregunta.id_pregunta} es Abierta y no admite opciones`,
      );
    }

    // Cada posición (1 a 5) solo puede usarse una vez por pregunta
    await this.validarOrdenLibre(
      createOpcionDto.id_pregunta,
      createOpcionDto.orden ?? 1,
    );

    const opcion = this.opcionRepository.create({
      ...createOpcionDto,
      pregunta,
    });

    return await this.opcionRepository.save(opcion);
  }

  /**
   * Obtener todas las opciones (incluye su pregunta)
   */
  async findAll(): Promise<Opcion[]> {
    return await this.opcionRepository.find({
      relations: { pregunta: true },
    });
  }

  /**
   * Obtener las opciones de una pregunta, ordenadas por posición
   */
  async findByPregunta(idPregunta: number): Promise<Opcion[]> {
    // Lanza 404 si la pregunta no existe
    await this.preguntaService.findOne(idPregunta);

    return await this.opcionRepository.find({
      where: { id_pregunta: idPregunta },
      order: { orden: 'ASC' },
    });
  }

  /**
   * Obtener una opción por ID (incluye su pregunta)
   */
  async findOne(id: number): Promise<Opcion> {
    const opcion = await this.opcionRepository.findOne({
      where: { id_opcion: id },
      relations: { pregunta: true },
    });

    if (!opcion) {
      throw new NotFoundException(`Opción con ID ${id} no encontrada`);
    }

    return opcion;
  }

  /**
   * Actualizar una opción
   */
  async update(id: number, updateOpcionDto: UpdateOpcionDto): Promise<Opcion> {
    const opcion = await this.findOne(id);

    // Si cambia de posición, verificar que la nueva esté libre
    if (updateOpcionDto.orden && updateOpcionDto.orden !== opcion.orden) {
      await this.validarOrdenLibre(opcion.id_pregunta, updateOpcionDto.orden);
    }

    // Regla del diccionario: al menos 1 opción correcta por pregunta
    if (updateOpcionDto.es_correcta === false && opcion.es_correcta) {
      await this.validarQuedaCorrecta(opcion);
    }

    Object.assign(opcion, updateOpcionDto);

    return await this.opcionRepository.save(opcion);
  }

  /**
   * Eliminar una opción
   */
  async remove(id: number): Promise<void> {
    const opcion = await this.findOne(id);

    // Regla del diccionario: no dejar la pregunta sin opción correcta
    if (opcion.es_correcta) {
      await this.validarQuedaCorrecta(opcion);
    }

    try {
      await this.opcionRepository.remove(opcion);
    } catch (error) {
      // 1451 = ER_ROW_IS_REFERENCED_2: hay respuestas de estudiantes con esta opción
      if (error instanceof QueryFailedError && error.driverError?.errno === 1451) {
        throw new ConflictException(
          'No se puede eliminar la opción porque tiene registros asociados',
        );
      }
      throw error;
    }
  }

  /**
   * Verificar que ninguna otra opción de la pregunta use esa posición
   */
  private async validarOrdenLibre(
    idPregunta: number,
    orden: number,
  ): Promise<void> {
    const ocupada = await this.opcionRepository.findOne({
      where: { id_pregunta: idPregunta, orden },
    });

    if (ocupada) {
      throw new ConflictException(
        `La pregunta ya tiene una opción en la posición ${orden}`,
      );
    }
  }

  /**
   * Verificar que, sin esta opción, la pregunta siga teniendo otra correcta
   * (si la pregunta no tiene más opciones, se permite)
   */
  private async validarQuedaCorrecta(opcion: Opcion): Promise<void> {
    const otras = await this.opcionRepository.find({
      where: { id_pregunta: opcion.id_pregunta, id_opcion: Not(opcion.id_opcion) },
    });

    if (otras.length > 0 && !otras.some((otra) => otra.es_correcta)) {
      throw new BadRequestException(
        'La pregunta debe tener al menos una opción correcta: marca otra como correcta primero',
      );
    }
  }
}
