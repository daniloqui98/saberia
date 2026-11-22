import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { InsigniaEstudianteService } from './insignia-estudiante.service.js';
import { CreateInsigniaEstudianteDto } from './dto/create-insignia-estudiante.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

// No hay PATCH: una insignia otorgada no se edita (se otorga o se revoca)
@Controller('insignias-estudiante')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRADOR', 'DOCENTE')
export class InsigniaEstudianteController {
  constructor(private readonly insigniaService: InsigniaEstudianteService) {}

  /**
   * POST /insignias-estudiante
   * Otorgar una insignia (abona los puntos bonus)
   */
  @Post()
  create(@Body() createDto: CreateInsigniaEstudianteDto) {
    return this.insigniaService.create(createDto);
  }

  /**
   * GET /insignias-estudiante
   * Obtener todas las insignias otorgadas
   */
  @Get()
  findAll() {
    return this.insigniaService.findAll();
  }

  /**
   * GET /insignias-estudiante/perfil/:idPerfil
   * Obtener las insignias de un estudiante
   */
  @Get('perfil/:idPerfil')
  findByPerfil(@Param('idPerfil', ParseIntPipe) idPerfil: number) {
    return this.insigniaService.findByPerfil(idPerfil);
  }

  /**
   * GET /insignias-estudiante/:id
   * Obtener una insignia otorgada
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.insigniaService.findOne(id);
  }

  /**
   * DELETE /insignias-estudiante/:id
   * Revocar una insignia (descuenta los puntos bonus)
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.insigniaService.remove(id);
  }
}
