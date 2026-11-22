import { PartialType } from '@nestjs/mapped-types';
import { CreateAfirmacionDto } from './create-afirmacion.dto.js';

// PartialType hace que todas las propiedades de CreateAfirmacionDto sean opcionales
export class UpdateAfirmacionDto extends PartialType(CreateAfirmacionDto) {}
