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
import { PreguntaService } from './pregunta.service.js';
import { CreatePreguntaDto } from './dto/create-pregunta.dto.js';
import { UpdatePreguntaDto } from './dto/update-pregunta.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

// Los docentes también gestionan el banco de preguntas
@Controller('preguntas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRADOR', 'DOCENTE')
export class PreguntaController {
  constructor(private readonly preguntaService: PreguntaService) {}

  /**
   * POST /preguntas
   * Crear una nueva pregunta
   */
  @Post()
  create(@Body() createPreguntaDto: CreatePreguntaDto) {
    return this.preguntaService.create(createPreguntaDto);
  }

  /**
   * GET /preguntas
   * Obtener todas las preguntas
   */
  @Get()
  findAll() {
    return this.preguntaService.findAll();
  }

  /**
   * GET /preguntas/:id
   * Obtener una pregunta por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.preguntaService.findOne(id);
  }

  /**
   * PATCH /preguntas/:id
   * Actualizar una pregunta
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePreguntaDto: UpdatePreguntaDto,
  ) {
    return this.preguntaService.update(id, updatePreguntaDto);
  }

  /**
   * DELETE /preguntas/:id
   * Eliminar una pregunta
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.preguntaService.remove(id);
  }
}
