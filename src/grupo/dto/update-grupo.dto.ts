import { PartialType } from '@nestjs/mapped-types';
import { CreateGrupoDto } from './create-grupo.dto.js';

// PartialType hace que todas las propiedades de CreateGrupoDto sean opcionales
export class UpdateGrupoDto extends PartialType(CreateGrupoDto) {}
