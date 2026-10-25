import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Ip,
} from '@nestjs/common';
import { LogAccionService } from './log-accion.service.js';
import { CreateLogAccionDto } from './dto/create-log-accion.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

// Es una tabla de auditoría: los registros no se editan ni se borran,
// por eso no tiene PATCH ni DELETE
@Controller('log-acciones')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRADOR')
export class LogAccionController {
  constructor(private readonly logService: LogAccionService) {}

  /**
   * POST /log-acciones
   * Registrar una acción
   */
  @Post()
  create(@Body() createLogDto: CreateLogAccionDto, @Ip() ip: string) {
    return this.logService.create(createLogDto, ip);
  }

  /**
   * GET /log-acciones
   * Obtener todo el log
   */
  @Get()
  findAll() {
    return this.logService.findAll();
  }

  /**
   * GET /log-acciones/usuario/:idUsuario
   * Obtener las acciones de un usuario
   */
  @Get('usuario/:idUsuario')
  findByUsuario(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    return this.logService.findByUsuario(idUsuario);
  }

  /**
   * GET /log-acciones/:id
   * Obtener un registro del log
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.logService.findOne(id);
  }
}
