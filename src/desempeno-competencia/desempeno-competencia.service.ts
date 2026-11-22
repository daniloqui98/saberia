import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { DesempenoCompetencia } from './entities/desempeno-competencia.entity.js';
import { SesionSimService } from '../sesion-sim/sesion-sim.service.js';
import { SimPreguntaService } from '../sim-pregunta/sim-pregunta.service.js';
import { RespuestaSimService } from '../respuesta-sim/respuesta-sim.service.js';

// Niveles de logro según el porcentaje de acierto (de mayor a menor)
// Los nombres siguen al ICFES (guía "Entender los resultados Saber Pro"):
// 4 niveles de desempeño, el nivel 4 es el más complejo y para estar en un
// nivel hay que superar los anteriores. El ICFES no publica cortes por
// porcentaje: estos cortes son propios de Saberia
//   Nivel 1: desempeño mínimo (identifica información explícita)
//   Nivel 2: intermedio básico (mínimo que piden muchas universidades)
//   Nivel 3: satisfactorio (análisis, inferencia, problemas complejos)
//   Nivel 4: avanzado (evaluación crítica y argumentación sólida)
const NIVELES_LOGRO = [
  { minimo: 90, nivel: 'Nivel 4' },
  { minimo: 70, nivel: 'Nivel 3' },
  { minimo: 40, nivel: 'Nivel 2' },
  { minimo: 0, nivel: 'Nivel 1' },
];

// El módulo de Inglés no usa niveles 1 a 4 sino las bandas del Marco Común
// Europeo (MCER). Los cortes por porcentaje también son propios de Saberia
//   -A1: menor al principiante · A1: principiante · A2: básico
//   B1: pre-intermedio · B2: intermedio alto (esperado en egresados)
const NIVELES_INGLES = [
  { minimo: 80, nivel: 'B2' },
  { minimo: 60, nivel: 'B1' },
  { minimo: 40, nivel: 'A2' },
  { minimo: 20, nivel: 'A1' },
  { minimo: 0, nivel: '-A1' },
];

@Injectable()
export class DesempenoCompetenciaService {
  constructor(
    @InjectRepository(DesempenoCompetencia)
    private readonly desempenoRepository: Repository<DesempenoCompetencia>,
    // Servicios de la sesión, sus preguntas y sus respuestas
    private readonly sesionService: SesionSimService,
    private readonly simPreguntaService: SimPreguntaService,
    private readonly respuestaService: RespuestaSimService,
  ) {}

  /**
   * Calcular el desempeño por competencia de una sesión finalizada
   * Si ya existía, se actualiza (se puede volver a generar)
   */
  async generar(idSesion: number): Promise<DesempenoCompetencia[]> {
    // Lanza 404 si la sesión no existe
    const sesion = await this.sesionService.findOne(idSesion);

    if (sesion.estado !== 'Finalizado') {
      throw new BadRequestException(
        `La sesión está ${sesion.estado}: el desempeño solo se calcula cuando está Finalizado`,
      );
    }

    const simPreguntas =
      await this.simPreguntaService.findBySimulacroConCompetencia(
        sesion.id_simulacro,
      );
    const respuestas = await this.respuestaService.findBySesion(idSesion);

    // Preguntas del simulacro que el estudiante acertó
    const acertadas = new Set(
      respuestas
        .filter((respuesta) => respuesta.es_correcta === true)
        .map((respuesta) => respuesta.id_sim_pregunta),
    );

    // Agrupar por competencia: cuántas preguntas tiene y cuántas acertó
    // (las preguntas sin responder o en blanco cuentan como no acertadas)
    const porCompetencia = new Map<
      number,
      { total: number; correctas: number; esIngles: boolean }
    >();

    for (const simPregunta of simPreguntas) {
      const competencia = simPregunta.pregunta.evidencia.afirmacion.competencia;
      const idCompetencia = competencia.id_competencia;
      const conteo = porCompetencia.get(idCompetencia) ?? {
        total: 0,
        correctas: 0,
        esIngles: this.esModuloIngles(competencia.modulo.nombre),
      };

      conteo.total += 1;
      if (acertadas.has(simPregunta.id_sim_pregunta)) {
        conteo.correctas += 1;
      }

      porCompetencia.set(idCompetencia, conteo);
    }

    const ahora = new Date();

    for (const [idCompetencia, conteo] of porCompetencia) {
      const porcentaje =
        Math.round((conteo.correctas / conteo.total) * 10000) / 100;

      const existente = await this.desempenoRepository.findOne({
        where: { id_sesion: idSesion, id_competencia: idCompetencia },
      });

      await this.desempenoRepository.save(
        this.desempenoRepository.create({
          ...existente,
          id_sesion: idSesion,
          id_competencia: idCompetencia,
          correctas: conteo.correctas,
          total_preguntas: conteo.total,
          porcentaje,
          nivel_logro: this.nivelDeLogro(porcentaje, conteo.esIngles),
          fecha_generacion: ahora,
        }),
      );
    }

    return await this.findBySesion(idSesion);
  }

  /**
   * Obtener todos los desempeños
   */
  async findAll(): Promise<DesempenoCompetencia[]> {
    return await this.desempenoRepository.find({
      relations: { sesion: true, competencia: true },
      order: { fecha_generacion: 'DESC' },
    });
  }

  /**
   * Obtener el desempeño de una sesión, competencia por competencia
   */
  async findBySesion(idSesion: number): Promise<DesempenoCompetencia[]> {
    // Lanza 404 si la sesión no existe
    await this.sesionService.findOne(idSesion);

    return await this.desempenoRepository.find({
      where: { id_sesion: idSesion },
      relations: { competencia: true },
      order: { porcentaje: 'ASC' },
    });
  }

  /**
   * Obtener un desempeño por ID
   */
  async findOne(id: number): Promise<DesempenoCompetencia> {
    const desempeno = await this.desempenoRepository.findOne({
      where: { id_desempeno: id },
      relations: { sesion: true, competencia: true },
    });

    if (!desempeno) {
      throw new NotFoundException(`Desempeño con ID ${id} no encontrado`);
    }

    return desempeno;
  }

  /**
   * Eliminar un desempeño
   */
  async remove(id: number): Promise<void> {
    const desempeno = await this.findOne(id);

    try {
      await this.desempenoRepository.remove(desempeno);
    } catch (error) {
      // 1451 = ER_ROW_IS_REFERENCED_2: hay retroalimentaciones de este desempeño
      if (error instanceof QueryFailedError && error.driverError?.errno === 1451) {
        throw new ConflictException(
          'No se puede eliminar el desempeño porque tiene registros asociados',
        );
      }
      throw error;
    }
  }

  /**
   * Clasificación cualitativa según el porcentaje
   * (Inglés usa las bandas MCER, los demás módulos Nivel 1 a 4)
   */
  private nivelDeLogro(porcentaje: number, esIngles: boolean): string {
    const niveles = esIngles ? NIVELES_INGLES : NIVELES_LOGRO;
    return niveles.find((rango) => porcentaje >= rango.minimo)!.nivel;
  }

  /**
   * Reconoce el módulo de Inglés por su nombre (con o sin tilde)
   */
  private esModuloIngles(nombreModulo: string): boolean {
    return nombreModulo
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .includes('ingles');
  }
}
