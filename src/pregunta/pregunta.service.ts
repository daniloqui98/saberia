import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Pregunta } from './entities/pregunta.entity.js';
import { CreatePreguntaDto } from './dto/create-pregunta.dto.js';
import { UpdatePreguntaDto } from './dto/update-pregunta.dto.js';
import { EvidenciaService } from '../evidencia/evidencia.service.js';
import { UserService } from '../user/user.service.js';
import { User } from '../user/entities/user.entity.js';

// Roles que pueden ser autores de preguntas
const ROLES_AUTOR = ['DOCENTE', 'ADMINISTRADOR'];

@Injectable()
export class PreguntaService {
  constructor(
    @InjectRepository(Pregunta)
    private readonly preguntaRepository: Repository<Pregunta>,
    // Servicios de Evidencia y Usuario para validar que las llaves foráneas existan
    private readonly evidenciaService: EvidenciaService,
    private readonly userService: UserService,
  ) {}

  /**
   * Crear una nueva pregunta
   */
  async create(createPreguntaDto: CreatePreguntaDto): Promise<Pregunta> {
    // Lanza 404 si la evidencia no existe
    const evidencia = await this.evidenciaService.findOne(
      createPreguntaDto.id_evidencia,
    );

    // El autor es opcional; si se envía, debe existir y ser docente o admin
    const autor = createPreguntaDto.id_autor
      ? await this.buscarAutor(createPreguntaDto.id_autor)
      : null;

    const pregunta = this.preguntaRepository.create({
      ...createPreguntaDto,
      evidencia,
      autor,
    });

    return await this.preguntaRepository.save(pregunta);
  }

  /**
   * Obtener todas las preguntas (incluye su evidencia y su autor)
   */
  async findAll(): Promise<Pregunta[]> {
    return await this.preguntaRepository.find({
      relations: { evidencia: true, autor: true },
      order: { fecha_creacion: 'DESC' },
    });
  }

  /**
   * Obtener una pregunta por ID (incluye evidencia, afirmación, competencia y autor)
   */
  async findOne(id: number): Promise<Pregunta> {
    const pregunta = await this.preguntaRepository.findOne({
      where: { id_pregunta: id },
      relations: {
        evidencia: { afirmacion: { competencia: true } },
        autor: true,
      },
    });

    if (!pregunta) {
      throw new NotFoundException(`Pregunta con ID ${id} no encontrada`);
    }

    return pregunta;
  }

  /**
   * Actualizar una pregunta
   * Si cambia algo más que 'activa', la versión sube en 1 (nueva revisión)
   */
  async update(
    id: number,
    updatePreguntaDto: UpdatePreguntaDto,
  ): Promise<Pregunta> {
    const pregunta = await this.findOne(id);

    const cambiaContenido = Object.keys(updatePreguntaDto).some(
      (campo) => campo !== 'activa',
    );

    Object.assign(pregunta, updatePreguntaDto);

    // Si cambia la evidencia, validar que exista y actualizar la relación
    if (updatePreguntaDto.id_evidencia) {
      pregunta.evidencia = await this.evidenciaService.findOne(
        updatePreguntaDto.id_evidencia,
      );
    }

    // Cambiar de autor (número) o dejar la pregunta sin autor (null)
    if (updatePreguntaDto.id_autor === null) {
      pregunta.autor = null;
    } else if (updatePreguntaDto.id_autor) {
      pregunta.autor = await this.buscarAutor(updatePreguntaDto.id_autor);
    }

    if (cambiaContenido) {
      pregunta.version += 1;
    }

    return await this.preguntaRepository.save(pregunta);
  }

  /**
   * Eliminar una pregunta
   */
  async remove(id: number): Promise<void> {
    const pregunta = await this.findOne(id);

    try {
      await this.preguntaRepository.remove(pregunta);
    } catch (error) {
      // 1451 = ER_ROW_IS_REFERENCED_2: hay opciones o simulacros que usan esta pregunta
      if (error instanceof QueryFailedError && error.driverError?.errno === 1451) {
        throw new ConflictException(
          'No se puede eliminar la pregunta porque tiene registros asociados',
        );
      }
      throw error;
    }
  }

  /**
   * Buscar el autor y validar que tenga rol DOCENTE o ADMINISTRADOR
   */
  private async buscarAutor(idAutor: number): Promise<User> {
    // Lanza 404 si el usuario no existe
    const autor = await this.userService.findOne(idAutor);

    if (!ROLES_AUTOR.includes(autor.rol.nombre)) {
      throw new BadRequestException(
        `El usuario con ID ${idAutor} no puede ser autor: debe ser DOCENTE o ADMINISTRADOR`,
      );
    }

    return autor;
  }
}
