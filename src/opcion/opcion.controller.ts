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
import { OpcionService } from './opcion.service.js';
import { CreateOpcionDto } from './dto/create-opcion.dto.js';
import { UpdateOpcionDto } from './dto/update-opcion.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

// Los docentes también gestionan las opciones de sus preguntas
@Controller('opciones')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRADOR', 'DOCENTE')
export class OpcionController {
  constructor(private readonly opcionService: OpcionService) {}

  /**
   * POST /opciones
   * Crear una nueva opción
   */
  @Post()
  create(@Body() createOpcionDto: CreateOpcionDto) {
    return this.opcionService.create(createOpcionDto);
  }

  /**
   * GET /opciones
   * Obtener todas las opciones
   */
  @Get()
  findAll() {
    return this.opcionService.findAll();
  }

  /**
   * GET /opciones/pregunta/:idPregunta
   * Obtener las opciones de una pregunta, en orden
   */
  @Get('pregunta/:idPregunta')
  findByPregunta(@Param('idPregunta', ParseIntPipe) idPregunta: number) {
    return this.opcionService.findByPregunta(idPregunta);
  }

  /**
   * GET /opciones/:id
   * Obtener una opción por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.opcionService.findOne(id);
  }

  /**
   * PATCH /opciones/:id
   * Actualizar una opción
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOpcionDto: UpdateOpcionDto,
  ) {
    return this.opcionService.update(id, updateOpcionDto);
  }

  /**
   * DELETE /opciones/:id
   * Eliminar una opción
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.opcionService.remove(id);
  }
}
