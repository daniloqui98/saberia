import { PartialType } from '@nestjs/mapped-types';
import { CreateRolDto } from './create-rol.dto.js';

// PartialType hace que todas las propiedades de CreateRolDto sean opcionales
export class UpdateRolDto extends PartialType(CreateRolDto) {}
