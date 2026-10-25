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
import { FacultadService } from './facultad.service.js';
import { CreateFacultadDto } from './dto/create-facultad.dto.js';
import { UpdateFacultadDto } from './dto/update-facultad.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('facultades')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRADOR')
export class FacultadController {
  constructor(private readonly facultadService: FacultadService) {}

  /**
   * POST /facultades
   * Crear una nueva facultad
   */
  @Post()
  create(@Body() createFacultadDto: CreateFacultadDto) {
    return this.facultadService.create(createFacultadDto);
  }

  /**
   * GET /facultades
   * Obtener todas las facultades
   */
  @Get()
  findAll() {
    return this.facultadService.findAll();
  }

  /**
   * GET /facultades/:id
   * Obtener una facultad por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.facultadService.findOne(id);
  }

  /**
   * PATCH /facultades/:id
   * Actualizar una facultad
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFacultadDto: UpdateFacultadDto,
  ) {
    return this.facultadService.update(id, updateFacultadDto);
  }

  /**
   * DELETE /facultades/:id
   * Eliminar una facultad
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.facultadService.remove(id);
  }
}
