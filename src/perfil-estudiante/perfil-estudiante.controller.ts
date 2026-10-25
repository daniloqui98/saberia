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
import { PerfilEstudianteService } from './perfil-estudiante.service.js';
import { CreatePerfilEstudianteDto } from './dto/create-perfil-estudiante.dto.js';
import { UpdatePerfilEstudianteDto } from './dto/update-perfil-estudiante.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('perfiles-estudiantes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRADOR')
export class PerfilEstudianteController {
  constructor(private readonly perfilService: PerfilEstudianteService) {}

  /**
   * POST /perfiles-estudiantes
   * Crear un perfil estudiante
   */
  @Post()
  create(@Body() createPerfilDto: CreatePerfilEstudianteDto) {
    return this.perfilService.create(createPerfilDto);
  }

  /**
   * GET /perfiles-estudiantes
   * Obtener todos los perfiles estudiante
   */
  @Get()
  findAll() {
    return this.perfilService.findAll();
  }

  /**
   * GET /perfiles-estudiantes/:id
   * Obtener un perfil estudiante por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.perfilService.findOne(id);
  }

  /**
   * PATCH /perfiles-estudiantes/:id
   * Actualizar un perfil estudiante
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePerfilDto: UpdatePerfilEstudianteDto,
  ) {
    return this.perfilService.update(id, updatePerfilDto);
  }

  /**
   * DELETE /perfiles-estudiantes/:id
   * Eliminar un perfil estudiante
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.perfilService.remove(id);
  }
}
