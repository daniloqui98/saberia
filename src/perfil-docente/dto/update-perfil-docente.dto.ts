import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreatePerfilDocenteDto } from './create-perfil-docente.dto.js';

// Todas las propiedades son opcionales, excepto que id_usuario NO se puede
// cambiar: el perfil siempre pertenece al mismo usuario (relación 1:1)
export class UpdatePerfilDocenteDto extends PartialType(
  OmitType(CreatePerfilDocenteDto, ['id_usuario'] as const),
) {}
