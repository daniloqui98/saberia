import { PartialType } from '@nestjs/mapped-types';
import { CreateModuloDto } from './create-modulo.dto.js';

// PartialType hace que todas las propiedades de CreateModuloDto sean opcionales
export class UpdateModuloDto extends PartialType(CreateModuloDto) {}
