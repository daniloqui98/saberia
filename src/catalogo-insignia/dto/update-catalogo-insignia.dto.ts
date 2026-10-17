import { PartialType } from '@nestjs/mapped-types';
import { CreateCatalogoInsigniaDto } from './create-catalogo-insignia.dto.js';

// PartialType hace que todas las propiedades de CreateCatalogoInsigniaDto sean opcionales
export class UpdateCatalogoInsigniaDto extends PartialType(
  CreateCatalogoInsigniaDto,
) {}
