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
import { GrupoService } from './grupo.service.js';
import { CreateGrupoDto } from './dto/create-grupo.dto.js';
import { UpdateGrupoDto } from './dto/update-grupo.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('grupos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRADOR')
export class GrupoController {
  constructor(private readonly grupoService: GrupoService) {}

  /**
   * POST /grupos
   * Crear un nuevo grupo
   */
  @Post()
  create(@Body() createGrupoDto: CreateGrupoDto) {
    return this.grupoService.create(createGrupoDto);
  }

  /**
   * GET /grupos
   * Obtener todos los grupos
   */
  @Get()
  findAll() {
    return this.grupoService.findAll();
  }

  /**
   * GET /grupos/:id
   * Obtener un grupo por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.grupoService.findOne(id);
  }

  /**
   * PATCH /grupos/:id
   * Actualizar un grupo
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGrupoDto: UpdateGrupoDto,
  ) {
    return this.grupoService.update(id, updateGrupoDto);
  }

  /**
   * DELETE /grupos/:id
   * Eliminar un grupo
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.grupoService.remove(id);
  }
}
