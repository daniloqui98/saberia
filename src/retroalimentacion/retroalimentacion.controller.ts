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
import { RetroalimentacionService } from './retroalimentacion.service.js';
import { CreateRetroalimentacionDto } from './dto/create-retroalimentacion.dto.js';
import { UpdateRetroalimentacionDto } from './dto/update-retroalimentacion.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

// Los docentes escriben retroalimentaciones; el sistema también las genera
@Controller('retroalimentaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRADOR', 'DOCENTE')
export class RetroalimentacionController {
  constructor(private readonly retroService: RetroalimentacionService) {}

  /**
   * POST /retroalimentaciones
   * Retroalimentación escrita por un docente
   */
  @Post()
  create(@Body() createDto: CreateRetroalimentacionDto) {
    return this.retroService.create(createDto);
  }

  /**
   * POST /retroalimentaciones/generar/:idDesempeno
   * Retroalimentación automática del sistema
   */
  @Post('generar/:idDesempeno')
  generar(@Param('idDesempeno', ParseIntPipe) idDesempeno: number) {
    return this.retroService.generar(idDesempeno);
  }

  /**
   * GET /retroalimentaciones
   * Obtener todas las retroalimentaciones
   */
  @Get()
  findAll() {
    return this.retroService.findAll();
  }

  /**
   * GET /retroalimentaciones/desempeno/:idDesempeno
   * Obtener las retroalimentaciones de un desempeño
   */
  @Get('desempeno/:idDesempeno')
  findByDesempeno(@Param('idDesempeno', ParseIntPipe) idDesempeno: number) {
    return this.retroService.findByDesempeno(idDesempeno);
  }

  /**
   * GET /retroalimentaciones/:id
   * Obtener una retroalimentación por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.retroService.findOne(id);
  }

  /**
   * PATCH /retroalimentaciones/:id
   * Cambiar mensaje, recomendación o recurso
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateRetroalimentacionDto,
  ) {
    return this.retroService.update(id, updateDto);
  }

  /**
   * DELETE /retroalimentaciones/:id
   * Eliminar una retroalimentación
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.retroService.remove(id);
  }
}
