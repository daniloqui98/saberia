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
import { PeriodoAcademicoService } from './periodo-academico.service.js';
import { CreatePeriodoAcademicoDto } from './dto/create-periodo-academico.dto.js';
import { UpdatePeriodoAcademicoDto } from './dto/update-periodo-academico.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('periodos-academicos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRADOR')
export class PeriodoAcademicoController {
  constructor(private readonly periodoService: PeriodoAcademicoService) {}

  /**
   * POST /periodos-academicos
   * Crear un nuevo periodo académico
   */
  @Post()
  create(@Body() createPeriodoDto: CreatePeriodoAcademicoDto) {
    return this.periodoService.create(createPeriodoDto);
  }

  /**
   * GET /periodos-academicos
   * Obtener todos los periodos académicos
   */
  @Get()
  findAll() {
    return this.periodoService.findAll();
  }

  /**
   * GET /periodos-academicos/:id
   * Obtener un periodo académico por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.periodoService.findOne(id);
  }

  /**
   * PATCH /periodos-academicos/:id
   * Actualizar un periodo académico
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePeriodoDto: UpdatePeriodoAcademicoDto,
  ) {
    return this.periodoService.update(id, updatePeriodoDto);
  }

  /**
   * DELETE /periodos-academicos/:id
   * Eliminar un periodo académico
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.periodoService.remove(id);
  }
}
