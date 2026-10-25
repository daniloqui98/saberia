import { PartialType } from '@nestjs/mapped-types';
import { CreateProgramaDto } from './create-programa.dto.js';

// PartialType hace que todas las propiedades de CreateProgramaDto sean opcionales
export class UpdateProgramaDto extends PartialType(CreateProgramaDto) {}
