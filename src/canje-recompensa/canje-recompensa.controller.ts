import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CanjeRecompensaService } from './canje-recompensa.service.js';
import { CreateCanjeRecompensaDto } from './dto/create-canje-recompensa.dto.js';
import { UpdateCanjeRecompensaDto } from './dto/update-canje-recompensa.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { GetUser } from '../auth/decorators/get-user.decorator.js';
import { User } from '../user/entities/user.entity.js';

// No hay DELETE: un canje mueve puntos y stock, así que no se borra;
// se anula con PATCH (y se devuelven los puntos y el stock)
@Controller('canjes-recompensa')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRADOR', 'DOCENTE')
export class CanjeRecompensaController {
  constructor(private readonly canjeService: CanjeRecompensaService) {}

  /**
   * POST /canjes-recompensa
   * Canjear una recompensa (el estudiante también, con sus propios puntos)
   */
  @Roles('ADMINISTRADOR', 'DOCENTE', 'ESTUDIANTE')
  @Post()
  create(@Body() createDto: CreateCanjeRecompensaDto, @GetUser() user: User) {
    return this.canjeService.create(createDto, user);
  }

  /**
   * GET /canjes-recompensa
   * Obtener todos los canjes
   */
  @Get()
  findAll() {
    return this.canjeService.findAll();
  }

  /**
   * GET /canjes-recompensa/perfil/:idPerfil
   * Obtener los canjes de un estudiante
   */
  @Get('perfil/:idPerfil')
  findByPerfil(@Param('idPerfil', ParseIntPipe) idPerfil: number) {
    return this.canjeService.findByPerfil(idPerfil);
  }

  /**
   * GET /canjes-recompensa/:id
   * Obtener un canje por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.canjeService.findOne(id);
  }

  /**
   * PATCH /canjes-recompensa/:id
   * Marcar el canje como Entregado o Anulado
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCanjeRecompensaDto,
  ) {
    return this.canjeService.update(id, updateDto);
  }
}
