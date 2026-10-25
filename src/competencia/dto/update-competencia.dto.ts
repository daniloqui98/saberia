import { PartialType } from '@nestjs/mapped-types';
import { CreateCompetenciaDto } from './create-competencia.dto.js';

// PartialType hace que todas las propiedades de CreateCompetenciaDto sean opcionales
export class UpdateCompetenciaDto extends PartialType(CreateCompetenciaDto) {}
