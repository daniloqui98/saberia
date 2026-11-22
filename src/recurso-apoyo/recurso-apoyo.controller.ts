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
import { RecursoApoyoService } from './recurso-apoyo.service.js';
import { CreateRecursoApoyoDto } from './dto/create-recurso-apoyo.dto.js';
import { UpdateRecursoApoyoDto } from './dto/update-recurso-apoyo.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

// Los docentes también publican material de apoyo
@Controller('recursos-apoyo')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRADOR', 'DOCENTE')
export class RecursoApoyoController {
  constructor(private readonly recursoService: RecursoApoyoService) {}

  /**
   * POST /recursos-apoyo
   * Crear un nuevo recurso de apoyo
   */
  @Post()
  create(@Body() createDto: CreateRecursoApoyoDto) {
    return this.recursoService.create(createDto);
  }

  /**
   * GET /recursos-apoyo
   * Obtener todos los recursos
   */
  @Get()
  findAll() {
    return this.recursoService.findAll();
  }

  /**
   * GET /recursos-apoyo/competencia/:idCompetencia
   * Obtener los recursos de una competencia
   */
  @Get('competencia/:idCompetencia')
  findByCompetencia(
    @Param('idCompetencia', ParseIntPipe) idCompetencia: number,
  ) {
    return this.recursoService.findByCompetencia(idCompetencia);
  }

  /**
   * GET /recursos-apoyo/:id
   * Obtener un recurso por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recursoService.findOne(id);
  }

  /**
   * PATCH /recursos-apoyo/:id
   * Actualizar un recurso
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateRecursoApoyoDto,
  ) {
    return this.recursoService.update(id, updateDto);
  }

  /**
   * DELETE /recursos-apoyo/:id
   * Eliminar un recurso
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recursoService.remove(id);
  }
}
