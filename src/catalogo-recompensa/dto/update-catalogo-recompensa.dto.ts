import { PartialType } from '@nestjs/mapped-types';
import { CreateCatalogoRecompensaDto } from './create-catalogo-recompensa.dto.js';

// PartialType hace que todas las propiedades de CreateCatalogoRecompensaDto sean opcionales
export class UpdateCatalogoRecompensaDto extends PartialType(
  CreateCatalogoRecompensaDto,
) {}
