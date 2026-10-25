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
import { PerfilDocenteService } from './perfil-docente.service.js';
import { CreatePerfilDocenteDto } from './dto/create-perfil-docente.dto.js';
import { UpdatePerfilDocenteDto } from './dto/update-perfil-docente.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('perfiles-docentes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRADOR')
export class PerfilDocenteController {
  constructor(private readonly perfilService: PerfilDocenteService) {}

  /**
   * POST /perfiles-docentes
   * Crear un perfil docente
   */
  @Post()
  create(@Body() createPerfilDto: CreatePerfilDocenteDto) {
    return this.perfilService.create(createPerfilDto);
  }

  /**
   * GET /perfiles-docentes
   * Obtener todos los perfiles docentes
   */
  @Get()
  findAll() {
    return this.perfilService.findAll();
  }

  /**
   * GET /perfiles-docentes/:id
   * Obtener un perfil docente por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.perfilService.findOne(id);
  }

  /**
   * PATCH /perfiles-docentes/:id
   * Actualizar un perfil docente
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePerfilDto: UpdatePerfilDocenteDto,
  ) {
    return this.perfilService.update(id, updatePerfilDto);
  }

  /**
   * DELETE /perfiles-docentes/:id
   * Eliminar un perfil docente
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.perfilService.remove(id);
  }
}
