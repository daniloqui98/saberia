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
import { ProgramaService } from './programa.service.js';
import { CreateProgramaDto } from './dto/create-programa.dto.js';
import { UpdateProgramaDto } from './dto/update-programa.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('programas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRADOR')
export class ProgramaController {
  constructor(private readonly programaService: ProgramaService) {}

  /**
   * POST /programas
   * Crear un nuevo programa
   */
  @Post()
  create(@Body() createProgramaDto: CreateProgramaDto) {
    return this.programaService.create(createProgramaDto);
  }

  /**
   * GET /programas
   * Obtener todos los programas
   */
  @Get()
  findAll() {
    return this.programaService.findAll();
  }

  /**
   * GET /programas/:id
   * Obtener un programa por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.programaService.findOne(id);
  }

  /**
   * PATCH /programas/:id
   * Actualizar un programa
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProgramaDto: UpdateProgramaDto,
  ) {
    return this.programaService.update(id, updateProgramaDto);
  }

  /**
   * DELETE /programas/:id
   * Eliminar un programa
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.programaService.remove(id);
  }
}
