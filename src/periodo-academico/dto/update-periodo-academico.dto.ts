import { PartialType } from '@nestjs/mapped-types';
import { CreatePeriodoAcademicoDto } from './create-periodo-academico.dto.js';

// PartialType hace que todas las propiedades de CreatePeriodoAcademicoDto sean opcionales
export class UpdatePeriodoAcademicoDto extends PartialType(
  CreatePeriodoAcademicoDto,
) {}
