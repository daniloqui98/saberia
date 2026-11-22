import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ReporteGrupoService } from './reporte-grupo.service.js';
import { UpdateReporteGrupoDto } from './dto/update-reporte-grupo.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

// Las cifras se calculan a partir de las sesiones: no hay POST con body,
// sino una ruta para generar; con PATCH solo se escriben observaciones
@Controller('reportes-grupo')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRADOR', 'DOCENTE')
export class ReporteGrupoController {
  constructor(private readonly reporteService: ReporteGrupoService) {}

  /**
   * POST /reportes-grupo/generar/:idAsignacion
   * Calcular (o recalcular) el reporte de una asignación
   */
  @Post('generar/:idAsignacion')
  generar(@Param('idAsignacion', ParseIntPipe) idAsignacion: number) {
    return this.reporteService.generar(idAsignacion);
  }

  /**
   * GET /reportes-grupo
   * Obtener todos los reportes
   */
  @Get()
  findAll() {
    return this.reporteService.findAll();
  }

  /**
   * GET /reportes-grupo/:id
   * Obtener un reporte por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reporteService.findOne(id);
  }

  /**
   * PATCH /reportes-grupo/:id
   * Escribir las observaciones del docente
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateReporteGrupoDto,
  ) {
    return this.reporteService.update(id, updateDto);
  }

  /**
   * DELETE /reportes-grupo/:id
   * Eliminar un reporte
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reporteService.remove(id);
  }
}
