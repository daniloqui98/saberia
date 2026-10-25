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
import { CatalogoRecompensaService } from './catalogo-recompensa.service.js';
import { CreateCatalogoRecompensaDto } from './dto/create-catalogo-recompensa.dto.js';
import { UpdateCatalogoRecompensaDto } from './dto/update-catalogo-recompensa.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('catalogo-recompensas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRADOR')
export class CatalogoRecompensaController {
  constructor(private readonly recompensaService: CatalogoRecompensaService) {}

  /**
   * POST /catalogo-recompensas
   * Crear una nueva recompensa
   */
  @Post()
  create(@Body() createRecompensaDto: CreateCatalogoRecompensaDto) {
    return this.recompensaService.create(createRecompensaDto);
  }

  /**
   * GET /catalogo-recompensas
   * Obtener todas las recompensas
   */
  @Get()
  findAll() {
    return this.recompensaService.findAll();
  }

  /**
   * GET /catalogo-recompensas/:id
   * Obtener una recompensa por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recompensaService.findOne(id);
  }

  /**
   * PATCH /catalogo-recompensas/:id
   * Actualizar una recompensa
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecompensaDto: UpdateCatalogoRecompensaDto,
  ) {
    return this.recompensaService.update(id, updateRecompensaDto);
  }

  /**
   * DELETE /catalogo-recompensas/:id
   * Eliminar una recompensa
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recompensaService.remove(id);
  }
}
