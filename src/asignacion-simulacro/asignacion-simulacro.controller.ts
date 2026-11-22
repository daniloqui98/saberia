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
import { AsignacionSimulacroService } from './asignacion-simulacro.service.js';
import { CreateAsignacionSimulacroDto } from './dto/create-asignacion-simulacro.dto.js';
import { UpdateAsignacionSimulacroDto } from './dto/update-asignacion-simulacro.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

// Los docentes asignan simulacros a sus grupos
@Controller('asignaciones-simulacro')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRADOR', 'DOCENTE')
export class AsignacionSimulacroController {
  constructor(private readonly asignacionService: AsignacionSimulacroService) {}

  /**
   * POST /asignaciones-simulacro
   * Asignar un simulacro a un grupo
   */
  @Post()
  create(@Body() createDto: CreateAsignacionSimulacroDto) {
    return this.asignacionService.create(createDto);
  }

  /**
   * GET /asignaciones-simulacro
   * Obtener todas las asignaciones
   */
  @Get()
  findAll() {
    return this.asignacionService.findAll();
  }

  /**
   * GET /asignaciones-simulacro/grupo/:idGrupo
   * Obtener las asignaciones de un grupo
   */
  @Get('grupo/:idGrupo')
  findByGrupo(@Param('idGrupo', ParseIntPipe) idGrupo: number) {
    return this.asignacionService.findByGrupo(idGrupo);
  }

  /**
   * GET /asignaciones-simulacro/:id
   * Obtener una asignación por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.asignacionService.findOne(id);
  }

  /**
   * PATCH /asignaciones-simulacro/:id
   * Cambiar fechas, intentos o estado
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateAsignacionSimulacroDto,
  ) {
    return this.asignacionService.update(id, updateDto);
  }

  /**
   * DELETE /asignaciones-simulacro/:id
   * Eliminar una asignación
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.asignacionService.remove(id);
  }
}
