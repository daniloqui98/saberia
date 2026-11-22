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
import { SimPreguntaService } from './sim-pregunta.service.js';
import { CreateSimPreguntaDto } from './dto/create-sim-pregunta.dto.js';
import { UpdateSimPreguntaDto } from './dto/update-sim-pregunta.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

// Los docentes arman sus simulacros con preguntas del banco
@Controller('sim-preguntas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRADOR', 'DOCENTE')
export class SimPreguntaController {
  constructor(private readonly simPreguntaService: SimPreguntaService) {}

  /**
   * POST /sim-preguntas
   * Agregar una pregunta a un simulacro
   */
  @Post()
  create(@Body() createDto: CreateSimPreguntaDto) {
    return this.simPreguntaService.create(createDto);
  }

  /**
   * GET /sim-preguntas
   * Obtener todas las preguntas de todos los simulacros
   */
  @Get()
  findAll() {
    return this.simPreguntaService.findAll();
  }

  /**
   * GET /sim-preguntas/simulacro/:idSimulacro
   * Obtener las preguntas de un simulacro, en orden
   */
  @Get('simulacro/:idSimulacro')
  findBySimulacro(@Param('idSimulacro', ParseIntPipe) idSimulacro: number) {
    return this.simPreguntaService.findBySimulacro(idSimulacro);
  }

  /**
   * GET /sim-preguntas/:id
   * Obtener un registro por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.simPreguntaService.findOne(id);
  }

  /**
   * PATCH /sim-preguntas/:id
   * Cambiar el orden o el puntaje
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSimPreguntaDto,
  ) {
    return this.simPreguntaService.update(id, updateDto);
  }

  /**
   * DELETE /sim-preguntas/:id
   * Quitar una pregunta del simulacro
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.simPreguntaService.remove(id);
  }
}
