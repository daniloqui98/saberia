import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateSimPreguntaDto } from './create-sim-pregunta.dto.js';

// Solo se pueden cambiar el orden y el puntaje: para cambiar de pregunta o de
// simulacro se quita la pregunta y se agrega otra
export class UpdateSimPreguntaDto extends PartialType(
  OmitType(CreateSimPreguntaDto, ['id_simulacro', 'id_pregunta'] as const),
) {}
