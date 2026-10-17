import { PartialType } from '@nestjs/mapped-types';
import { CreateFacultadDto } from './create-facultad.dto.js';

// PartialType hace que todas las propiedades de CreateFacultadDto sean opcionales
export class UpdateFacultadDto extends PartialType(CreateFacultadDto) {}
