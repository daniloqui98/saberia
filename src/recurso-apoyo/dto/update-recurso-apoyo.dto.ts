import { PartialType } from '@nestjs/mapped-types';
import { CreateRecursoApoyoDto } from './create-recurso-apoyo.dto.js';

// PartialType hace que todas las propiedades de CreateRecursoApoyoDto sean opcionales
export class UpdateRecursoApoyoDto extends PartialType(CreateRecursoApoyoDto) {}
