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
import { CompetenciaService } from './competencia.service.js';
import { CreateCompetenciaDto } from './dto/create-competencia.dto.js';
import { UpdateCompetenciaDto } from './dto/update-competencia.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('competencias')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRADOR')
export class CompetenciaController {
  constructor(private readonly competenciaService: CompetenciaService) {}

  /**
   * POST /competencias
   * Crear una nueva competencia
   */
  @Post()
  create(@Body() createCompetenciaDto: CreateCompetenciaDto) {
    return this.competenciaService.create(createCompetenciaDto);
  }

  /**
   * GET /competencias
   * Obtener todas las competencias
   */
  @Get()
  findAll() {
    return this.competenciaService.findAll();
  }

  /**
   * GET /competencias/:id
   * Obtener una competencia por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.competenciaService.findOne(id);
  }

  /**
   * PATCH /competencias/:id
   * Actualizar una competencia
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompetenciaDto: UpdateCompetenciaDto,
  ) {
    return this.competenciaService.update(id, updateCompetenciaDto);
  }

  /**
   * DELETE /competencias/:id
   * Eliminar una competencia
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.competenciaService.remove(id);
  }
}
