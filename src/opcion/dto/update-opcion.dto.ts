import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateOpcionDto } from './create-opcion.dto.js';

// Todas las propiedades son opcionales, excepto que id_pregunta NO se puede
// cambiar: una opción siempre pertenece a la misma pregunta
export class UpdateOpcionDto extends PartialType(
  OmitType(CreateOpcionDto, ['id_pregunta'] as const),
) {}
