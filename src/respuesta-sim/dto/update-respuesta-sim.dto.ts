import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateRespuestaSimDto } from './create-respuesta-sim.dto.js';

// Mientras la sesión está en curso se puede cambiar la opción (o dejarla en
// blanco con null), el tiempo y la marca de revisión; la sesión y la
// pregunta no cambian
export class UpdateRespuestaSimDto extends PartialType(
  OmitType(CreateRespuestaSimDto, ['id_sesion', 'id_sim_pregunta'] as const),
) {}
