import { PartialType } from '@nestjs/mapped-types';
import { CreateSimulacroDto } from './create-simulacro.dto.js';

// PartialType hace que todas las propiedades de CreateSimulacroDto sean opcionales
// (id_modulo acepta null para convertirlo en simulacro mixto)
export class UpdateSimulacroDto extends PartialType(CreateSimulacroDto) {}
