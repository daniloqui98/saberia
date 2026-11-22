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
import { SesionSimService } from './sesion-sim.service.js';
import { CreateSesionSimDto } from './dto/create-sesion-sim.dto.js';
import { UpdateSesionSimDto } from './dto/update-sesion-sim.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { GetUser } from '../auth/decorators/get-user.decorator.js';
import { User } from '../user/entities/user.entity.js';

// Consultar y borrar sesiones: administradores y docentes
// Iniciar y terminar un intento: también el estudiante (solo los suyos)
@Controller('sesiones-sim')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRADOR', 'DOCENTE')
export class SesionSimController {
  constructor(private readonly sesionService: SesionSimService) {}

  /**
   * POST /sesiones-sim
   * Iniciar un intento
   */
  @Roles('ADMINISTRADOR', 'DOCENTE', 'ESTUDIANTE')
  @Post()
  create(@Body() createDto: CreateSesionSimDto, @GetUser() user: User) {
    return this.sesionService.create(createDto, user);
  }

  /**
   * GET /sesiones-sim
   * Obtener todas las sesiones
   */
  @Get()
  findAll() {
    return this.sesionService.findAll();
  }

  /**
   * GET /sesiones-sim/perfil/:idPerfil
   * Obtener los intentos de un estudiante
   */
  @Get('perfil/:idPerfil')
  findByPerfil(@Param('idPerfil', ParseIntPipe) idPerfil: number) {
    return this.sesionService.findByPerfil(idPerfil);
  }

  /**
   * GET /sesiones-sim/:id
   * Obtener una sesión por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sesionService.findOne(id);
  }

  /**
   * PATCH /sesiones-sim/:id
   * Terminar un intento (Finalizado o Abandonado)
   */
  @Roles('ADMINISTRADOR', 'DOCENTE', 'ESTUDIANTE')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSesionSimDto,
    @GetUser() user: User,
  ) {
    return this.sesionService.update(id, updateDto, user);
  }

  /**
   * DELETE /sesiones-sim/:id
   * Eliminar una sesión
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sesionService.remove(id);
  }
}
