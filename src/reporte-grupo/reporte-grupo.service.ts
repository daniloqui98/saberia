import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ReporteGrupo } from './entities/reporte-grupo.entity.js';
import { UpdateReporteGrupoDto } from './dto/update-reporte-grupo.dto.js';
import { AsignacionSimulacroService } from '../asignacion-simulacro/asignacion-simulacro.service.js';
import { SesionSimService } from '../sesion-sim/sesion-sim.service.js';
import { PerfilEstudianteService } from '../perfil-estudiante/perfil-estudiante.service.js';

@Injectable()
export class ReporteGrupoService {
  constructor(
    @InjectRepository(ReporteGrupo)
    private readonly reporteRepository: Repository<ReporteGrupo>,
    // Servicios de los que se calculan las estadísticas
    private readonly asignacionService: AsignacionSimulacroService,
    private readonly sesionService: SesionSimService,
    private readonly perfilService: PerfilEstudianteService,
  ) {}

  /**
   * Calcular (o recalcular) el reporte de una asignación
   * Se puede generar en cualquier momento; si ya existía, se actualiza
   * y se conservan las observaciones
   */
  async generar(idAsignacion: number): Promise<ReporteGrupo> {
    // Lanza 404 si la asignación no existe
    const asignacion = await this.asignacionService.findOne(idAsignacion);

    const sesiones =
      await this.sesionService.findFinalizadasByAsignacion(idAsignacion);

    // Mejor puntaje de cada estudiante (si presentó varias veces)
    const mejorPorEstudiante = new Map<number, number>();
    for (const sesion of sesiones) {
      const puntaje = sesion.puntaje_total ?? 0;
      const actual = mejorPorEstudiante.get(sesion.id_perfil);
      if (actual === undefined || puntaje > actual) {
        mejorPorEstudiante.set(sesion.id_perfil, puntaje);
      }
    }

    const totalEstudiantes = mejorPorEstudiante.size;
    const suma = [...mejorPorEstudiante.values()].reduce((a, b) => a + b, 0);
    const promedio =
      totalEstudiantes > 0
        ? Math.round((suma / totalEstudiantes) * 100) / 100
        : 0;

    // Participación = estudiantes que completaron / matriculados en el grupo
    const matriculados = await this.perfilService.contarPorGrupo(
      asignacion.id_grupo,
    );
    const tasa =
      matriculados > 0
        ? Math.min(100, Math.round((totalEstudiantes / matriculados) * 10000) / 100)
        : 0;

    const existente = await this.reporteRepository.findOne({
      where: { id_asignacion: idAsignacion },
    });

    const reporte = this.reporteRepository.create({
      ...existente,
      id_asignacion: idAsignacion,
      asignacion,
      fecha_generacion: new Date(),
      promedio_general: promedio,
      total_estudiantes: totalEstudiantes,
      tasa_participacion: tasa,
    });

    const saved = await this.reporteRepository.save(reporte);
    return await this.findOne(saved.id_reporte);
  }

  /**
   * Obtener todos los reportes (los más recientes primero)
   */
  async findAll(): Promise<ReporteGrupo[]> {
    return await this.reporteRepository.find({
      relations: { asignacion: { grupo: true, simulacro: true } },
      order: { fecha_generacion: 'DESC' },
    });
  }

  /**
   * Obtener un reporte por ID (incluye la asignación, su grupo y su simulacro)
   */
  async findOne(id: number): Promise<ReporteGrupo> {
    const reporte = await this.reporteRepository.findOne({
      where: { id_reporte: id },
      relations: { asignacion: { grupo: true, simulacro: true } },
    });

    if (!reporte) {
      throw new NotFoundException(`Reporte con ID ${id} no encontrado`);
    }

    return reporte;
  }

  /**
   * Escribir o cambiar las observaciones del docente
   */
  async update(
    id: number,
    updateDto: UpdateReporteGrupoDto,
  ): Promise<ReporteGrupo> {
    const reporte = await this.findOne(id);

    if (updateDto.observaciones !== undefined) {
      reporte.observaciones = updateDto.observaciones;
    }

    return await this.reporteRepository.save(reporte);
  }

  /**
   * Eliminar un reporte
   */
  async remove(id: number): Promise<void> {
    const reporte = await this.findOne(id);

    await this.reporteRepository.remove(reporte);
  }
}
