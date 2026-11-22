import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Retroalimentacion } from './entities/retroalimentacion.entity.js';
import { CreateRetroalimentacionDto } from './dto/create-retroalimentacion.dto.js';
import { UpdateRetroalimentacionDto } from './dto/update-retroalimentacion.dto.js';
import { DesempenoCompetenciaService } from '../desempeno-competencia/desempeno-competencia.service.js';
import { RecursoApoyoService } from '../recurso-apoyo/recurso-apoyo.service.js';
import { RecursoApoyo } from '../recurso-apoyo/entities/recurso-apoyo.entity.js';

// Desde este porcentaje de acierto el desempeño se toma como fortaleza
// (coincide con el inicio del Nivel 3 / B1-B2 en Desempeño)
const UMBRAL_FORTALEZA = 70;

@Injectable()
export class RetroalimentacionService {
  constructor(
    @InjectRepository(Retroalimentacion)
    private readonly retroRepository: Repository<Retroalimentacion>,
    // Servicios de Desempeño y Recurso para validar que las llaves foráneas existan
    private readonly desempenoService: DesempenoCompetenciaService,
    private readonly recursoService: RecursoApoyoService,
  ) {}

  /**
   * Retroalimentación escrita por un docente (origen 'Docente')
   */
  async create(createDto: CreateRetroalimentacionDto): Promise<Retroalimentacion> {
    // Lanza 404 si el desempeño no existe
    const desempeno = await this.desempenoService.findOne(createDto.id_desempeno);

    const recurso = await this.buscarRecurso(
      createDto.id_recurso,
      desempeno.id_competencia,
    );

    const retro = this.retroRepository.create({
      ...createDto,
      id_recurso: recurso ? recurso.id_recurso : null,
      desempeno,
      recurso,
      origen: 'Docente',
      fecha: new Date(),
    });

    return await this.retroRepository.save(retro);
  }

  /**
   * Retroalimentación automática del sistema (origen 'Sistema')
   * El mensaje depende del porcentaje y se sugiere un recurso de la competencia.
   * Si ya había una del sistema para ese desempeño, se actualiza
   */
  async generar(idDesempeno: number): Promise<Retroalimentacion> {
    // Lanza 404 si el desempeño no existe
    const desempeno = await this.desempenoService.findOne(idDesempeno);
    const competencia = desempeno.competencia.nombre;
    const resultado = `${desempeno.correctas} de ${desempeno.total_preguntas} (${desempeno.porcentaje}%, ${desempeno.nivel_logro})`;

    const esFortaleza = desempeno.porcentaje >= UMBRAL_FORTALEZA;
    const mensaje = esFortaleza
      ? `Fortaleza en "${competencia}": acertaste ${resultado}.`
      : `Presentas dificultades en "${competencia}": acertaste ${resultado}.`;

    // Primer recurso disponible de la competencia (puede no haber ninguno)
    const recursos = await this.recursoService.findByCompetencia(
      desempeno.id_competencia,
    );
    const recurso = recursos[0] ?? null;

    const recomendacion = esFortaleza
      ? 'Mantén la práctica con simulacros de mayor dificultad.'
      : recurso
        ? `Repasa el material "${recurso.titulo}" y vuelve a presentar un simulacro.`
        : 'Repasa los temas de esta competencia y vuelve a presentar un simulacro.';

    const existente = await this.retroRepository.findOne({
      where: { id_desempeno: idDesempeno, origen: 'Sistema' },
    });

    const retro = this.retroRepository.create({
      ...existente,
      id_desempeno: idDesempeno,
      id_recurso: recurso ? recurso.id_recurso : null,
      desempeno,
      recurso,
      mensaje,
      recomendacion,
      origen: 'Sistema',
      fecha: new Date(),
    });

    const saved = await this.retroRepository.save(retro);
    return await this.findOne(saved.id_retro);
  }

  /**
   * Obtener todas las retroalimentaciones (las más recientes primero)
   */
  async findAll(): Promise<Retroalimentacion[]> {
    return await this.retroRepository.find({
      relations: { desempeno: true, recurso: true },
      order: { fecha: 'DESC' },
    });
  }

  /**
   * Obtener las retroalimentaciones de un desempeño
   */
  async findByDesempeno(idDesempeno: number): Promise<Retroalimentacion[]> {
    // Lanza 404 si el desempeño no existe
    await this.desempenoService.findOne(idDesempeno);

    return await this.retroRepository.find({
      where: { id_desempeno: idDesempeno },
      relations: { recurso: true },
      order: { fecha: 'DESC' },
    });
  }

  /**
   * Obtener una retroalimentación por ID
   */
  async findOne(id: number): Promise<Retroalimentacion> {
    const retro = await this.retroRepository.findOne({
      where: { id_retro: id },
      relations: { desempeno: { competencia: true }, recurso: true },
    });

    if (!retro) {
      throw new NotFoundException(`Retroalimentación con ID ${id} no encontrada`);
    }

    return retro;
  }

  /**
   * Actualizar una retroalimentación
   */
  async update(
    id: number,
    updateDto: UpdateRetroalimentacionDto,
  ): Promise<Retroalimentacion> {
    const retro = await this.findOne(id);

    if (updateDto.mensaje !== undefined) {
      retro.mensaje = updateDto.mensaje;
    }
    if (updateDto.recomendacion !== undefined) {
      retro.recomendacion = updateDto.recomendacion;
    }

    // Cambiar de recurso (número) o quitarlo (null)
    if (updateDto.id_recurso !== undefined) {
      const recurso = await this.buscarRecurso(
        updateDto.id_recurso,
        retro.desempeno.id_competencia,
      );
      retro.recurso = recurso;
      retro.id_recurso = recurso ? recurso.id_recurso : null;
    }

    return await this.retroRepository.save(retro);
  }

  /**
   * Eliminar una retroalimentación
   */
  async remove(id: number): Promise<void> {
    const retro = await this.findOne(id);

    await this.retroRepository.remove(retro);
  }

  /**
   * El recurso sugerido debe reforzar la misma competencia del desempeño
   */
  private async buscarRecurso(
    idRecurso: number | null | undefined,
    idCompetencia: number,
  ): Promise<RecursoApoyo | null> {
    if (!idRecurso) {
      return null;
    }

    // Lanza 404 si el recurso no existe
    const recurso = await this.recursoService.findOne(idRecurso);

    if (recurso.id_competencia !== idCompetencia) {
      throw new BadRequestException(
        'El recurso sugerido no es de la competencia de este desempeño',
      );
    }

    return recurso;
  }
}
