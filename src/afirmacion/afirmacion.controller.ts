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
import { AfirmacionService } from './afirmacion.service.js';
import { CreateAfirmacionDto } from './dto/create-afirmacion.dto.js';
import { UpdateAfirmacionDto } from './dto/update-afirmacion.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('afirmaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRADOR')
export class AfirmacionController {
  constructor(private readonly afirmacionService: AfirmacionService) {}

  /**
   * POST /afirmaciones
   * Crear una nueva afirmación
   */
  @Post()
  create(@Body() createAfirmacionDto: CreateAfirmacionDto) {
    return this.afirmacionService.create(createAfirmacionDto);
  }

  /**
   * GET /afirmaciones
   * Obtener todas las afirmaciones
   */
  @Get()
  findAll() {
    return this.afirmacionService.findAll();
  }

  /**
   * GET /afirmaciones/:id
   * Obtener una afirmación por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.afirmacionService.findOne(id);
  }

  /**
   * PATCH /afirmaciones/:id
   * Actualizar una afirmación
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAfirmacionDto: UpdateAfirmacionDto,
  ) {
    return this.afirmacionService.update(id, updateAfirmacionDto);
  }

  /**
   * DELETE /afirmaciones/:id
   * Eliminar una afirmación
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.afirmacionService.remove(id);
  }
}
