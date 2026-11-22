import { PartialType } from '@nestjs/mapped-types';
import { CreateEvidenciaDto } from './create-evidencia.dto.js';

// PartialType hace que todas las propiedades de CreateEvidenciaDto sean opcionales
export class UpdateEvidenciaDto extends PartialType(CreateEvidenciaDto) {}
