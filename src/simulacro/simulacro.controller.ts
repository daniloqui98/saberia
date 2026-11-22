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
import { SimulacroService } from './simulacro.service.js';
import { CreateSimulacroDto } from './dto/create-simulacro.dto.js';
import { UpdateSimulacroDto } from './dto/update-simulacro.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { GetUser } from '../auth/decorators/get-user.decorator.js';
import { User } from '../user/entities/user.entity.js';

// Los docentes también diseñan simulacros
@Controller('simulacros')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRADOR', 'DOCENTE')
export class SimulacroController {
  constructor(private readonly simulacroService: SimulacroService) {}

  /**
   * POST /simulacros
   * Crear un nuevo simulacro (el creador por defecto es quien hace la petición)
   */
  @Post()
  create(
    @Body() createSimulacroDto: CreateSimulacroDto,
    @GetUser() user: User,
  ) {
    return this.simulacroService.create(createSimulacroDto, user.id_usuario);
  }

  /**
   * GET /simulacros
   * Obtener todos los simulacros
   */
  @Get()
  findAll() {
    return this.simulacroService.findAll();
  }

  /**
   * GET /simulacros/:id
   * Obtener un simulacro por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.simulacroService.findOne(id);
  }

  /**
   * PATCH /simulacros/:id
   * Actualizar un simulacro
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSimulacroDto: UpdateSimulacroDto,
  ) {
    return this.simulacroService.update(id, updateSimulacroDto);
  }

  /**
   * DELETE /simulacros/:id
   * Eliminar un simulacro
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.simulacroService.remove(id);
  }
}
