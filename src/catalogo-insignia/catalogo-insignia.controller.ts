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
import { CatalogoInsigniaService } from './catalogo-insignia.service.js';
import { CreateCatalogoInsigniaDto } from './dto/create-catalogo-insignia.dto.js';
import { UpdateCatalogoInsigniaDto } from './dto/update-catalogo-insignia.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('catalogo-insignias')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class CatalogoInsigniaController {
  constructor(private readonly insigniaService: CatalogoInsigniaService) {}

  /**
   * POST /catalogo-insignias
   * Crear una nueva insignia
   */
  @Post()
  create(@Body() createInsigniaDto: CreateCatalogoInsigniaDto) {
    return this.insigniaService.create(createInsigniaDto);
  }

  /**
   * GET /catalogo-insignias
   * Obtener todas las insignias
   */
  @Get()
  findAll() {
    return this.insigniaService.findAll();
  }

  /**
   * GET /catalogo-insignias/:id
   * Obtener una insignia por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.insigniaService.findOne(id);
  }

  /**
   * PATCH /catalogo-insignias/:id
   * Actualizar una insignia
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInsigniaDto: UpdateCatalogoInsigniaDto,
  ) {
    return this.insigniaService.update(id, updateInsigniaDto);
  }

  /**
   * DELETE /catalogo-insignias/:id
   * Eliminar una insignia
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.insigniaService.remove(id);
  }
}
