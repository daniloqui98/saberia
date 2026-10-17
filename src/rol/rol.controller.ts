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
import { RolService } from './rol.service.js';
import { CreateRolDto } from './dto/create-rol.dto.js';
import { UpdateRolDto } from './dto/update-rol.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  /**
   * POST /roles
   * Crear un nuevo rol
   */
  @Post()
  create(@Body() createRolDto: CreateRolDto) {
    return this.rolService.create(createRolDto);
  }

  /**
   * GET /roles
   * Obtener todos los roles
   */
  @Get()
  findAll() {
    return this.rolService.findAll();
  }

  /**
   * GET /roles/:id
   * Obtener un rol por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolService.findOne(id);
  }

  /**
   * PATCH /roles/:id
   * Actualizar un rol
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRolDto: UpdateRolDto,
  ) {
    return this.rolService.update(id, updateRolDto);
  }

  /**
   * DELETE /roles/:id
   * Eliminar un rol
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolService.remove(id);
  }
}
