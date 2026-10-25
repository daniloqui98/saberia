import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto.js';
import { IsBoolean, IsOptional } from 'class-validator';

// PartialType hace que todas las propiedades de CreateUserDto sean opcionales
// (incluye id_rol para cambiar el rol del usuario)
export class UpdateUserDto extends PartialType(CreateUserDto) {
  // Campo opcional para actualizar el estado activo
  @IsBoolean({ message: 'estado debe ser un valor booleano' })
  @IsOptional()
  estado?: boolean;
}
