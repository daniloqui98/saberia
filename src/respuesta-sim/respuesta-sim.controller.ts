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
import { RespuestaSimService } from './respuesta-sim.service.js';
import { CreateRespuestaSimDto } from './dto/create-respuesta-sim.dto.js';
import { UpdateRespuestaSimDto } from './dto/update-respuesta-sim.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { GetUser } from '../auth/decorators/get-user.decorator.js';
import { User } from '../user/entities/user.entity.js';

// Consultar y borrar respuestas: administradores y docentes
// Responder y cambiar una respuesta: también el estudiante (solo en sus sesiones)
@Controller('respuestas-sim')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRADOR', 'DOCENTE')
export class RespuestaSimController {
  constructor(private readonly respuestaService: RespuestaSimService) {}

  /**
   * POST /respuestas-sim
   * Registrar una respuesta
   */
  @Roles('ADMINISTRADOR', 'DOCENTE', 'ESTUDIANTE')
  @Post()
  create(@Body() createDto: CreateRespuestaSimDto, @GetUser() user: User) {
    return this.respuestaService.create(createDto, user);
  }

  /**
   * GET /respuestas-sim
   * Obtener todas las respuestas
   */
  @Get()
  findAll() {
    return this.respuestaService.findAll();
  }

  /**
   * GET /respuestas-sim/sesion/:idSesion
   * Obtener las respuestas de una sesión
   */
  @Get('sesion/:idSesion')
  findBySesion(@Param('idSesion', ParseIntPipe) idSesion: number) {
    return this.respuestaService.findBySesion(idSesion);
  }

  /**
   * GET /respuestas-sim/:id
   * Obtener una respuesta por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.respuestaService.findOne(id);
  }

  /**
   * PATCH /respuestas-sim/:id
   * Cambiar la opción, el tiempo o la marca de revisión
   */
  @Roles('ADMINISTRADOR', 'DOCENTE', 'ESTUDIANTE')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateRespuestaSimDto,
    @GetUser() user: User,
  ) {
    return this.respuestaService.update(id, updateDto, user);
  }

  /**
   * DELETE /respuestas-sim/:id
   * Eliminar una respuesta
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.respuestaService.remove(id);
  }
}
