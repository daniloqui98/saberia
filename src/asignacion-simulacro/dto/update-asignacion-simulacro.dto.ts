import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateAsignacionSimulacroDto } from './create-asignacion-simulacro.dto.js';

// Se pueden cambiar las fechas, los intentos y el estado; el grupo y el
// simulacro no: para eso se crea otra asignación
export class UpdateAsignacionSimulacroDto extends PartialType(
  OmitType(CreateAsignacionSimulacroDto, ['id_grupo', 'id_simulacro'] as const),
) {}
