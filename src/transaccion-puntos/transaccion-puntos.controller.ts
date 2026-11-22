import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TransaccionPuntosService } from './transaccion-puntos.service.js';
import { CreateTransaccionPuntosDto } from './dto/create-transaccion-puntos.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

// Es un libro contable: los movimientos no se editan ni se borran
// (para corregir uno se registra el movimiento contrario), por eso no hay PATCH ni DELETE
@Controller('transacciones-puntos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRADOR', 'DOCENTE')
export class TransaccionPuntosController {
  constructor(private readonly transaccionService: TransaccionPuntosService) {}

  /**
   * POST /transacciones-puntos
   * Registrar un movimiento de puntos
   */
  @Post()
  create(@Body() createDto: CreateTransaccionPuntosDto) {
    return this.transaccionService.create(createDto);
  }

  /**
   * GET /transacciones-puntos
   * Obtener todos los movimientos
   */
  @Get()
  findAll() {
    return this.transaccionService.findAll();
  }

  /**
   * GET /transacciones-puntos/perfil/:idPerfil
   * Historial y saldo de un estudiante
   */
  @Get('perfil/:idPerfil')
  findByPerfil(@Param('idPerfil', ParseIntPipe) idPerfil: number) {
    return this.transaccionService.findByPerfil(idPerfil);
  }

  /**
   * GET /transacciones-puntos/:id
   * Obtener un movimiento por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.transaccionService.findOne(id);
  }
}
