import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { DesempenoCompetenciaService } from './desempeno-competencia.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

// Todos los datos se calculan a partir de las respuestas:
// por eso no hay POST con body ni PATCH, sino una ruta para generar
@Controller('desempenos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRADOR', 'DOCENTE')
export class DesempenoCompetenciaController {
  constructor(private readonly desempenoService: DesempenoCompetenciaService) {}

  /**
   * POST /desempenos/generar/:idSesion
   * Calcular (o recalcular) el desempeño por competencia de una sesión
   */
  @Post('generar/:idSesion')
  generar(@Param('idSesion', ParseIntPipe) idSesion: number) {
    return this.desempenoService.generar(idSesion);
  }

  /**
   * GET /desempenos
   * Obtener todos los desempeños
   */
  @Get()
  findAll() {
    return this.desempenoService.findAll();
  }

  /**
   * GET /desempenos/sesion/:idSesion
   * Obtener el desempeño de una sesión
   */
  @Get('sesion/:idSesion')
  findBySesion(@Param('idSesion', ParseIntPipe) idSesion: number) {
    return this.desempenoService.findBySesion(idSesion);
  }

  /**
   * GET /desempenos/:id
   * Obtener un desempeño por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.desempenoService.findOne(id);
  }

  /**
   * DELETE /desempenos/:id
   * Eliminar un desempeño
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.desempenoService.remove(id);
  }
}
