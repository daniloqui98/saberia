import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateRetroalimentacionDto } from './create-retroalimentacion.dto.js';

// Se pueden cambiar el mensaje, la recomendación y el recurso (null para quitarlo);
// el desempeño no cambia
export class UpdateRetroalimentacionDto extends PartialType(
  OmitType(CreateRetroalimentacionDto, ['id_desempeno'] as const),
) {}
