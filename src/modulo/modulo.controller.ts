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
import { ModuloService } from './modulo.service.js';
import { CreateModuloDto } from './dto/create-modulo.dto.js';
import { UpdateModuloDto } from './dto/update-modulo.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('modulos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class ModuloController {
  constructor(private readonly moduloService: ModuloService) {}

  /**
   * POST /modulos
   * Crear un nuevo módulo
   */
  @Post()
  create(@Body() createModuloDto: CreateModuloDto) {
    return this.moduloService.create(createModuloDto);
  }

  /**
   * GET /modulos
   * Obtener todos los módulos
   */
  @Get()
  findAll() {
    return this.moduloService.findAll();
  }

  /**
   * GET /modulos/:id
   * Obtener un módulo por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moduloService.findOne(id);
  }

  /**
   * PATCH /modulos/:id
   * Actualizar un módulo
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateModuloDto: UpdateModuloDto,
  ) {
    return this.moduloService.update(id, updateModuloDto);
  }

  /**
   * DELETE /modulos/:id
   * Eliminar un módulo
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.moduloService.remove(id);
  }
}
