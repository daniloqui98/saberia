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
import { EvidenciaService } from './evidencia.service.js';
import { CreateEvidenciaDto } from './dto/create-evidencia.dto.js';
import { UpdateEvidenciaDto } from './dto/update-evidencia.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('evidencias')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRADOR')
export class EvidenciaController {
  constructor(private readonly evidenciaService: EvidenciaService) {}

  /**
   * POST /evidencias
   * Crear una nueva evidencia
   */
  @Post()
  create(@Body() createEvidenciaDto: CreateEvidenciaDto) {
    return this.evidenciaService.create(createEvidenciaDto);
  }

  /**
   * GET /evidencias
   * Obtener todas las evidencias
   */
  @Get()
  findAll() {
    return this.evidenciaService.findAll();
  }

  /**
   * GET /evidencias/:id
   * Obtener una evidencia por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.evidenciaService.findOne(id);
  }

  /**
   * PATCH /evidencias/:id
   * Actualizar una evidencia
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEvidenciaDto: UpdateEvidenciaDto,
  ) {
    return this.evidenciaService.update(id, updateEvidenciaDto);
  }

  /**
   * DELETE /evidencias/:id
   * Eliminar una evidencia
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.evidenciaService.remove(id);
  }
}
