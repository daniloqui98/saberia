import { PartialType } from '@nestjs/mapped-types';
import { CreatePreguntaDto } from './create-pregunta.dto.js';

// PartialType hace que todas las propiedades de CreatePreguntaDto sean opcionales
// (id_autor acepta null para dejar la pregunta sin autor)
export class UpdatePreguntaDto extends PartialType(CreatePreguntaDto) {}
